import clsx from 'clsx';

import { QuoteIcon } from '@/assets/react-icons/QuoteIcon';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { Text } from '@/components/Text';
import { UniversalSlider } from '@/components/UniversalSlider';
import { UniversalSliderProvider } from '@/components/UniversalSlider/UniversalSliderContext';
import type { QuotesBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './QuoteSlider.module.scss';

export const QuoteSliderBlock = ({ title, quotesList }: QuotesBlockFields) => {
  return (
    <section className={styles.wrapper}>
      <Container>
        <Text type='h2' tag='h2' className={styles.title}>
          {title}
        </Text>
        <UniversalSliderProvider>
          <UniversalSlider
            swiperProps={{
              breakpoints: {
                1250: {
                  slidesPerView: 2.3,
                  spaceBetween: 0,
                  centeredSlides: true,
                },
              },
            }}
            className={styles.slider}
            withPagination
            hidePaginationLaptop={false}
          >
            {quotesList.map(
              ({
                author,
                logo,
                position,
                quote,
                id,
              }) => (
                <div key={id} className={styles.sliderItemOuter}>
                  <div className={styles.sliderItem}>
                    <QuoteIcon className={styles.quoteIcon} />
                    <Text type='p1' className={styles.quote}>
                      {quote}
                    </Text>
                    <div className={styles.sliderBottom}>
                      <div className={styles.quoteAutor}>
                        <Text type='p1'>{author}</Text>
                        {position?.trim() ? (
                          <Text type='p2' className={clsx(position.startsWith('@') && styles.handle)}>
                            {position}
                          </Text>
                        ) : null}
                      </div>
                      <CMSMedia resource={logo} className={styles.logo} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </UniversalSlider>
        </UniversalSliderProvider>
      </Container>
    </section>
  );
};
