/**
 * @file Home page entry
 * @module entries/home
 * @description Bootstraps styles and features for pages/index.html.
 * @see {@link ../../../docs/ARCHITECTURE.md}
 */

import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
import '../../styles/components/hero.css';
import '../../styles/pages/home.css';

import bustDesigner from '../../../Assets/Hero/Buste_Designer.png';
import bustDeveloper from '../../../Assets/Hero/Buste_Developper.png';

import { initSiteFooter } from '../components/site-footer';
import { initHeroReveal } from '../features/hero-reveal/hero-reveal';

function bootstrap(): void {
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
