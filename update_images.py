import re

filepath = r'd:\mobile accesories premium shopify store\js\admin.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# IDs
ids = [
  '1592899677977-9c10ca588bbd', '1616348436168-de43ad0db179', '1585386959984-a4155224a1ad',
  '1609081219090-a6d81d3085bf', '1558618666-fcd25c85f82e', '1611532736597-de2d4265fba3',
  '1622445275576-721325763afe', '1572569511254-d8f925fe2cbb', '1615663245857-ac93bb7c39e7',
  '1505740420928-5e560c06d30e', '1606220588913-b3aacb4d2f46', '1613040809024-b4ef7ba99bc3',
  '1608043152269-423dbba4e7e1', '1631867934555-7ecb898b4ecb', '1585338107529-13afc25806f9',
  '1624996379697-f01d168b1a52', '1610465299999-e5640938059e', '1588609503487-b9595d2c25a0',
  '1575311373937-040b8e1fd5b6', '1542496658-e33a6d0d50f6', '1508685096489-7aacd43bd3b1',
  '1617043786394-f977fa12eddf', '1434494878577-86c23bcb06b9', '1598327105666-5b89351aff97',
  '1605236453806-6ff36851218e', '1621422709214-72b2203be189', '1584006682522-bbc16028565b',
  '1555627048-b4b12631584c', '1511707171634-5f897ff02aa9', '1523206489230-c622414bf34f',
  '1494698853255-d0fa521abc6c', '1505156868547-9b1e7fd040ce', '1512054502232-10a0a035d672',
  '1495128408331-d85ac943e8c2', '1526406915894-7bcd65f60845', '1531297172864-07d044234568'
]

content = content.replace("'royalSphire_products_v2'", "'royalSphire_products_v4'")
content = content.replace("'royalSphire_products_v3'", "'royalSphire_products_v4'")
content = content.replace("'royalSphire_products'", "'royalSphire_products_v4'")

idx = 0
def replacer(match):
    global idx
    new_url = f'https://images.unsplash.com/photo-{ids[idx % len(ids)]}?auto=format&fit=crop&w=500&q=80'
    idx += 1
    url = match.group(2)
    return match.group(0).replace(url, new_url)

pattern = re.compile(r'name:\s*"([^"]+)",.*?imageUrl:\s*"([^"]+)"', re.DOTALL)
new_content = pattern.sub(replacer, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated images successfully!')
