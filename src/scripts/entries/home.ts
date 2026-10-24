/**
 * @file Home page entry
 * @module entries/home
 * @description Bootstraps styles, navigation, the 3D fractured bust hero
 *   (optional atmosphere plate), the featured project carousel, the
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
import '../../styles/components/project-carousel.css';
import '../../styles/components/clients-marquee.css';
import '../../styles/components/hero-3d.css';
import '../../styles/pages/home.css';

import bustDesigner from '../../assets/hero/bust-designer.jpg';
import fondTestHero from '../../assets/hero/hero-atmosphere.jpg';
import bustModel from '../../assets/hero/bust.glb';
import marbleAtelierEmpty from '../../assets/moodboard/marble-atelier-empty.jpg';
import magicallabCover from '../../assets/projects/magicallab/scene-portal.jpg';
import micromondeCover from '../../assets/projects/micromonde/cover.webp';
import villageJeunesCover from '../../assets/projects/village-jeunes/cover.webp';
import blenderMark from '../../assets/tech/blender-mark.svg';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';
import { initClientsMarquee } from '../components/clients-marquee';
import { initProjectCarousel } from '../components/project-carousel';

/** Featured carousel covers — MagicalLab / Micro-monde / Vill'âge Jeunes. */
const CAROUSEL_COVERS: Record<string, string> = {
  magicallab: magicallabCover,
  micromonde: micromondeCover,
  'village-jeunes': villageJeunesCover,
};

const CAROUSEL_TECH_ICONS: Record<string, string> = {
  blender: blenderMark,
};

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
    skillsGallery.style.setProperty('--skills-gallery-bg', `url("${marbleAtelierEmpty}")`);
  }

  const heroRoot = document.querySelector<HTMLElement>('[data-hero-3d]');
  const fallbackImage = heroRoot?.querySelector<HTMLImageElement>('[data-hero-3d-fallback]');
  if (fallbackImage) {
    fallbackImage.src = bustDesigner;
  }

  const atmosphereImage = document.querySelector<HTMLImageElement>('[data-hero-3d-atmosphere]');
  if (atmosphereImage) {
    atmosphereImage.src = fondTestHero;
  }

  if (heroRoot) {
    void import('../features/three-scene/bust-hero').then(({ initBustHero }) =>
      initBustHero(heroRoot, {
        modelUrl: bustModel,
        dracoDecoderPath: '/draco/gltf/',
      }),
    );
  }

  const carousel = document.querySelector<HTMLElement>('[data-project-carousel]');
  if (carousel) {
    hydrateCarouselCovers(carousel);
    hydrateCarouselTechIcons(carousel);
    initProjectCarousel(carousel);
  }
}

/**
 * Assigns Vite-resolved cover URLs onto carousel slide images.
 */
function hydrateCarouselCovers(carousel: HTMLElement): void {
  carousel.querySelectorAll<HTMLImageElement>('[data-carousel-image]').forEach((image) => {
    const key = image.dataset.carouselImage;
    const url = key ? CAROUSEL_COVERS[key] : undefined;
    if (url) {
      image.src = url;
      image.alt = '';
    }
  });
}

/**
 * Assigns Vite-resolved tech mark URLs (e.g. Blender) onto badge icons.
 */
function hydrateCarouselTechIcons(carousel: HTMLElement): void {
  carousel.querySelectorAll<HTMLImageElement>('[data-carousel-tech-icon]').forEach((image) => {
    const key = image.dataset.carouselTechIcon;
    const url = key ? CAROUSEL_TECH_ICONS[key] : undefined;
    if (url) {
      image.src = url;
    }
  });
}

bootstrap();
