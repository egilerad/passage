from pathlib import Path
import html
import re

text=Path('MANUAL.md').read_text()
parts=[]
paragraph=[]
in_code=False

def inline(s):
    protected=[]
    def code(m):
        protected.append('<code>'+html.escape(m.group(1))+'</code>')
        return '\x00'+str(len(protected)-1)+'\x00'
    s=re.sub(r'`([^`]+)`',code,s)
    s=html.escape(s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
    s=re.sub(r'https?://[^\s<]+',lambda m:'<a href="'+m.group(0).rstrip('.,')+'">'+m.group(0).rstrip('.,')+'</a>'+m.group(0)[len(m.group(0).rstrip('.,')):],s)
    return re.sub('\x00(\d+)\x00',lambda m:protected[int(m.group(1))],s)

def flush():
    if paragraph:
        parts.append('<p>'+inline(' '.join(paragraph))+'</p>')
        paragraph.clear()

for line in text.splitlines():
    if line.startswith('```'):
        flush()
        parts.append('</code></pre>' if in_code else '<pre><code>')
        in_code=not in_code
    elif in_code:
        parts.append(html.escape(line)+'\n')
    elif line.startswith('#'):
        flush()
        level=len(line)-len(line.lstrip('#'))
        parts.append(f'<h{level}>'+html.escape(line[level:].strip())+f'</h{level}>')
    elif not line.strip():
        flush()
    else:
        paragraph.append(line)
flush()
header='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PASSAGE / Guide</title><style>body{font:16px/1.8 Helvetica,Arial,sans-serif;color:#111;max-width:800px;margin:50px auto;padding:0 22px}h1{font-size:28px;letter-spacing:.12em}h2{margin-top:40px;font-size:22px}h3{font-size:18px}pre{background:#f5f5f5;padding:24px;white-space:pre-wrap;overflow-wrap:anywhere}code{font:inherit}a{color:inherit;overflow-wrap:anywhere}</style></head><body><a href="./">← Instrument</a>'
Path('manual.html').write_text(header+''.join(parts)+'</body></html>')
print('Rendered manual.html from MANUAL.md')
