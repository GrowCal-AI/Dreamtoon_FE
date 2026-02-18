
import os
import re

path = '/Users/choi_eun_jin/Desktop/proj/ai 해커톤/Dreamtoon_FE/src/pages/DreamInputPage.tsx'

with open(path, 'r') as f:
    lines = f.readlines()

# 1. Remove garbage (lines 0-54). Real content starts at index 55.
if len(lines) > 55:
    content_lines = lines[55:]
else:
    print("File too short!")
    exit(1)

# 2. Unindent by 6 spaces
unindented_lines = []
for line in content_lines:
    if line.startswith('      '):
        unindented_lines.append(line[6:])
    else:
        # If line doesn't start with 6 spaces, keep it as is (could be empty lines)
        unindented_lines.append(line)

# 3. Filter out local GenerationResult component
# It starts with `const GenerationResult = ({`
# It ends before `// --- Main Page ---`
final_lines = []
skip_mode = False

for line in unindented_lines:
    if 'const GenerationResult = ({' in line:
        skip_mode = True
    
    if skip_mode and '// --- Main Page ---' in line:
        skip_mode = False
    
    if not skip_mode:
        final_lines.append(line)

# 4. Imports
new_imports = [
    "import { useEffect, useRef, useState } from 'react'\n",
    "import { motion, AnimatePresence } from 'framer-motion'\n",
    "import { useNavigate } from 'react-router-dom'\n",
    "import { Mic, Send, Sparkles, Loader2, Save, RotateCcw, MessageCircle, X, Layout, PlayCircle, Heart, Share2, Download, Copy, Check } from 'lucide-react'\n",
    "import GenerationResult from '@/components/common/GenerationResult'\n",
    "\n"
]

full_content = "".join(new_imports + final_lines)

# 5. Inject Props into usage
# Find <GenerationResult key="result" ...
# We want to add props after key="result"
props_to_add = (
    '\n                    title="무의식의 숲을 지나서"'
    '\n                    date={new Date().toLocaleDateString()}'
    '\n                    mediaUrl="https://images.unsplash.com/photo-1633469924738-52101af51d87?q=80&w=1000&auto=format&fit=crop"'
    '\n                    type={selectedFormat}'
)

# Use regex
# Note: The key="result" might be on a new line or same line.
# In the file it was:
# <GenerationResult
#   key="result"
updated_content = re.sub(
    r'(<GenerationResult\s+key="result")', 
    r'\1' + props_to_add, 
    full_content
)

with open(path, 'w') as f:
    f.write(updated_content)

print("File fixed successfully.")
