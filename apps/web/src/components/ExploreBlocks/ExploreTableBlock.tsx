import type { ExploreTableBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

type Cell = NonNullable<
  NonNullable<ExploreTableBlockFields['rows']>[number]['cells']
>[number];

export const ExploreTableBlock = ({
  caption,
  headerRow,
  rows,
}: ExploreTableBlockFields) => {
  const safeRows = rows?.filter((r) => r.cells && r.cells.length > 0) ?? [];

  if (safeRows.length === 0) {
    return null;
  }

  const [headRow, ...bodyRows] = headerRow ? safeRows : [null, ...safeRows];
  const thead =
    headRow && headerRow ? (
      <thead>
        <tr>
          {headRow.cells?.map((cell, i) => (
            <th key={`h-${i}`}>
              <CellValue cell={cell} />
            </th>
          ))}
        </tr>
      </thead>
    ) : null;

  const tbodyRows = headerRow ? bodyRows : safeRows;

  return (
    <div className={styles.tableWrap}>
      {caption?.trim() ? <p className={styles.tableCaption}>{caption.trim()}</p> : null}
      <table className={styles.table}>
        {thead}
        <tbody>
          {tbodyRows.map((row, ri) => {
            if (!row) {
              return null;
            }

            return (
              <tr key={row.id ?? `r-${ri}`}>
                {row.cells?.map((cell, ci) => (
                  <td key={cell.id ?? `c-${ri}-${ci}`}>
                    <CellValue cell={cell} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function CellValue({ cell }: { cell: Cell }) {
  return <>{cell.value}</>;
}
