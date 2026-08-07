/**
 * @file Legacy hero page entry
 * @module entries/hero-legacy
 * @description Bootstraps the archived canvas-brush hero for pages/hero-legacy.html.
 *   Same assets and logic as the original home hero (see docs/ROADMAP.md Phase E).
 * @see {@link ../../../docs/ARCHITECTURE.md}
 */

import '../../styles/fonts.css';
import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
import '../../styles/components/site-header.css';
import '../../styles/components/site-footer.css';
import '../../styles/components/hero.css';

import bustDesigner from '../../../Assets/Hero/Buste_Designer.jpg';
import bustDeveloper from '../../../Assets/Hero/Buste_Dev.jpg';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initHeroReveal } from '../features/hero-reveal/hero-reveal';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();

  const heroRoot = document.querySelector<HTMLElement>('[data-hero-reveal]');
  const baseImage = heroRoot?.querySelector<HTMLImageElement>('.hero__image--base');

  if (heroRoot && baseImage) {
    baseImage.src = bustDesigner;
    initHeroReveal(heroRoot, {
      topImageSrc: bustDeveloper,
      brushRadius: 72,
      brushSoftness: 0.55,
    });
  }
}

bootstrap();
