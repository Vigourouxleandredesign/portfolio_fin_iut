/**
 * @file CV page entry
 * @module entries/cv
 * @description Bootstraps styles, navigation and scroll reveals for pages/cv.html.
 * @see {@link ../../../docs/ARCHITECTURE.md}
 */

import '../../styles/fonts.css';
import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
import '../../styles/components/site-header.css';
import '../../styles/components/site-footer.css';
import '../../styles/components/button.css';
import '../../styles/components/section.css';
import '../../styles/components/skill-card.css';
import '../../styles/components/timeline.css';
import '../../styles/pages/cv.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
  initRevealOnScroll();
}

bootstrap();
