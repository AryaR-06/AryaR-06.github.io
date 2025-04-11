import os
import re

html_dir = "./"

title_pattern = re.compile(r'setTitles\(\s*["\'](.+?)["\']\s*\)\s*;\s*//\s*(\d+)')
section_pattern = re.compile(r'<section\s+id=["\'](.+?)["\']>\s*<h([1-6])>(.+?)</h\2>', re.DOTALL)

toc_items = []
page_data = []

# Step 1: Extract page titles and sections with IDs
for filename in sorted(os.listdir(html_dir)):
    if filename.endswith(".html") and filename not in ["index.html"]:
        with open(os.path.join(html_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()

        title_match = title_pattern.search(content)
        if not title_match:
            continue

        page_title = title_match.group(1).strip()
        order = int(title_match.group(2))
        sections = section_pattern.findall(content)
        page_data.append((order, page_title, filename, sections))

# Step 2: Sort pages by order
page_data.sort(key=lambda x: x[0])

# Step 3: Build TOC using buttons
toc_html = ['<nav class="table-of-contents">\n  <ul>']
for i, (order, title, filename, sections) in enumerate(page_data, 1):
    page_number = str(i)
    toc_html.append(
        f'    <li class="toc-level-1"><span class="toc-number">{page_number}.</span> '
        f'<button class="toc-button" data-target="{filename}">{title}</button>'
    )

    section_lines = []
    if len(sections) > 1:
        sub_index = []

        for section_id, level_str, header in sections[1:]:
            level = int(level_str)
            header = header.strip()

            while len(sub_index) < level:
                sub_index.append(0)
            while len(sub_index) > level:
                sub_index.pop()

            sub_index[-1] += 1
            full_numbering = f"{page_number}." + ".".join(str(n) for n in sub_index)
            toc_level = level + 1

            if section_id:
                section_lines.append(
                    f'      <li class="toc-level-{toc_level}"><span class="toc-number">{full_numbering}.</span> '
                    f'<button class="toc-button" data-target="{filename}" data-section="{section_id}">{header}</button></li>'
                )
            else:
                print(f"⚠️ No ID found for heading '{header}' in file '{filename}'. Skipping link.")
                section_lines.append(
                    f'      <li class="toc-level-{toc_level}"><span class="toc-number">{full_numbering}.</span> {header}</li>'
                )

    if section_lines:
        toc_html.append("      <ul>")
        toc_html.extend(section_lines)
        toc_html.append("      </ul>")
    toc_html.append("    </li>")

toc_html.append("  </ul>\n</nav>")

# Step 4: Write output
os.makedirs(os.path.join(html_dir, "components"), exist_ok=True)
with open(os.path.join(html_dir, "components/toc.html"), "w", encoding="utf-8") as f:
    f.write("\n".join(toc_html))

print("toc.html generated successfully!")