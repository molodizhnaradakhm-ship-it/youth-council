'use client';

import { HintBlock } from '@/components/HintBlock';
import type { ContactsPaymentBlockFields, Form } from '@monorepo/cms/src/payload-types';

import { ContactOurLinks } from './ContactOurLinks';
import { ContactPaymentSection } from './ContactPaymentSection';
import { ContactsForm } from './ContactsForm';
import { ContactsOfficeBlock } from './ContactsOfficeBlock';

import styles from './Contacts.module.scss';

const CONTACTS_BLOCK_TYPE = {
  ContactsOurLinks: 'contacts-our-links-block',
  ContactsForm: 'contacts-form-block',
  ContactsOffice: 'contacts-office-block',
  ContactsPayment: 'contacts-payment-block',
  Hint: 'hint-block',
} as const;

const ContactsOurLinksBlockComponent = ({ cards }: { cards?: any[] }) => (
  <ContactOurLinks cards={cards ?? null} className={styles.block} />
);

const ContactsFormBlockComponent = ({
  formHeading,
  form,
  layout,
  terms,
  formSubheading,
}: {
  formHeading?: string;
  form?: Form | string;
  layout?: {
    emailField?: string | null;
    messageField?: string | null;
    nameField?: string | null;
    phoneField?: string | null;
    surnameField?: string | null;
    termsField?: string | null;
  };
  terms?: {
    enabled?: boolean | null;
    fieldName?: string | null;
    href?: string | null;
    linkText?: string | null;
    text?: string | null;
  } | null;
  formSubheading?: string;
}) => {
  if (!form || typeof form === 'string') {
    return null;
  }

  return (
    <section className={styles.formWrap}>
      <div className={styles.formGrid}>
        <div className={styles.formLeft}>
          {formHeading?.trim() ? <p className={styles.formHeading}>{formHeading.trim()}</p> : null}
          {formSubheading?.trim() ? <p className={styles.formSubheading}>{formSubheading.trim()}</p> : null}
        </div>
        <div className={styles.formRight}>
          <ContactsForm {...({ form, layout: layout ?? null, terms: terms ?? null } as any)} />
        </div>
      </div>
    </section>
  );
};

const ContactsPaymentBlockComponent = ({
  heading,
  intlTitle,
  localTitle,
  cards,
}: ContactsPaymentBlockFields) => {
  return (
    <ContactPaymentSection
      className={styles.block}
      contacts={null}
      cards={cards ?? null}
      headingOverride={heading}
      intlTitleOverride={intlTitle}
      localTitleOverride={localTitle}
    />
  );
};

/** Контакти — форма/посилання/оплата з глобалами. */
export const contactsBlocksMapper = {
  [CONTACTS_BLOCK_TYPE.ContactsOurLinks]: ContactsOurLinksBlockComponent,
  [CONTACTS_BLOCK_TYPE.ContactsForm]: ContactsFormBlockComponent,
  [CONTACTS_BLOCK_TYPE.ContactsOffice]: ContactsOfficeBlock,
  [CONTACTS_BLOCK_TYPE.ContactsPayment]: ContactsPaymentBlockComponent,
  [CONTACTS_BLOCK_TYPE.Hint]: (props: Record<string, unknown>) => <HintBlock {...(props as any)} insideContainer />,
};
