# TODO: Add Extension Icons

Before you can build and load this Chrome extension, you need to add icon files.

## Required Icons

Create these PNG files in the `public/` directory:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Quick Way to Create Placeholder Icons

You can create simple solid color placeholders using any image editor, or use this command-line approach on macOS:

```bash
# Create a simple colored icon using sips (macOS)
# First create a base image with any tool, then:
sips -z 16 16 base.png --out public/icon16.png
sips -z 48 48 base.png --out public/icon48.png
sips -z 128 128 base.png --out public/icon128.png
```

Or use an online tool like:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

## Icon Design Suggestions

For an ADHD tracker, consider:
- Brain icon
- Focus/target symbol
- Clock or timer
- Check mark or progress indicator

Use colors like purple/blue gradient (matching the popup UI theme).
