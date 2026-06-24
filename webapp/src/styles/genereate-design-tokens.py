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


def build_bg_tokens(bg_variables, pallete):
    main = {}
    for categorries, items in bg_variables.items():
        groups = {}
        print(categorries)
        for groups, sub_category in items.items():
            print(groups)
            sub_categories = {}
            for stg, value in sub_category.items():
                print(stg)
                values = {}
                for c, g in value.items():
                    raw = g["value"]

                    if raw.startswith("{"):
                        path = raw.strip("{}").split(".")
                        # print(palette[path[1][path[2]]])
                        # print(path[1], path[2])
                        # print(palette[path[1]][path[2]])
                        values[c] = palette[path[1]][path[2]]

                    else:
                        values[c] = raw

                print(values)


def build_variables(variables, pallete):
    for v, i in variables.items():
        if v == "bg":
            build_bg_tokens(i, pallete)


palette = build_color_palette(data)
# print(palette)

color_variables = data["color variables"]
resolved_variables = build_variables(color_variables, palette)
print(resolved_variables)
