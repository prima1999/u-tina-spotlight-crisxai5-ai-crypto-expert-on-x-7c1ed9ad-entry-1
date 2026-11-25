// Spotlight @crisxai5 — entry program.
//
// The entry is a public X post introducing @crisxai5 as a must-follow
// AI and crypto expert. All this program does is copy the repository's
// POST.json, which names that post's address, into the output
// directory. The house reads the post itself from that address;
// nothing this program writes about the post counts.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const postPath = join(repoRoot, "POST.json");

const outDir = resolve(
  process.argv[2] ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
);

function fail(message: string): never {
  console.error(`spotlight: ${message}`);
  process.exit(1);
}

if (!existsSync(postPath)) {
  fail(`POST.json not found at ${postPath}`);
}

let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch {
  fail("POST.json is not valid JSON");
}

if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must hold a JSON object");
}

const url = (post as { url?: unknown }).url;
if (typeof url !== "string" || url.length === 0) {
  fail("POST.json must hold a url string");
}

const postAddress =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(?:[^/]+\/status\/\d+|i\/web\/status\/\d+)(?:[?#].*)?$/.test(
    url,
  );
if (!postAddress) {
  fail(`url is not an X post address: ${url}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, "POST.json"));
console.log(`spotlight: wrote ${join(outDir, "POST.json")}`);
console.log(`spotlight: post is ${url}`);
