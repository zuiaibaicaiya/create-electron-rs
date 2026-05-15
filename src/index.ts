import path from 'path';
import { fileURLToPath } from 'url';
import {
  type Argv,
  type ESLintTemplateName,
  checkCancel,
  create,
  select,
} from 'create-rstack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const frameworkAlias: Record<string, string> = {
  vue: 'vue3',
};

async function getTemplateName({ template }: Argv) {
  if (typeof template === 'string') {
    const pair = template.split('-');
    const language = pair[1] ?? 'js';
    const framework = pair[0];

    return `${frameworkAlias[framework] ?? framework}-${language}`;
  }

  const framework = checkCancel<string>(
    await select({
      message: 'Select framework',
      options: [
        { value: 'react', label: 'React 19' },
        { value: 'vue3', label: 'Vue 3' },
      ],
    }),
  );

  const language = checkCancel<string>(
    await select({
      message: 'Select language',
      options: [
        { value: 'ts', label: 'TypeScript' },
      ],
    }),
  );

  return `${framework}-${language}`;
}

function mapESLintTemplate(templateName: string): ESLintTemplateName {
  switch (templateName) {
    case 'react-ts':
      return templateName;
    case 'vue3-ts':
      return 'vue-ts';
  }
  const language = templateName.split('-')[1];
  return `vanilla-${language}` as ESLintTemplateName;
}

create({
  root: path.resolve(__dirname, '..', 'templates'),
  name: 'electron-rs',
  version: '0.0.1',
  templates: [
    'react-ts',
    'vue3-ts',

  ],
  getTemplateName,
  mapESLintTemplate,
});
