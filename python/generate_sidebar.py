import os
import re


# Directory containing your HTML files
html_dir = "./"  # adjust if needed

# Regex to find setTitles("...")
title_pattern = re.compile(r'setTitles\(\s*["\'](.+?)["\']\s*\)\s*;\s*//\s*(\d+)')

# HTML template for each button
button_template = '<li><button class="nav-button" data-page="{slug}" data-target="{file}" data-order="{order}">{title}</button></li>'

# Store generated lines
sidebar_items = []

# Loop through all .html files
for filename in sorted(os.listdir(html_dir)):
    if filename.endswith(".html"):
        filepath = os.path.join(html_dir, filename)

        # Skip files you don't want in the sidebar
        if filename in []:
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        match = title_pattern.search(content)
        if match:
            title = match.group(1)
            slug = filename.replace(".html", "")
            if match.group(2):
                order = int(match.group(2))
            else:
                order = 999
                print(f"No order index found in {filename} — placing at the end.")
            sidebar_items.append((order, button_template.format(slug=slug, file=filename, title=title, order=order)))
        else:
            print(f"Skipped {filename}: No setTitles() found.")

sidebar_items.sort(key=lambda x: x[0])
sidebar_items = [item[1] for item in sidebar_items]  # Extract just the HTML strings

# Final HTML wrapper
sidebar_html = (
    '<nav class="sidebar">\n'
    '  <ul>\n'
    + "\n".join("    " + item for item in sidebar_items) +
    '\n  </ul>\n</nav>\n'
)

# Write to sidebar.html
with open(os.path.join(html_dir, "components/sidebar.html"), "w", encoding="utf-8") as out:
    out.write(sidebar_html)

print("sidebar.html generated successfully!")
