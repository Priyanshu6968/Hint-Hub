import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 48, 128];
const svgPath = join(__dirname, '../../public/favicon.svg');
const iconsDir = join(__dirname, '../icons');

// Create icons directory if it doesn't exist
mkdirSync(iconsDir, { recursive: true });

// Read SVG file
const svgBuffer = readFileSync(svgPath);

// Generate PNG icons for each size
async function generateIcons() {
  console.log('Generating extension icons...');

  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated icon-${size}.png`);
  }

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
