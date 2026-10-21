/**
 * @file Project site preview — marble device mockups
 * @description Handles `[data-project-site-preview]` blocks.
 *   - `data-preview-mode="shots"`: static perspective overlays (no JS).
 *   - default: iframe(s) in screen holes (Mac marble / flat screens).
 */

const PREVIEW_SELECTOR = '[data-project-site-preview]';
const BLOCKED_CLASS = 'is-preview-blocked';
const PHONE_IFRAME_WIDTH = 390;

/**
 * Scale phone iframes so a mobile layout fills the marble phone screen hole.
 */
function fitPhoneIframes(block: HTMLElement): void {
  const phones = block.querySelectorAll<HTMLElement>('.project-detail__mockup-screen--phone');
  phones.forEach((screen) => {
    const iframe = screen.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe) {
      return;
    }
    const { width, height } = screen.getBoundingClientRect();
    if (width < 1 || height < 1) {
      return;
    }
    const scale = width / PHONE_IFRAME_WIDTH;
    iframe.style.width = `${PHONE_IFRAME_WIDTH}px`;
    iframe.style.height = `${Math.ceil(height / scale)}px`;
    iframe.style.transform = `scale(${scale})`;
  });
}

/**
 * Wire iframe fallbacks + phone fit. Shot-mode mockups are CSS-only.
 */
export function initProjectSitePreview(): void {
  const blocks = document.querySelectorAll<HTMLElement>(PREVIEW_SELECTOR);
  blocks.forEach((block) => {
    if (block.getAttribute('data-preview-mode') === 'shots') {
      return;
    }

    const iframes = block.querySelectorAll<HTMLIFrameElement>('iframe');
    if (iframes.length === 0) {
      return;
    }

    let failed = 0;
    iframes.forEach((iframe) => {
      iframe.addEventListener('error', () => {
        failed += 1;
        if (failed >= iframes.length) {
          block.classList.add(BLOCKED_CLASS);
        }
      });
    });

    const syncPhones = (): void => {
      fitPhoneIframes(block);
    };
    syncPhones();
    window.addEventListener('resize', syncPhones, { passive: true });
  });
}
