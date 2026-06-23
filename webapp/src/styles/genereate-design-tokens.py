import json

input_file = "./cleaned-design-tokens.json"
output_file = "./test.css"

with open(input_file, "r") as f:
    data = json.load(f)


def resolve_reference(ref_str, source):
    path_parts = ref_str.strip("{}").split(".")
    current = source
    for part in path_parts:
        current = current[part]
    return current["value"]


def build_color_palette(source):
    color_palette_data = source["color pallete"]
    resolved = {}

    for palette_name, shades in color_palette_data.items():
        shade_map = {}
        for shade_name, shade_entry in shades.items():
            raw = shade_entry["value"]
            if raw.startswith("{"):
                shade_map[shade_name] = resolve_reference(raw, source)
            else:
                shade_map[shade_name] = raw
        resolved[palette_name] = shade_map

    return resolved


palette = build_color_palette(data)
print(palette)
