import type { Block } from 'payload';

import { BlogBlock } from '../Pages/blocks/home/BlogBlock';
import { CTABlock } from '../Pages/blocks/home/CTABlock';
import { CommentsBlock } from '../Pages/blocks/home/CommentsBlock';
import {
  FeaturesBentoBlock,
  HeadingBlock,
  HomeSectionBlock,
  LaunchMapBlock,
  SectionFaqBlock,
} from '../Pages/blocks/home/homeSection';
import { Hero2Block } from '../Pages/blocks/home/Hero2Block';
import { HeroScrollBlock } from '../Pages/blocks/home/HeroScrollBlock';
import { LaunchRegionsBlock } from '../Pages/blocks/home/LaunchRegionsBlock';
import { QuotesBlock } from '../Pages/blocks/home/QuotesBlock';
import { SolutionBlock } from '../Pages/blocks/home/SolutionBlock';
import { SubscribeBlock } from '../Pages/blocks/home/SubscribeBlock';
import { FaqBlock } from '../Pages/blocks/shared/FaqBlock';
import { DownloadAppBlock } from '../Pages/blocks/shared/DownloadAppBlock';
import { PlayBigBlock } from '../Pages/blocks/shared/PlayBigBlock';
import { PeekInsideBlock } from '../Pages/blocks/shared/PeekInsideBlock';
import { ForgetQuizzesBlock } from '../Pages/blocks/shared/ForgetQuizzesBlock';
import { ChallengesBlock } from '../Pages/blocks/shared/ChallengesBlock';
import { ContactsFormBlock } from '../Pages/blocks/contacts/ContactsFormBlock';
import { ContactsOfficeBlock } from '../Pages/blocks/contacts/ContactsOfficeBlock';
import { ContactsOurLinksBlock } from '../Pages/blocks/contacts/ContactsOurLinksBlock';
import { ContactsPaymentBlock } from '../Pages/blocks/contacts/ContactsPaymentBlock';
import { ExploreTabsBlock } from '../ExplorePages/blocks/ExploreTabsBlock';

import { buildResponsiveBlocksBlock } from './ResponsiveBlocks';
import { exploreContentBlocksCore } from './exploreContentBlocksCore';

/**
 * All blocks allowed on Home, Explore, Contacts, Privacy (information), and other pages where
 * exploreContentBlocks used to be used (blog, subscriptions, etc.).
 * Editors can compose a page from any combination of these block types + Responsive.
 */
const unifiedBlocksFlat: Block[] = [
  HeroScrollBlock,
  Hero2Block,
  HomeSectionBlock,
  // Standalone usage (same blocks that can also live inside the section wrapper).
  HeadingBlock,
  FeaturesBentoBlock,
  LaunchMapBlock,
  SectionFaqBlock,
  QuotesBlock,
  SolutionBlock,
  CTABlock,
  CommentsBlock,
  LaunchRegionsBlock,
  BlogBlock,
  SubscribeBlock,
  FaqBlock,
  DownloadAppBlock,
  PlayBigBlock,
  PeekInsideBlock,
  ForgetQuizzesBlock,
  ChallengesBlock,
  ...exploreContentBlocksCore,
  ExploreTabsBlock,
  ContactsOurLinksBlock,
  ContactsFormBlock,
  ContactsOfficeBlock,
  ContactsPaymentBlock,
];

export const unifiedPageBlocks: Block[] = [
  ...unifiedBlocksFlat,
  buildResponsiveBlocksBlock({
    label: 'Responsive (mobile / desktop)',
    slug: 'responsive-blocks-unified',
    blocks: unifiedBlocksFlat,
  }),
];
