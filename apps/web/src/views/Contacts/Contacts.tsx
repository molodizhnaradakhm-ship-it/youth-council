'use client';

import { useTranslations } from 'next-intl';

import { Container } from '@/components/Container';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import RichText from '@/components/RichText';
import { hasLexicalContent } from '@/utils/hasLexicalContent';
import type { Page } from '@monorepo/cms/src/payload-types';

import { ContactOurLinks } from './ContactOurLinks';
import { ContactPaymentSection } from './ContactPaymentSection';

import styles from './Contacts.module.scss';

type ContactsBlock = { blockType: string; id?: null | string } & Record<string, any>;

export const ContactsView = (page: Page) => {
  const t = useTranslations('contacts');
  const cp = page.contactsPage;

  const title = cp?.title?.trim() || t('page_title');
  const blocks = (cp as any)?.blocks as undefined | ContactsBlock[];

  return (
    <main className={styles.wrapper}>
      <section className={styles.page}>
        <Container>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {cp && hasLexicalContent(cp.description) ? (
              <RichText
                className={styles.intro}
                content={cp.description}
                textColor='text'
                textType='p2'
              />
            ) : (
              <p className={styles.subtitle}>{t('page_subtitle')}</p>
            )}
          </header>

          {blocks?.length ? (
            <RenderBlocks blocks={blocks as never} mapper={unifiedBlocksMapper} />
          ) : (
            <>
              <ContactOurLinks className={styles.block} />
              <ContactPaymentSection className={styles.block} contacts={null} />
            </>
          )}
        </Container>
      </section>
    </main>
  );
};
