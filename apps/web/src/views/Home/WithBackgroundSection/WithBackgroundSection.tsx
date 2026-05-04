import { RenderBlocks } from '@/components/RenderBlocks';

import { WithBackgroundFeaturesBento } from './WithBackgroundFeaturesBento';
import { WithBackgroundHeading } from './WithBackgroundHeading';
import { WithBackgroundLaunchMap } from './WithBackgroundLaunchMap';
import { WithBackgroundSectionFaq } from './WithBackgroundSectionFaq';

import styles from './WithBackgroundSection.module.scss';

type Props = {
  sectionBlocks?: any[] | null;
};

const SECTION_BLOCK_TYPE = {
  Heading: 'heading-block',
  FeaturesBento: 'features-bento-block',
  LaunchMap: 'launch-map-block',
  SectionFaq: 'section-faq-block',
} as const;

const sectionNestedMapper = {
  [SECTION_BLOCK_TYPE.Heading]: WithBackgroundHeading,
  [SECTION_BLOCK_TYPE.FeaturesBento]: WithBackgroundFeaturesBento,
  [SECTION_BLOCK_TYPE.LaunchMap]: WithBackgroundLaunchMap,
  [SECTION_BLOCK_TYPE.SectionFaq]: WithBackgroundSectionFaq,
};

export const WithBackgroundSection = ({ sectionBlocks }: Props) => {
  const blocks = sectionBlocks ?? [];

  return (
    <section className={styles.root}>
      <RenderBlocks blocks={blocks as never} mapper={sectionNestedMapper} />
    </section>
  );
};

