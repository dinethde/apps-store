import json

input_file = "design-tokens.tokens.json"
output_file = "cleaned-design-tokens.json"

with open(input_file, "r") as f:
    data = json.load(f)

def remove_extensions(obj):
    if isinstance(obj, dict):
        if (
            "extensions" in obj
            and "org.lukasoppermann.figmaDesignTokens" in obj["extensions"]
        ):
            del obj["extensions"]

        for value in obj.values():
            remove_extensions(value)

    elif isinstance(obj, list):
        for item in obj:
            remove_extensions(item)

remove_extensions(data)

with open(output_file, "w") as f:
    json.dump(data, f, indent=2)

print("Done")
