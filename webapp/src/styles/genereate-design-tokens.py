import json

input_file = "./cleaned-design-tokens.json"
output_file = "./test.css"

with open(input_file, "r") as f:
    data = json.load(f)


def generate_color_pallete(token_data):
    if isinstance(token_data, dict):
        print("dict")
        color_palette = data["color pallete"]
        resolved_palette = {}
        for palette_name, shades_dict in color_palette.items():
            shade_list = []
            for shade_name, shade_data in shades_dict.items():
                shade_entry = {}
                if ("color pallete" in shade_data["value"]):
                    ref_parts = shade_data["value"].strip("{}").split(".")
                    for existing_entry in resolved_palette[ref_parts[1]]:
                        for existing_shade_name, existing_shade_value in existing_entry.items():
                            print(existing_shade_name, ref_parts[2])
                            if existing_shade_name == ref_parts[2]:
                                shade_entry[shade_name] = existing_shade_name
                else:
                    shade_entry[shade_name] = shade_data["value"]
                    shade_list.append(shade_entry)
                    resolved_palette[palette_name] = shade_list
        print(resolved_palette)

    else:
        print("error")


generate_color_pallete(data)
