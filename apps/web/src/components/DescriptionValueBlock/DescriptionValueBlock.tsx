import clsx from 'clsx';

import type { Media } from '@monorepo/cms/src/payload-types';

import { CMSMedia } from '../CMSMedia';
import type { TextType } from '../Text';
import { Text } from '../Text';

import styles from './DescriptionValueBlock.module.scss';

type Props = {
  className?: string;
  description: string;
  value: string;
  index: number;
  image?: Media;
  valueType?: TextType;
  descriptionType?: TextType;
};

export const DescriptionValueBlock = ({
  className,
  description,
  valueType = 'd1',
  index,
  image,
  value,
  descriptionType = 'p2',
}: Props) => {
  const nthChild = index % 2 === 0 ? 'even' : 'odd';
  return (
    <div className={clsx(styles.wrapper, styles[nthChild], styles[index], className)}>
      {image && <CMSMedia className={styles.image} resource={image} />}
      <Text type={valueType} tag='span' color='white'>
        {value}
      </Text>
      <Text type={descriptionType}>{description}</Text>
    </div>
  );
};
