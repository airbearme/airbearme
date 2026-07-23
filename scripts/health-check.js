#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const failures = [];
const checks = [];

function check(name, condition, detail) {
  if (condition) checks.push(`PASS ${name}`);
  else failures.push(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    failures.push(`FAIL valid JSON: ${file} — ${error.message}`);
    return null;
  }
}

const packageJson = readJson('package.json');
const lockJson = readJson('package-lock.json');
const manifest = readJson('public/manifest.json');

for (const file of [
  'app/layout.tsx',
  'lib/supabase.ts',
  'next.config.js',
  '.env.example',
  'public/sw.js',
  'public/manifest.json',
  'supabase-schema-fixed.sql',
]) {
  check(`required file ${file}`, fs.existsSync(path.join(root, file)));
}

if (packageJson) {
  for (const script of ['verify', 'lint', 'build']) {
    check(`package script ${script}`, typeof packageJson.scripts?.[script] === 'string');
  }
}

if (packageJson && lockJson) {
  check('lockfile version matches package', lockJson.lockfileVersion === 3);
  const rootPackage = lockJson.packages?.[''];
  check('lockfile root package exists', Boolean(rootPackage));
  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, version] of Object.entries(packageJson[section] || {})) {
      check(`lockfile ${section} ${name}`, rootPackage?.[section]?.[name] === version,
        `expected ${version}, found ${rootPackage?.[section]?.[name] || 'missing'}`);
    }
  }
}

if (manifest) {
  check('manifest name', typeof manifest.name === 'string' && manifest.name.length > 0);
  check('manifest start_url', typeof manifest.start_url === 'string');
  check('manifest display', ['standalone', 'fullscreen', 'minimal-ui', 'browser'].includes(manifest.display));
  check('manifest icons', Array.isArray(manifest.icons) && manifest.icons.length > 0);
}

const routeFiles = [
  'page.tsx', 'login/page.tsx', 'register/page.tsx', 'forgot-password/page.tsx',
  'reset-password/page.tsx', 'book/page.tsx', 'add-items/page.tsx', 'payments/page.tsx',
  'in-route/page.tsx', 'arrival/page.tsx', 'travel-log/page.tsx', 'tshirt-promo/page.tsx',
];
for (const route of routeFiles) check(`route ${route}`, fs.existsSync(path.join(root, 'app', route)));

const nextConfig = read('next.config.js');
check('Next config has no deprecated experimental server package option',
  !nextConfig.includes('experimental.serverComponentsExternalPackages'));
check('Next config does not expose server secrets through env',
  !nextConfig.includes('SUPABASE_SERVICE_ROLE_KEY') && !nextConfig.includes('STRIPE_SECRET_KEY'));

const envExample = read('.env.example');
for (const key of [
  'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET',
]) check(`env example ${key}`, new RegExp(`^${key}=`, 'm').test(envExample));

let trackedFiles = [];
try {
  trackedFiles = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0').filter(Boolean);
} catch (error) {
  failures.push(`FAIL git tracked-file scan — ${error.message}`);
}
for (const file of trackedFiles) {
  const base = path.basename(file);
  check(`no tracked local env file ${file}`, !/^\.env(?:\.|$)/.test(base) || base === '.env.example');
  if (base === '.env.example' || file.endsWith('package-lock.json')) continue;
  try {
    const content = read(file);
    const secret = /(sk_(?:live|test)_[A-Za-z0-9]{16,}|whsec_[A-Za-z0-9]{16,}|-----BEGIN [A-Z ]+ PRIVATE KEY-----)/;
    check(`no credential pattern ${file}`, !secret.test(content));
  } catch { /* binary or unreadable files are outside this text check */ }
}

const schema = read('supabase-schema-fixed.sql');
const tables = ['locations', 'users', 'drivers', 'chariots', 'rides', 'ride_items', 'inventory', 'tshirt_purchases', 'payments', 'user_settings'];
for (const table of tables) {
  check(`RLS enabled for ${table}`, new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`, 'i').test(schema));
}
const migrations = fs.readdirSync(path.join(root, 'supabase/migrations')).filter((file) => file.endsWith('.sql')).sort();
check('Supabase migrations are timestamp ordered', migrations.every((file, index) => index === 0 || file.slice(0, 14) >= migrations[index - 1].slice(0, 14)));
check('hardening migration has indexes', read('supabase/migrations/20260723000000_harden_airbear.sql').includes('CREATE INDEX'));
check('hardening migration avoids destructive table drops', !read('supabase/migrations/20260723000000_harden_airbear.sql').match(/DROP\s+TABLE/i));

console.log(checks.join('\n'));
if (failures.length) {
  console.error(`\n${failures.join('\n')}`);
  console.error(`\nHealth check failed: ${failures.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`\nHealth check passed: ${checks.length} checks.`);
}
