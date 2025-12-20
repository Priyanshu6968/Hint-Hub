import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');
const outputPath = path.join(__dirname, '..', 'hint-hub-extension.zip');

// Create a file to stream archive data to
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log('✅ Extension packaged successfully!');
  console.log(`📦 Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📁 Location: ${outputPath}`);
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files from dist directory
archive.directory(distPath, false);

// Finalize the archive
archive.finalize();
