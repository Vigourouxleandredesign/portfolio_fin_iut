/**
 * @file Project detail pages entry
 * @module entries/project-detail
 * @description Shared bootstrap for pages/projects/*.html (navigation, footer, reveals).
 *   Lazy-loads GLB showcases when `[data-glb-showcase]` is present (MagicalLab).
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
import '../../styles/components/graded-image.css';
import '../../styles/components/cartel.css';
import '../../styles/components/section-title.css';
import '../../styles/components/paint.css';
import '../../styles/components/light-beam.css';
import '../../styles/components/page-hero.css';
import '../../styles/components/section.css';
import '../../styles/components/project-detail.css';
import '../../styles/components/glb-showcase.css';
import '../../styles/pages/project-detail.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';
import { initProjectDetailNarrative } from '../components/project-detail-narrative';
import { initProjectSitePreview } from '../components/project-site-preview';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
  initRevealOnScroll();
  initProjectDetailNarrative();
  initProjectSitePreview();

  if (document.querySelector('[data-glb-showcase]')) {
    void import('../features/three-scene/glb-showcase').then(({ initGlbShowcases }) => {
      void initGlbShowcases();
    });
  }
}

bootstrap();
