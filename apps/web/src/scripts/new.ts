import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exitError = () => {
  console.error('\x1b[32m', `Usage (view):`, '\x1b[36m', `new view <view-name>`);
  console.error('\x1b[32m', `Usage (component):`, '\x1b[36m', `new component <component-name>`);
  process.exit(1);
};

const inputType = process.argv[2];
if (inputType !== 'component' && inputType !== 'view') exitError();

const componentPath = process.argv[3];
if (!componentPath) exitError();

const componentName = componentPath.split('/').at(-1);

const componentDir = path.join(
  __dirname,
  '..',
  inputType === 'component' ? 'components' : 'views',
  ...componentPath.split('/'),
);

if (fs.existsSync(componentDir)) {
  console.error(`Error: Directory ${componentDir} already exists.`);
  process.exit(1);
}

fs.ensureDirSync(componentDir);

// --- Для component можна залишити стару логіку ---
let tsxTemplate = '';
if (inputType === 'component') {
  const includeClassName = !process.argv.includes('--no-class');
  const tagArg = process.argv.find((arg) => arg.includes('--tag'));
  const tag = tagArg ? tagArg.replace('--tag-', '') : 'div';

  tsxTemplate = `${includeClassName ? "import clsx from 'clsx';" : ''}
import styles from './${componentName}.module.scss';

type Props = {
  ${includeClassName ? 'className?: string;' : ''}
}

export const ${componentName} = ({ ${includeClassName ? 'className' : ''} }: Props) => {
  return (
    <${tag} className={${includeClassName ? 'clsx(styles.wrapper, className)' : 'styles.wrapper'}}>

    </${tag}>
  );
};
`;
} else {
  // --- Для view — section, без Props і clsx ---
  tsxTemplate = `import styles from './${componentName}.module.scss';

export const ${componentName} = () => {
  return (
    <section className={styles.wrapper}>
      
    </section>
  );
};
`;
}

const scssTemplate = `.wrapper {
  @include tablet {

  }

  @include laptop {

  }

  @include desktop {

  }
}
`;

const indexTemplate = `export * from './${componentName}';
`;

Promise.all([
  fs.writeFile(path.join(componentDir, `${componentName}.tsx`), tsxTemplate),
  fs.writeFile(path.join(componentDir, `${componentName}.module.scss`), scssTemplate),
  fs.writeFile(path.join(componentDir, 'index.ts'), indexTemplate),
]).then(() =>
  console.info(
    '\x1b[36m',
    'Successfully created new',
    '\x1b[32m',
    inputType,
    '\x1b[31m',
    componentPath,
  ),
);
