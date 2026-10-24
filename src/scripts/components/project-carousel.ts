/**
 * @file Project carousel — cover slider behaviour
 * @module components/project-carousel
 * @description Prev / current / next cover carousel with light tilt on the
 *   active slide. Inspired by `reference/Carrousel card dynamique` — no
 *   external deps. With 3 slides, the wrapping card teleports
 *   (previous ↔ next); that hop disables CSS transition for one frame
 *   so the swap stays smooth. Targets `[data-project-carousel]`.
 * @see {@link ../../../docs/ARCHITECTURE.md}
 */

type TiltHandle = {
  destroy: () => void;
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Mounts the featured-projects cover carousel.
 *
 * @param root - Element with `[data-project-carousel]`
 * @returns Teardown function
 */
export function initProjectCarousel(root: HTMLElement): () => void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-carousel-slide]')];
  const infos = [...root.querySelectorAll<HTMLElement>('[data-carousel-info]')];
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-carousel-next]');

  if (slides.length === 0) {
    return () => undefined;
  }

  let index = slides.findIndex((slide) => slide.hasAttribute('data-current'));
  if (index < 0) {
    index = 0;
  }

  let isAnimating = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiltHandles: TiltHandle[] = [];

  const roleFor = (
    i: number,
    current: number,
    count: number,
  ): 'current' | 'previous' | 'next' | 'hidden' => {
    const previous = (current - 1 + count) % count;
    const next = (current + 1) % count;
    if (i === current) {
      return 'current';
    }
    if (i === previous) {
      return 'previous';
    }
    if (i === next) {
      return 'next';
    }
    return 'hidden';
  };

  /**
   * Instantly repositions a slide that wraps (previous↔next) without
   * animating across the center — that hop is what felt saccadé.
   */
  const teleportWithoutTransition = (elements: HTMLElement[]): void => {
    for (const element of elements) {
      element.classList.add('is-teleporting');
    }
    void root.offsetHeight;
  };

  const clearTeleport = (elements: HTMLElement[]): void => {
    requestAnimationFrame(() => {
      for (const element of elements) {
        element.classList.remove('is-teleporting');
      }
    });
  };

  const applyRoles = (elements: HTMLElement[], current: number, kind: 'slide' | 'info'): void => {
    const count = slides.length;
    elements.forEach((element, i) => {
      const nextRole = roleFor(i, current, count);

      element.removeAttribute('data-current');
      element.removeAttribute('data-previous');
      element.removeAttribute('data-next');
      element.removeAttribute('data-hidden');

      if (nextRole === 'current') {
        element.setAttribute('data-current', '');
        if (kind === 'slide') {
          element.style.zIndex = '20';
        }
      } else if (nextRole === 'previous') {
        element.setAttribute('data-previous', '');
        if (kind === 'slide') {
          element.style.zIndex = '10';
        }
      } else if (nextRole === 'next') {
        element.setAttribute('data-next', '');
        if (kind === 'slide') {
          element.style.zIndex = '10';
        }
      } else {
        element.setAttribute('data-hidden', '');
        if (kind === 'slide') {
          element.style.zIndex = '1';
        }
      }
    });
  };

  const sync = (options?: { animate?: boolean }): void => {
    const animate = options?.animate !== false && !reducedMotion;
    const count = slides.length;
    const tentativeWrap: HTMLElement[] = [];

    slides.forEach((slide, i) => {
      const nextRole = roleFor(i, index, count);
      const wasPrevious = slide.hasAttribute('data-previous');
      const wasNext = slide.hasAttribute('data-next');
      if ((wasPrevious && nextRole === 'next') || (wasNext && nextRole === 'previous')) {
        tentativeWrap.push(slide);
        const info = infos[i];
        if (info) {
          tentativeWrap.push(info);
        }
      }
    });

    if (animate && tentativeWrap.length > 0) {
      teleportWithoutTransition(tentativeWrap);
    }

    applyRoles(slides, index, 'slide');
    applyRoles(infos, index, 'info');

    if (animate && tentativeWrap.length > 0) {
      clearTeleport(tentativeWrap);
    }
  };

  const go = (direction: 1 | -1): void => {
    if (isAnimating && !reducedMotion) {
      return;
    }
    isAnimating = true;
    index = (index + direction + slides.length) % slides.length;
    sync({ animate: true });

    window.setTimeout(
      () => {
        isAnimating = false;
      },
      reducedMotion ? 0 : 820,
    );
  };

  const onPrev = (): void => {
    go(-1);
  };
  const onNext = (): void => {
    go(1);
  };

  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  if (!reducedMotion) {
    slides.forEach((slide, i) => {
      const slideInner = slide.querySelector<HTMLElement>('.project-carousel__slide-inner');
      const infoInner = infos[i]?.querySelector<HTMLElement>('.project-carousel__info-inner');
      if (!slideInner) {
        return;
      }
      const targets = infoInner ? [slideInner, infoInner] : [slideInner];
      tiltHandles.push(attachTilt(slide, targets));
    });
  }

  sync({ animate: false });

  return () => {
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
    tiltHandles.forEach((handle) => handle.destroy());
  };
}

function attachTilt(trigger: HTMLElement, targets: HTMLElement[]): TiltHandle {
  let lerpAmount = 0.06;
  let rafId = 0;
  const currentRot = { x: 0, y: 0 };
  const targetRot = { x: 0, y: 0 };
  const currentBg = { x: 0, y: 0 };
  const targetBg = { x: 0, y: 0 };

  const tick = (): void => {
    currentRot.x = lerp(currentRot.x, targetRot.x, lerpAmount);
    currentRot.y = lerp(currentRot.y, targetRot.y, lerpAmount);
    currentBg.x = lerp(currentBg.x, targetBg.x, lerpAmount);
    currentBg.y = lerp(currentBg.y, targetBg.y, lerpAmount);

    for (const target of targets) {
      target.style.setProperty('--rot-x', `${currentRot.y.toFixed(2)}deg`);
      target.style.setProperty('--rot-y', `${currentRot.x.toFixed(2)}deg`);
      target.style.setProperty('--bg-pos-x', `${currentBg.x.toFixed(2)}%`);
      target.style.setProperty('--bg-pos-y', `${currentBg.y.toFixed(2)}%`);
    }

    rafId = requestAnimationFrame(tick);
  };

  const onMove = (event: MouseEvent): void => {
    if (!trigger.hasAttribute('data-current')) {
      return;
    }
    lerpAmount = 0.1;
    const ox = (event.offsetX - trigger.clientWidth * 0.5) / (Math.PI * 3);
    const oy = -(event.offsetY - trigger.clientHeight * 0.5) / (Math.PI * 4);
    targetRot.x = ox;
    targetRot.y = oy;
    targetBg.x = -ox * 0.3;
    targetBg.y = oy * 0.3;
  };

  const onLeave = (): void => {
    lerpAmount = 0.06;
    targetRot.x = 0;
    targetRot.y = 0;
    targetBg.x = 0;
    targetBg.y = 0;
  };

  trigger.addEventListener('mousemove', onMove);
  trigger.addEventListener('mouseleave', onLeave);
  rafId = requestAnimationFrame(tick);

  return {
    destroy: () => {
      trigger.removeEventListener('mousemove', onMove);
      trigger.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    },
  };
}
