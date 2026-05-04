'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { DarkLaunchMapBlockFields, Media } from '@monorepo/cms/src/payload-types';

import styles from './WithBackgroundLaunchMap.module.scss';

const DEFAULT_MAP_SRC = '/home/map-base.svg';
const DEFAULT_POINTER_LABEL = 'Region';

export const WithBackgroundLaunchMap = ({
  sectionTitle,
  mapImage,
  pointers,
}: DarkLaunchMapBlockFields) => {
  const [active, setActive] = useState<number | null>(null);

  const mapSrc = useMemo(() => {
    if (mapImage && typeof mapImage === 'object' && mapImage !== null && 'url' in mapImage && mapImage.url) {
      return resolvePayloadMediaUrl(String(mapImage.url));
    }
    return DEFAULT_MAP_SRC;
  }, [mapImage]);

  const list = pointers ?? [];
  const hasPointers = list.length > 0;

  const isActive = (index: number) => active === index;
  const setActiveIndex = (index: number) => setActive(index);
  const clearActive = () => setActive(null);

  return (
    <section className={styles.section} aria-labelledby='with-bg-map-heading'>
      <Container>
        {sectionTitle?.trim() ? (
          <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
            <Text
              className={styles.sectionTitle}
              color='white'
              id='with-bg-map-heading'
              tag='h2'
              type='h2'
            >
              {sectionTitle}
            </Text>
          </InViewAnimation>
        ) : null}

        <InViewAnimation
          delay={0.08}
          className={clsx('InViewAnimation_animate', styles.mapStage)}
          threshold={0}
          effect='y'
          translateAmount='medium'
        >
          <div className={styles.mapFrame}>
            <div className={styles.mapImageCrop}>
              <Image alt='' className={styles.mapImg} height={365} src={mapSrc} unoptimized width={1124} />
            </div>
            <div className={styles.pinLayer}>
              {list.map((pointer, index) => (
                <div
                  key={pointer.id ?? `ptr-${index}`}
                  className={clsx(styles.pinSlot, isActive(index) && styles.pinSlotActive)}
                  style={{
                    left: `${pointer.xPercent ?? 0}%`,
                    top: `${pointer.yPercent ?? 0}%`,
                  }}
                >
                  <button
                    aria-expanded={isActive(index)}
                    aria-label={pointer.countryName ?? DEFAULT_POINTER_LABEL}
                    className={clsx(styles.pinBtn, isActive(index) && styles.pinBtnActive)}
                    type='button'
                    onBlur={clearActive}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={clearActive}
                  >
                    <span className={styles.pinSvg} aria-hidden />
                  </button>
                  {isActive(index) ? (
                    <div className={styles.tooltip} role='tooltip'>
                      <div className={styles.tooltipCard}>
                        {pointer.flag ? (
                          <CMSMedia
                            className={styles.flag}
                            imgClassName={styles.flagImg}
                            resource={pointer.flag as Media}
                          />
                        ) : null}
                        <div className={styles.tooltipText}>
                          <Text className={styles.tooltipCountry} color='inherit' tag='p' type='p1'>
                            {pointer.countryName}
                          </Text>
                          <Text className={styles.tooltipLabel} color='text' tag='p' type='p2'>
                            {pointer.launchDateLabel}
                          </Text>
                          <Text className={styles.tooltipValue} color='inherit' tag='p' type='p1'>
                            {pointer.launchDateValue}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </InViewAnimation>

        {hasPointers ? (
          <InViewAnimation
            className={clsx('InViewAnimation_animate', styles.countriesRow)}
            delay={0.12}
            effect='y'
            translateAmount='medium'
          >
            <ul className={styles.countriesList}>
              {list.map((pointer, index) => (
                <li key={pointer.id ?? `c-${index}`}>
                  <button
                    className={clsx(styles.countryPill, isActive(index) && styles.countryPillActive)}
                    type='button'
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={clearActive}
                  >
                    {pointer.flag ? (
                      <CMSMedia
                        className={styles.pillFlag}
                        imgClassName={styles.pillFlagImg}
                        resource={pointer.flag as Media}
                      />
                    ) : null}
                    <span className={styles.pillName}>{pointer.countryName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </InViewAnimation>
        ) : null}
      </Container>
    </section>
  );
};
