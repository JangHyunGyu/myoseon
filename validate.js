/**
 * validate.js - Myoseon project validator
 * Checks index.html, script/CSS refs, JSON-LD, images, structured data
 * Usage: node validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let errors = 0;
let passes = 0;

function pass(msg) {
    console.log(`  \u2705 ${msg}`);
    passes++;
}

function fail(msg) {
    console.log(`  \u274C ${msg}`);
    errors++;
}

function check(condition, passMsg, failMsg) {
    if (condition) {
        pass(passMsg);
    } else {
        fail(failMsg);
    }
}

function fileExists(relPath) {
    return fs.existsSync(path.join(ROOT, relPath));
}

// ─── 1. Core files ───
console.log('\n[1] Core files');

check(fileExists('index.html'), 'index.html exists', 'index.html MISSING');
check(fileExists('robots.txt'), 'robots.txt exists', 'robots.txt MISSING');
check(fileExists('sitemap.xml'), 'sitemap.xml exists', 'sitemap.xml MISSING');
check(fileExists('CNAME'), 'CNAME exists', 'CNAME MISSING');

// ─── 2. Asset files ───
console.log('\n[2] Asset files');

const requiredAssets = [
    'assets/css/style.css',
    'assets/js/main.js',
    'assets/images/favicon.png',
    'assets/images/Myoseon.png',
    'assets/images/Myoseonstories.png',
];

for (const asset of requiredAssets) {
    check(fileExists(asset), `${asset} exists`, `${asset} MISSING`);
}

// ─── 3. Local resource references in index.html ───
console.log('\n[3] Local resource references in index.html');

if (fileExists('index.html')) {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
    const refRegex = /(?:src|href)="([^"]+)"/g;
    let match;
    const checked = new Set();

    while ((match = refRegex.exec(content)) !== null) {
        const ref = match[1];
        // Skip external URLs, anchors, data URIs, javascript:, protocol-relative, mailto:, tel:
        if (/^(https?:\/\/|#|data:|javascript:|\/\/|mailto:|tel:)/.test(ref)) continue;

        // Strip query strings and fragments
        const cleanRef = ref.split('?')[0].split('#')[0];
        if (!cleanRef) continue;
        if (checked.has(cleanRef)) continue;
        checked.add(cleanRef);

        // Check local file references
        if (/\.(html|css|js|png|svg|jpg|jpeg|json|xml|txt|ico|webp)$/.test(cleanRef)) {
            check(fs.existsSync(path.join(ROOT, cleanRef)),
                `ref "${cleanRef}" OK`,
                `ref "${cleanRef}" NOT FOUND`);
        }
    }
}

// ─── 4. JSON-LD structured data ───
console.log('\n[4] JSON-LD structured data');

if (fileExists('index.html')) {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let jsonLdMatch;
    let count = 0;

    while ((jsonLdMatch = jsonLdRegex.exec(content)) !== null) {
        count++;
        try {
            const data = JSON.parse(jsonLdMatch[1]);
            pass(`JSON-LD block #${count}: valid JSON`);

            // Validate required schema.org fields
            check(data['@context'] === 'https://schema.org',
                `JSON-LD #${count}: @context is schema.org`,
                `JSON-LD #${count}: @context missing or incorrect`);

            check(data['@type'] !== undefined,
                `JSON-LD #${count}: has @type ("${data['@type']}")`,
                `JSON-LD #${count}: missing @type`);

            if (data.name) {
                pass(`JSON-LD #${count}: has name ("${data.name}")`);
            }

            if (data.url) {
                pass(`JSON-LD #${count}: has url ("${data.url}")`);
            }

            if (data.description) {
                pass(`JSON-LD #${count}: has description`);
            }

            if (data.inLanguage) {
                pass(`JSON-LD #${count}: has inLanguage ("${data.inLanguage}")`);
            }
        } catch (e) {
            fail(`JSON-LD block #${count}: parse error: ${e.message}`);
        }
    }

    check(count > 0, `Found ${count} JSON-LD block(s)`, 'No JSON-LD structured data found');
}

// ─── 5. HTML structure validation ───
console.log('\n[5] HTML structure');

if (fileExists('index.html')) {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

    check(content.includes('<!DOCTYPE html>'),
        'Has DOCTYPE declaration',
        'Missing DOCTYPE declaration');

    check(content.includes('lang="ko"'),
        'Has lang="ko" attribute',
        'Missing lang="ko" attribute');

    check(content.includes('<title>'),
        'Has <title> tag',
        'Missing <title> tag');

    check(content.includes('meta name="description"'),
        'Has meta description',
        'Missing meta description');

    check(content.includes('meta name="viewport"'),
        'Has viewport meta',
        'Missing viewport meta');

    check(content.includes('rel="canonical"'),
        'Has canonical link',
        'Missing canonical link');

    // Open Graph
    check(content.includes('og:title'),
        'Has og:title',
        'Missing og:title');

    check(content.includes('og:description'),
        'Has og:description',
        'Missing og:description');

    check(content.includes('og:image'),
        'Has og:image',
        'Missing og:image');

    // Twitter Card
    check(content.includes('twitter:card'),
        'Has twitter:card',
        'Missing twitter:card');

    check(content.includes('twitter:image'),
        'Has twitter:image',
        'Missing twitter:image');
}

// ─── 6. OG/Twitter image references ───
console.log('\n[6] OG & Twitter image references');

if (fileExists('index.html')) {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

    // Extract og:image and twitter:image content URLs
    const ogImageMatch = content.match(/property="og:image"\s+content="([^"]+)"/);
    const twitterImageMatch = content.match(/name="twitter:image"\s+content="([^"]+)"/);

    if (ogImageMatch) {
        const ogImageUrl = ogImageMatch[1];
        // Extract path from full URL
        const urlPath = ogImageUrl.replace(/^https?:\/\/[^/]+\//, '');
        if (urlPath && !urlPath.startsWith('http')) {
            check(fileExists(urlPath),
                `og:image file "${urlPath}" exists locally`,
                `og:image file "${urlPath}" NOT FOUND locally`);
        } else {
            pass(`og:image URL: ${ogImageUrl}`);
        }
    }

    if (twitterImageMatch) {
        const twImageUrl = twitterImageMatch[1];
        const urlPath = twImageUrl.replace(/^https?:\/\/[^/]+\//, '');
        if (urlPath && !urlPath.startsWith('http')) {
            check(fileExists(urlPath),
                `twitter:image file "${urlPath}" exists locally`,
                `twitter:image file "${urlPath}" NOT FOUND locally`);
        } else {
            pass(`twitter:image URL: ${twImageUrl}`);
        }
    }
}

// ─── 7. No unexpected broken local links ───
console.log('\n[7] No broken local links');

if (fileExists('index.html')) {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
    // Check that all nav links are either external or anchors
    const allHrefs = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const localLinks = allHrefs.filter(h =>
        !h.startsWith('http') && !h.startsWith('#') && !h.startsWith('//') &&
        !h.startsWith('mailto:') && !h.startsWith('javascript:') && !h.startsWith('tel:')
    );

    for (const link of localLinks) {
        const cleanLink = link.split('?')[0].split('#')[0];
        if (!cleanLink) continue;
        if (/\.(html|css|js|png|svg|jpg|jpeg|json|xml|txt|ico|webp)$/.test(cleanLink)) {
            check(fileExists(cleanLink),
                `Local link "${cleanLink}" resolves`,
                `Local link "${cleanLink}" BROKEN`);
        }
    }
}

// ─── Summary ───
console.log('\n' + '='.repeat(50));
console.log(`PASSED: ${passes}  |  FAILED: ${errors}`);
if (errors > 0) {
    console.log('Validation FAILED.');
    process.exit(1);
} else {
    console.log('All checks passed.');
    process.exit(0);
}
