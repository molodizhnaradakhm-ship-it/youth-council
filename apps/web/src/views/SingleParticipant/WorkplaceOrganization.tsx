'use client';

import { CMSLink } from '@/components/CMSLink';
import { Text } from '@/components/Text';
import { hasCmsLinkTarget } from '@/utils/hasCmsLinkTarget';
import type { Participant } from '@monorepo/cms/src/payload-types';

import styles from './SingleParticipant.module.scss';

type Workplace = NonNullable<Participant['workplaces']>[number];

type Props = {
  workplace: Workplace;
};

export function WorkplaceOrganization({ workplace }: Props) {
  const organization = workplace.organization?.trim() ?? '';
  if (!organization) {
    return null;
  }

  const link = workplace.organizationLink;

  if (!hasCmsLinkTarget(link)) {
    return (
      <Text className={styles.org} color='inherit' type='p2'>
        {organization}
      </Text>
    );
  }

  return (
    <CMSLink {...link} appearance='inline' className={styles.orgLink}>
      <Text className={styles.org} color='inherit' tag='span' type='p2'>
        {organization}
      </Text>
    </CMSLink>
  );
}
