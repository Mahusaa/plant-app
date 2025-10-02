const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create placeholder icon files (in a real app, you'd use sharp or canvas to resize the actual logo)
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // Create a simple SVG-based icon as placeholder
  const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="64" fill="url(#bg)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" text-anchor="middle" fill="white">🌱</text>
</svg>`;

  // For now, we'll create a simple text file that represents the icon
  // In production, you'd convert this SVG to PNG using a library like sharp
  fs.writeFileSync(iconPath.replace('.png', '.svg'), svgContent);
  
  console.log(`Created icon placeholder: icon-${size}x${size}.svg`);
});

console.log('Icon generation complete!');
console.log('Note: In production, convert SVG files to PNG using a tool like sharp or ImageMagick');
