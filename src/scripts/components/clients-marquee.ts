/**
 * @file Clients marquee — logo strip bootstrap
 * @module components/clients-marquee
 * @description Assigns Vite-bundled logo URLs to `[data-client-logo]` images.
 */

import logoEnercal from '../../assets/clients/logo-enercal.png';
import logoClaro from '../../assets/clients/logo-claro.jpg';
import logoCsb from '../../assets/clients/logo-csb.jpg';
import logoHyperU from '../../assets/clients/logo-hyper-u.gif';
import logoVisualcom from '../../assets/clients/logo-visualcom.png';
import logoQuintessence from '../../assets/clients/logo-quintessence.jpg';

const CLIENT_LOGOS: Record<string, string> = {
  enercal: logoEnercal,
  claro: logoClaro,
  csb: logoCsb,
  'hyper-u': logoHyperU,
  visualcom: logoVisualcom,
  quintessence: logoQuintessence,
};

/**
 * Sets `src` on every client logo image from the bundled assets map.
 */
export function initClientsMarquee(): void {
  document.querySelectorAll<HTMLImageElement>('[data-client-logo]').forEach((img) => {
    const key = img.dataset.clientLogo;
    if (!key) return;
    const src = CLIENT_LOGOS[key];
    if (src) {
      img.src = src;
    }
  });
}
