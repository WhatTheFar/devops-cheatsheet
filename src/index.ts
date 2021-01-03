import { renderMarkdown } from '@awesome-whatthefar/parser';
import { generateDevOpsItemsMap } from './items';
import { resolve } from 'path';

async function main(): Promise<void> {
  const items = await generateDevOpsItemsMap();
  await renderMarkdown(
    {
      fileName: 'README.md',
      dirPath: resolve(__dirname, '..'),
      sourceFilePath: resolve(__dirname, '../README.md'),
      reference: {},
    },
    items,
    {
      verbose: true,
      tableOfContents: true,
    },
  );
}

main();
