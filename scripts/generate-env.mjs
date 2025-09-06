// scripts/generate-env.mjs
import { writeFile } from 'fs/promises';

const content = `window.ENV = {
  YOUTUBE_API_KEY: "${process.env.YOUTUBE_API_KEY ?? ""}",
  YOUTUBE_CHANNEL_ID: "${process.env.YOUTUBE_CHANNEL_ID ?? ""}"
};\n`;

await writeFile("public/env.js", content, "utf8");
console.log("✓ public/env.js gerado");
