import re

def minify_css(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Eliminar comentarios multilínea
    css = re.sub(r'/\*[\s\S]*?\*/', '', css)

    # 2. Normalizar múltiples espacios/saltos de línea a uno solo
    css = re.sub(r'\s+', ' ', css)

    # 3. Eliminar espacios alrededor de llaves, puntos y comas, dos puntos y comas
    # Ojo: no tocar espacios alrededor de operadores calc (+, -)
    css = re.sub(r'\s*\{\s*', '{', css)
    css = re.sub(r'\s*\}\s*', '}', css)
    css = re.sub(r'\s*;\s*', ';', css)
    css = re.sub(r'\s*,\s*', ',', css)
    css = re.sub(r':\s+', ':', css)

    # 4. Eliminar punto y coma final antes de cierre de llave
    css = re.sub(r';\}', '}', css)

    css = css.strip()
    if not css.startswith('@charset'):
        css = '@charset "UTF-8";' + css

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(css)

    print(f"Minificación completada. Tamaño: {len(css)} bytes.")

if __name__ == '__main__':
    minify_css('solution.css', 'solution.min.css')
