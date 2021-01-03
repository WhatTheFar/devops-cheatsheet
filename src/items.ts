import {
  getDevOpsDataSingleton as getDevDataSingleton,
  tablesFromSubcategoricalData,
} from '@awesome-whatthefar/generator';
import { MarkdownItem, MarkdownTable } from '@awesome-whatthefar/parser';

export function toTable(
  title: string,
  data: Array<{ title: string; description: string; ref: string }>,
): MarkdownTable {
  const tableData = [
    ['Title', 'Description', 'Reference'],
    ...data.map((e) => [e.title, e.description, e.ref]),
  ];

  const table: MarkdownTable = {
    type: 'MarkdownTable',
    title: title === '' ? undefined : title,
    tableData: {
      input: {
        type: 'MemoryInput',
        data: tableData,
      },
      options: {
        align: ['left', 'left', { type: 'Reference', colunm: 0 }],
      },
    },
  };
  return table;
}

export async function generateDevOpsItemsMap(): Promise<{
  [key: string]: MarkdownItem[];
}> {
  const dev = await getDevDataSingleton();

  const initialState: { [key: string]: MarkdownItem[] } = {};

  const itemsMap = dev
    .filter(([mainCategory]) => {
      return mainCategory !== 'Kubernetes';
    })
    .reduceMainCategory((prev, curr) => {
      const { mainCategory, subcategories } = curr;

      if (subcategories.pairs.length == 1) {
        // no subcategories
        const { data } = subcategories.pairs[0];
        return { ...prev, [mainCategory]: [toTable('', data)] };
      } else {
        // subcategories
        const items = tablesFromSubcategoricalData(subcategories, toTable);
        if (items.length == 1 && items[0].type == 'MarkdownSection') {
          const section = items[0];
          return { ...prev, [mainCategory]: section.items || [] };
        }
        return { ...prev, [mainCategory]: items };
      }
    }, initialState);

  return itemsMap;
}
