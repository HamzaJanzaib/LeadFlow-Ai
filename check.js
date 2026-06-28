const fs = require('fs');
const path = require('path');
const clerkTypesPath = require.resolve('@clerk/types/package.json', { paths: [path.join(__dirname, 'apps/web')] });
const appearancePath = path.join(path.dirname(clerkTypesPath), 'dist', 'appearance.d.ts');
if (fs.existsSync(appearancePath)) {
  console.log(fs.readFileSync(appearancePath, 'utf8'));
} else {
  console.log('Not found:', appearancePath);
}
