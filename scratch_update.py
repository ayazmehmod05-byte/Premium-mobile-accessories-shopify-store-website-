import re
import urllib.parse
import json

filepath = r"d:\mobile accesories premium shopify store\js\admin.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace STORAGE_KEY first
content = content.replace(
    'STORAGE_KEY: "premium_accessories_products"',
    'STORAGE_KEY: "premium_accessories_products_v2"'
)

# Find each block
def replacer(match):
    name = match.group(1)
    url = match.group(2)
    if 'unsplash.com' in url:
        encoded_name = urllib.parse.quote(name + " mobile accessory high quality product photo studio lighting")
        new_url = f"https://image.pollinations.ai/prompt/{encoded_name}?width=500&height=500&nologo=true"
        # We replace ONLY the imageUrl part in the match string
        full_match = match.group(0)
        return full_match.replace(url, new_url)
    return match.group(0)

# Matches from name: "..." to imageUrl: "..."
pattern = re.compile(
    r'name:\s*"([^"]+)",.*?imageUrl:\s*"([^"]+)"',
    re.DOTALL
)

new_content = pattern.sub(replacer, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated admin.js successfully")
