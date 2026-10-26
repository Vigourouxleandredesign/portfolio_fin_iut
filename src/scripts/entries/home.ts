/**
 * @file Home page entry
 * @module entries/home
 * @description Bootstraps styles, navigation, the 3D fractured bust hero
 *   (optional atmosphere plate), the featured project carousel, the
 *   page-wide gouache cursor brush overlay and scroll reveals for pages/index.html.
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
import '../../styles/components/section.css';
import '../../styles/components/skill-card.css';
import '../../styles/components/skills-gallery.css';
import '../../styles/components/project-card.css';
import '../../styles/components/tech-logo.css';
import '../../styles/components/project-carousel.css';
import '../../styles/components/clients-marquee.css';
import '../../styles/components/hero-3d.css';
import '../../styles/components/intro-veil.css';
import '../../styles/pages/home.css';

import bustModel from '../../assets/hero/bust.glb';

import { initIntroVeil } from '../features/intro-veil/intro-veil';
import { canMountBust, hasFinePointer } from '../features/three-scene/bust-capability';
import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initRevealOnScroll } from '../components/reveal-on-scroll';
import { initProjectCarousel } from '../components/project-carousel';

/**
 * Runs `task` after the `load` event, when the browser is idle (≤ 2.5 s later at the latest).
 */
function runWhenIdle(task: () => void): void {
  const schedule = (): void => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(task, { timeout: 2500 });
    } else {
      window.setTimeout(task, 1200);
    }
  };
  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
}

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
  initRevealOnScroll();

  const main = document.querySelector<HTMLElement>('main');
  if (main && hasFinePointer()) {
    void import('../features/home-brush/home-brush').then(({ initHomeBrush }) =>
      initHomeBrush(main),
    );
  } else {
    // Touch: no brush at all (it would intercept finger scrolling); drop the canvas too.
    document.querySelector('[data-home-brush]')?.remove();
  }

  const heroRoot = document.querySelector<HTMLElement>('[data-hero-3d]');
  let heroReady: Promise<unknown> = Promise.resolve();
  if (heroRoot && canMountBust()) {
    // Mouse devices only (touch / reduced motion / save-data keep the static hero image, nothing of the
    // 3D is downloaded). The bust (≈ 1.2 MB GLB + physics) starts once the page is loaded and idle, so
    // it never competes with the first paint / LCP (the static fallback image is shown meanwhile).
    // The opening veil waits for it (capped) so the bust never visibly pops in.
    heroReady = new Promise<void>((resolve) => {
      runWhenIdle(() => {
        void import('../features/three-scene/bust-hero')
          .then(({ initBustHero }) =>
            initBustHero(heroRoot, {
              modelUrl: bustModel,
              dracoDecoderPath: '/draco/gltf/',
            }),
          )
          .catch(() => undefined)
          .then(() => resolve());
      });
    });
  }

  const veil = document.querySelector<HTMLElement>('[data-intro-veil]');
  if (veil) {
    void initIntroVeil(veil, { heroReady });
  }

  const carousel = document.querySelector<HTMLElement>('[data-project-carousel]');
  if (carousel) {
    initProjectCarousel(carousel);
  }
}

bootstrap();
