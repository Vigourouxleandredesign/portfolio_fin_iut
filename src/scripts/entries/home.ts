/**
 * @file Home page entry
 * @module entries/home
 * @description Bootstraps styles, navigation, the 3D fractured bust hero, the
 *   page-wide cursor brush overlay and scroll reveals for pages/index.html.
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
import '../../styles/components/skills-gallery.css';
import '../../styles/components/project-card.css';
import '../../styles/components/clients-marquee.css';
import '../../styles/components/hero-3d.css';
import '../../styles/pages/home.css';

import bustDesigner from '../../../Assets/Hero/Buste_Designer.jpg';
import bustFracturedModel from '../../assets/hero/bust-fractured.glb';
import marbleAtelierEmpty from '../../assets/moodboard/marble-atelier-empty.jpg';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';
import { initClientsMarquee } from '../components/clients-marquee';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
  initClientsMarquee();
  initRevealOnScroll();

  const main = document.querySelector<HTMLElement>('main');
  if (main) {
    void import('../features/home-brush/home-brush').then(({ initHomeBrush }) =>
      initHomeBrush(main),
    );
  }

  const skillsGallery = document.querySelector<HTMLElement>('[data-skills-gallery]');
  if (skillsGallery) {
    skillsGallery.style.setProperty(
      '--skills-gallery-bg',
      `url("${marbleAtelierEmpty}")`,
    );
  }

  const heroRoot = document.querySelector<HTMLElement>('[data-hero-3d]');
  const fallbackImage = heroRoot?.querySelector<HTMLImageElement>('[data-hero-3d-fallback]');
  if (fallbackImage) {
    fallbackImage.src = bustDesigner;
  }

  if (heroRoot) {
    void import('../features/three-scene/bust-hero').then(({ initBustHero }) =>
      initBustHero(heroRoot, {
        modelUrl: bustFracturedModel,
        dracoDecoderPath: '/draco/gltf/',
      }),
    );
  }
}

bootstrap();
