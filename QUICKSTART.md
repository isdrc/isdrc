# Quick Start Guide

## What Changed?

Your members.html now loads member data dynamically from members.json instead of having hardcoded cards in the HTML.

## Files Created/Modified

### Modified:
- **members.html** - Removed hardcoded member cards, added 4 empty containers
- **members.json** - Added all member data with categories
- **script.js** - Added member loading & rendering logic

### New:
- **server.js** - Simple Node.js HTTP server
- **test.html** - Validation test file
- **IMPLEMENTATION_SUMMARY.md** - Detailed documentation

## Running Locally

### Option 1: Python (Recommended if available)
```powershell
cd c:\Users\ARPAN\Desktop\WEBDEV
python3 -m http.server 8000
```
Then visit: http://localhost:8000/members.html

### Option 2: Node.js
```powershell
cd c:\Users\ARPAN\Desktop\WEBDEV
node server.js
```
Then visit: http://localhost:8000/members.html

### Option 3: VS Code (No setup needed)
1. Right-click `members.html` in file explorer
2. Select "Open with Live Server" (requires Live Server extension)

## Adding New Members

Edit `members.json` and add:
```json
{
  "name": "John Doe",
  "role": "PhD Student at Department of Physics",
  "interests": "Quantum Computing, AI",
  "email": "john@example.com",
  "img": "john.jpg",
  "imgAlt": "John Doe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "scholar": "https://scholar.google.com/citations?user=...",
  "category": "students"
}
```

Save the file - members appear automatically on page load!

## Important Notes

✓ All original CSS is preserved - layout looks identical
✓ Member cards are rendered with exact same HTML structure
✓ Social icons (LinkedIn, Google Scholar) included as inline SVGs
✓ Images default to placeholder.png if not provided
✓ Safe HTML escaping prevents XSS vulnerabilities
✓ No changes to navigation, theme toggle, or other features

## Troubleshooting

If members don't appear:
1. Check browser console (F12) for errors
2. Verify members.json is in the same folder as members.html
3. Make sure JSON syntax is valid (use test.html to validate)
4. Try opening test.html to verify system setup

Done! 🎉
