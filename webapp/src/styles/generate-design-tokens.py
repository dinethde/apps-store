import json
import re

input_file = "./cleaned-design-tokens.json"
output_file = "./design-tokens.css"


def normalize_hex(value):
    if isinstance(value, str) and re.match(r"^#[0-9a-fA-F]{8}$", value):
        hex8 = value[1:]
        if hex8[6:8].lower() == "ff":
            return f"#{hex8[0:6].lower()}"
    return value


def resolve_reference(ref_str, palette):
    match = re.match(r"\{color pallete\.(\w+)\.(\w+)\}", ref_str)
    if match:
        palette_name, shade = match.groups()
        value = palette[palette_name][shade]
        if isinstance(value, dict):
            return value["value"]
        return value
    return ref_str


def build_reference_lookup(color_variables):
    lookup = {}

    def flatten_to_lookup(obj, css_prefix="", json_path=""):
        for key, value in obj.items():
            if isinstance(value, dict):
                if "type" in value and value["type"] == "color":
                    token_path = f"{{color variables.{json_path}{key}}}"
                    lookup[token_path] = f"var({css_prefix}-{key})"
                else:
                    flatten_to_lookup(value, f"{css_prefix}-{key}", f"{json_path}{key}.")

    bg = color_variables.get("bg", {})
    flatten_to_lookup(bg, "--color", "bg.")

    text = color_variables.get("text", {})
    flatten_to_lookup(text, "--color-txt", "text.")

    return lookup


REFERENCE_LOOKUP = {}


def resolve_reference_to_var(ref_str):
    if ref_str.startswith("{color pallete."):
        match = re.match(r"\{color pallete\.(\w+)\.(\w+)\}", ref_str)
        if match:
            palette_name, shade = match.groups()
            return f"var(--color-{palette_name}-{shade})"

    if ref_str in REFERENCE_LOOKUP:
        return REFERENCE_LOOKUP[ref_str]

    return ref_str


def build_color_palette(source):
    palette_data = source["color pallete"]
    resolved = {}

    for palette_name, shades in palette_data.items():
        shade_map = {}
        for shade_name, shade_entry in shades.items():
            raw = shade_entry["value"]
            if raw.startswith("{"):
                shade_map[shade_name] = normalize_hex(resolve_reference(raw, palette_data))
            else:
                shade_map[shade_name] = normalize_hex(raw)
        resolved[palette_name] = shade_map

    return resolved


def generate_color_palette_vars(palette):
    lines = []
    for palette_name, shades in palette.items():
        for shade_name, value in shades.items():
            css_var = f"--color-{palette_name}-{shade_name}"
            lines.append(f"  {css_var}: {value};")
    return "\n".join(lines)


def generate_semantic_color_vars(color_variables):
    lines = []

    def flatten_colors(obj, prefix=""):
        for key, value in obj.items():
            if isinstance(value, dict):
                if "type" in value and value["type"] == "color":
                    raw = value["value"]
                    if raw.startswith("{"):
                        resolved = resolve_reference_to_var(raw)
                    else:
                        resolved = normalize_hex(raw)
                    lines.append(f"  {prefix}-{key}: {resolved};")
                else:
                    flatten_colors(value, f"{prefix}-{key}")

    bg = color_variables.get("bg", {})
    flatten_colors(bg, "--color")

    text = color_variables.get("text", {})
    flatten_colors(text, "--color-txt")

    return "\n".join(lines)


def generate_font_family_vars(color_variables):
    font_config = color_variables.get("font", {})
    lines = []
    for key, value in font_config.items():
        if isinstance(value, dict) and "value" in value:
            lines.append(f"  --font-{key}: {value['value']};")
    if any("--font-main" in line for line in lines):
        lines.append("  --font-sans: Inter;")
    return "\n".join(lines)


SHADCN_ALIASES = {
    "primary": "var(--color-fill-brand-main-active)",
    "primary-foreground": "var(--color-txt-white-p1-active)",
    "background": "var(--color-surface-neutral-light-active)",
    "foreground": "var(--color-txt-primary-p1-active)",
    "card": "var(--color-surface-neutral-light-active)",
    "card-foreground": "var(--color-txt-primary-p1-active)",
    "popover": "var(--color-surface-neutral-light-active)",
    "popover-foreground": "var(--color-txt-primary-p2-active)",
    "secondary": "var(--color-fill-secondary-main-active)",
    "secondary-foreground": "var(--color-txt-secondary-p2-active)",
    "muted": "var(--color-fill-neutral-light-hover)",
    "muted-foreground": "var(--color-txt-primary-p3-active)",
    "accent": "var(--color-fill-neutral-light-hover)",
    "accent-foreground": "var(--color-txt-primary-p2-active)",
    "destructive": "var(--color-error-main)",
    "destructive-foreground": "var(--color-txt-white-p1-active)",
    "border": "var(--color-border-neutral-main-active)",
    "input": "var(--color-border-neutral-main-active)",
    "ring": "var(--color-border-secondary-main-active)",
    "sidebar": "var(--color-surface-neutral-light-active)",
    "sidebar-foreground": "var(--color-txt-primary-p2-active)",
    "sidebar-accent-foreground": "var(--color-txt-brand-p1-active)",
    "sidebar-border": "var(--color-border-neutral-main-active)",
}


def generate_shadcn_alias_vars():
    lines = []
    for name, value in SHADCN_ALIASES.items():
        lines.append(f"  --color-{name}: {value};")
    return "\n".join(lines)


def generate_typography_theme_vars(fonts):
    lines = []
    for name, token in fonts.items():
        if token.get("type") != "custom-fontStyle":
            continue
        v = token["value"]
        lines.append(f"  --text-{name}: {v['fontSize']}px;")
        lines.append(f"  --text-{name}--line-height: {v['lineHeight']}px;")
        lines.append(f"  --text-{name}--font-weight: {v['fontWeight']};")
        lines.append(f"  --text-{name}--letter-spacing: {v['letterSpacing']}px;")
    return "\n".join(lines)


def generate_typography_classes(fonts):
    classes = []

    for name, token in fonts.items():
        if token.get("type") != "custom-fontStyle":
            continue
        v = token["value"]

        font_size = v.get("fontSize", 16)
        line_height = v.get("lineHeight", font_size)
        font_weight = v.get("fontWeight", 400)
        letter_spacing = v.get("letterSpacing", 0)
        font_family = v.get("fontFamily", "Inter")

        cls = f""".{name} {{
  font-size: {font_size}px;
  line-height: {line_height}px;
  font-weight: {font_weight};
  letter-spacing: {letter_spacing}px;
  font-family: {font_family}, sans-serif;
}}"""
        classes.append(cls)

    return "\n\n".join(classes)


def generate_component_vars(components):
    lines = []

    def flatten_components(obj, prefix=""):
        for key, value in obj.items():
            if isinstance(value, dict):
                if "type" in value and value["type"] == "color":
                    raw = value["value"]
                    if raw.startswith("{"):
                        resolved = resolve_reference_to_var(raw)
                    else:
                        resolved = normalize_hex(raw)
                    var_name = f"--{prefix}{key}" if prefix else f"--{key}"
                    lines.append(f"  {var_name}: {resolved};")
                else:
                    flatten_components(value, f"{prefix}{key}-")

    flatten_components(components)
    return "\n".join(lines)


with open(input_file, "r") as f:
    data = json.load(f)

REFERENCE_LOOKUP = build_reference_lookup(data["color variables"])

palette = build_color_palette(data)

color_palette_css = generate_color_palette_vars(palette)
semantic_color_css = generate_semantic_color_vars(data["color variables"])
font_family_css = generate_font_family_vars(data["color variables"])
shadcn_alias_css = generate_shadcn_alias_vars()
typography_theme_css = generate_typography_theme_vars(data["font"])
typography_css = generate_typography_classes(data["font"])
component_css = generate_component_vars(data["color variables"]["components"])

css = f"""/* Do not edit this file this is an auto generated file */

@theme {{
{color_palette_css}
{semantic_color_css}
{font_family_css}
{typography_theme_css}
{shadcn_alias_css}
{component_css}
}}

{typography_css}
"""

with open(output_file, "w") as f:
    f.write(css)

print(f"Generated {output_file}")
