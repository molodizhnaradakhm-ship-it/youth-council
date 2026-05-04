import { ChallengesBlock } from '@/components/ChallengesBlock/ChallengesBlock';
import { DownloadAppBlock } from '@/components/DownloadAppBlock/DownloadAppBlock';
import { FaqBlock } from '@/components/FaqBlock/FaqBlock';
import { ForgetQuizzesBlock } from '@/components/ForgetQuizzesBlock/ForgetQuizzesBlock';
import { HintBlock } from '@/components/HintBlock';
import { PeekInsideBlock } from '@/components/PeekInsideBlock/PeekInsideBlock';
import { PlayBigBlock } from '@/components/PlayBigBlock/PlayBigBlock';
import type { BlockMapper, UnifiedBlock } from '@/components/RenderBlocks/blockTypes';
import { SubscribeBlock } from '@/components/SubscribeBlock/SubscribeBlock';

import { CommentsBlock } from './CommentsBlock/CommentsBlock';
import { CTA } from './CTA';
import { Hero2 } from './Hero2/Hero2';
import { HeroScroll } from './HeroScroll';
import { LastBlog } from './LastBlog';
import { LaunchRegions } from './LaunchRegions/LaunchRegions';
import { QuoteSliderBlock } from './QuoteSlider/QuoteSlider';
import { Solutions } from './Solutions';
import {
  WithBackgroundFeaturesBento,
  WithBackgroundHeading,
  WithBackgroundLaunchMap,
  WithBackgroundSection,
  WithBackgroundSectionFaq,
} from './WithBackgroundSection';

/** Home page blocks (homeBlocks). */
export const homeBlocksMapper = {
  'hero-scroll-block': HeroScroll,
  'hero-2-block': Hero2,
  'home-section-block': WithBackgroundSection,
  // Allow using the section blocks outside the wrapper section as standalone blocks.
  'heading-block': WithBackgroundHeading,
  'features-bento-block': WithBackgroundFeaturesBento,
  'launch-map-block': WithBackgroundLaunchMap,
  'section-faq-block': WithBackgroundSectionFaq,
  'quotes-block': QuoteSliderBlock,
  'solutions-block': Solutions,
  'cta-block': CTA,
  'comments-block': CommentsBlock,
  'launch-regions-block': LaunchRegions,
  'blog-home-block': LastBlog,
  'hint-block': HintBlock,
  'subscribe-block': SubscribeBlock,
  'faq-block': FaqBlock,
  'download-app-block': DownloadAppBlock,
  'our-team-block': PlayBigBlock,
  'peek-inside-block': PeekInsideBlock,
  'forget-quizzes-block': ForgetQuizzesBlock,
  'challenges-block': ChallengesBlock,
} satisfies BlockMapper<UnifiedBlock>;
