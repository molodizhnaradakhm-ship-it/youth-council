import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Setup __dirname equivalent ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Get icon name from CLI ---
const rawName = process.argv[2];

if (!rawName) {
  console.error('\x1b[31m', '❌ Icon name. Example: npm run new-icon CaretDown');
  process.exit(1);
}

const componentName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

// --- Where to generate ---
const iconsDir = path.join(__dirname, '..', 'assets', 'react-icons');
const componentFile = path.join(iconsDir, `${componentName}.tsx`);

if (fs.existsSync(componentFile)) {
  console.error('\x1b[31m', `❌ Component ${componentName}.tsx already exist.`);
  process.exit(1);
}

fs.ensureDirSync(iconsDir);

// --- Template ---
const componentCode = `type Props = {
  className?: string;
};

export const ${componentName} = ({ className }: Props) => {
  return (
    // className={className}
    {/* Put your svg here */}
  );
};
`;

// --- Write file ---
fs.writeFileSync(componentFile, componentCode);
console.info('\x1b[32m', `✅ Component created: src/assets/react-icons/${componentName}.tsx`);
