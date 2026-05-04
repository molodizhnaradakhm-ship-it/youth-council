'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { EmailBlock } from '@/components/EmailBlock';
import { PhoneBlock } from '@/components/PhoneBlock';
import { Text } from '@/components/Text';
import type { ContactsOfficeBlockFields } from '@monorepo/cms/src/payload-types';

import contactStyles from '../Contacts.module.scss';
import styles from './ContactsOfficeBlock.module.scss';

export function ContactsOfficeBlock({
  address,
  application,
  email,
  photo,
  phone,
  scheduleHeading,
  scheduleLines,
}: ContactsOfficeBlockFields) {
  const t = useTranslations('common');

  const phoneStr = typeof phone === 'string' ? phone.trim() : '';
  const emailStr = typeof email === 'string' ? email.trim() : '';
  const addressStr = typeof address === 'string' ? address.trim() : '';

  const lines = (scheduleLines ?? []).map((row) => row?.line?.trim()).filter((x): x is string => Boolean(x));

  const app = application ?? {
    applicationButtons: [],
    showApplicationHeading: true,
  };

  const btnRows = (app.applicationButtons ?? []).filter((b) => b?.link?.label?.trim());
  const applicationTitleText =
    typeof app.applicationHeading === 'string' ? app.applicationHeading.trim() : '';
  const showApplicationTitle =
    app.showApplicationHeading !== false && Boolean(applicationTitleText);
  const showApplicationBlock = btnRows.length > 0 || showApplicationTitle;

  return (
    <section className={clsx(contactStyles.formWrap, styles.surface)}>
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          <div className={styles.imageFrame}>
            <CMSMedia className={styles.image} resource={photo as any} withBlur />
          </div>
        </div>

        <div className={styles.content}>
          {phoneStr ? (
            <PhoneBlock phone={phoneStr} titleClassName={contactStyles.formHeading} variant='onLight' />
          ) : null}

          {emailStr ? (
            <EmailBlock email={emailStr} titleClassName={contactStyles.formHeading} variant='onLight' />
          ) : null}

          {addressStr ? (
            <div>
              <Text className={contactStyles.formHeading} color='inherit' tag='p' type='t1'>
                {t('office_address')}
              </Text>
              <p className={styles.address}>{addressStr}</p>
            </div>
          ) : null}

          {lines.length ? (
            <div className={styles.schedule}>
              {scheduleHeading?.trim() ? (
                <Text className={styles.scheduleTitle} color='inherit' type='t1'>
                  {scheduleHeading.trim()}
                </Text>
              ) : null}
              <ul className={styles.scheduleList}>
                {lines.map((line, idx) => (
                  <li key={`${line}-${idx}`}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {showApplicationBlock ? (
            <div className={styles.application}>
              {showApplicationTitle ? (
                <p className={styles.applicationTitle}>{applicationTitleText}</p>
              ) : null}

              {btnRows.length ? (
                <div className={styles.actions}>
                  {btnRows.map((row, idx) => (
                    <CMSLink key={row.id ?? row.link?.label ?? `app-${idx}`} {...(row.link as any)} className={styles.btnLink}>
                      <span
                        className={clsx(
                          styles.btn,
                          row.link?.appearance === 'outline' ? styles.btnOutline : styles.btnDefault,
                        )}
                      >
                        {row.link?.label}
                      </span>
                    </CMSLink>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
