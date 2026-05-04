import clsx from 'clsx';

import { QuoteIcon } from '@/assets/react-icons/QuoteIcon';
import type { Media } from '@monorepo/cms/src/payload-types';

import { CMSMedia } from '../CMSMedia';
import { Text } from '../Text';
import { UniversalSlider } from '../UniversalSlider';
import { UniversalSliderProvider } from '../UniversalSlider/UniversalSliderContext';

import styles from './QuoteSlider.module.scss';

type Props = {
  className?: string;
  quotesList: {
    quote: string;
    author: string;
    position: string;
    logo: string | Media;
    id?: string | null;
  }[];
};

export const QuoteSlider = ({ className, quotesList }: Props) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <UniversalSliderProvider>
        <UniversalSlider
          swiperProps={{
            spaceBetween: 20,
          }}
          className={styles.slider}
          withPagination
          hidePaginationLaptop={false}
        >
          {quotesList.map(({ author, logo, position, quote, id }) => (
            <div key={id} className={styles.sliderItemOuter}>
              <div className={styles.sliderItem}>
                <QuoteIcon className={styles.quoteIcon} />
                <div className={styles.sliderItemIntem}>
                  <Text type='h4' className={styles.quote}>
                    {quote}
                  </Text>
                  <div className={styles.sliderBottom}>
                    <div className={styles.quoteAutor}>
                      <Text type='p1'>{author}</Text>
                      <Text type='t1'>{position}</Text>
                    </div>
                    <CMSMedia resource={logo} className={styles.logo} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </UniversalSlider>
      </UniversalSliderProvider>
    </div>
  );
};
