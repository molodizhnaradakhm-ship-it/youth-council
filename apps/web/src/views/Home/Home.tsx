import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import type { Page } from '@monorepo/cms/src/payload-types';

import styles from './Home.module.scss';

export const Home = ({ homeBlocks }: Page) => {
  return (
    <main className={styles.wrapper}>
      {homeBlocks && <RenderBlocks blocks={homeBlocks} mapper={unifiedBlocksMapper} />}
    </main>
  );
};
