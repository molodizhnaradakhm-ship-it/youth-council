import clsx from 'clsx';
import Image from 'next/image';

import logo from '@/assets/images/mini-logo.svg';

import { Button } from '../Button';
import { CMSLink, type CMSLinkType } from '../CMSLink';
import { Container } from '../Container';
import { InViewAnimation } from '../InViewAnimation';
import { Text } from '../Text';

import styles from './BannerBlock.module.scss';

type Props = {
  className?: string;
  title: string;
  description: string;
  button1?: CMSLinkType;
  button2?: CMSLinkType;
};

export const BannerBlock = ({ className, title, description, button1, button2 }: Props) => {
  return (
    <section className={clsx(styles.wrapper, className)}>
      <Container wide>
        <div className={styles.wrapperInner}>
          <div className={styles.content}>
            <Image className={styles.logo} src={logo} alt='Smarty Landing logo' />
            <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
              <Text type='h2' color='white' className={styles.title}>
                {title}
              </Text>
            </InViewAnimation>
            <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium' delay={0.2}>
              <Text type='p2' className={styles.description}>
                {description}
              </Text>
            </InViewAnimation>
            {button1 && button2 && (
              <InViewAnimation
                className={clsx('InViewAnimation_animate', styles.buttons)}
                effect='y'
                translateAmount='medium'
                delay={0.4}
              >
                <CMSLink {...button1}>
                  <Button violet fullWIdth>
                    {button1.label}
                  </Button>
                </CMSLink>
                <CMSLink {...button2}>
                  <Button rounded fullWIdth>
                    {button2.label}
                  </Button>
                </CMSLink>
              </InViewAnimation>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
