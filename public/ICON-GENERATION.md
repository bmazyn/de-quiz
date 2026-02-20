# PWA Icon Generation Instructions

## Quick Steps

1. Open `public/generate-icons.html` in a web browser
2. Right-click each canvas image and select "Save image as..."
3. Save the files with these exact names in the `public/` folder:
   - `pwa-192-v2.png` (192x192 canvas)
   - `pwa-512-v2.png` (512x512 canvas)
   - `apple-touch-icon-v2.png` (180x180 canvas)

## What Changed

- **vite.config.ts**: Updated icon references to versioned files (v2)
- **index.html**: Updated apple-touch-icon reference to v2
- Theme colors updated to match dark/purple theme (#667eea, #1a1a1a)
- App description updated to "Database Quiz App"

## Icon Design

The new icons feature a white database symbol (stacked cylinders) on a purple gradient background (#667eea → #764ba2), matching the app's updated branding.

## After Generating Icons

1. Delete or rename old icon files:
   - `pwa-192.png` → backup or delete
   - `pwa-512.png` → backup or delete
   - `apple-touch-icon.png` → backup or delete

2. Run `npm run build` to rebuild with new manifest

3. Test PWA installation to verify new icons appear correctly
