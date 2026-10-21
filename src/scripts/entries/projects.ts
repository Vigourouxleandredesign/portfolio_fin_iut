/**
 * @file Projects page entry
 * @module entries/projects
 * @description Bootstraps styles, navigation, moodboard backdrop and the
 *   category filter for pages/projects.html.
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
import '../../styles/components/project-card.css';
import '../../styles/components/project-filter.css';
import '../../styles/pages/projects.css';

import projectsBackdrop from '../../assets/moodboard/bg-projets.jpg';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';
import { initProjectFilter } from '../components/project-filter';

function bootstrap(): void {
  document.body.style.setProperty(
    '--projects-page-bg',
    `url("${projectsBackdrop}")`,
  );

  initSiteLogo();
  initSiteNav();
  initSiteFooter();
  initRevealOnScroll();
  initProjectFilter();
}

bootstrap();
