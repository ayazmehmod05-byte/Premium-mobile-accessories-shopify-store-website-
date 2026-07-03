import urllib.request
import urllib.parse
import os
import re
import time

filepath = r'd:\mobile accesories premium shopify store\js\admin.js'
images_dir = r'd:\mobile accesories premium shopify store\images\products'

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all names
names = re.findall(r'name:\s*"([^"]+)"', content)
# Ensure we only get the first 36 (default products)
names = names[:36]

print(f'Found {len(names)} products. Downloading images locally to prevent empty cards...')

for i, name in enumerate(names):
    file_path = os.path.join(images_dir, f'product_{i+1}.jpg')
    # If already exists, skip
    if os.path.exists(file_path) and os.path.getsize(file_path) > 1000:
        print(f'Skipping {name}, already downloaded.')
        continue
    
    prompt = f'Product photography of a premium {name}, modern sleek design, studio lighting, white background, high quality, 4k'
    url = f'https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width=500&height=500&nologo=true'
    
    try:
        print(f'Downloading {i+1}/36: {name}')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(file_path, 'wb') as out_file:
                out_file.write(response.read())
        time.sleep(1) # Be nice to the API
    except Exception as e:
        print(f'Error downloading {name}: {e}')

print('Downloads complete!')

# Now update admin.js to point to the local images
new_content = content.replace("'royalSphire_products_v4'", "'royalSphire_products_v5'")

idx = 0
def replacer(match):
    global idx
    new_url = f'images/products/product_{idx+1}.jpg'
    idx += 1
    url = match.group(2)
    return match.group(0).replace(url, new_url)

pattern = re.compile(r'name:\s*"([^"]+)",.*?imageUrl:\s*"([^"]+)"', re.DOTALL)
new_content = pattern.sub(replacer, new_content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated admin.js successfully!')
