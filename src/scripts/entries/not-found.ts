/**
 * @file 404 page entry
 * @module entries/not-found
 * @description Bootstraps styles, navigation and footer for pages/404.html (« Salle introuvable »).
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
import '../../styles/components/paint.css';
import '../../styles/components/light-beam.css';
import '../../styles/pages/not-found.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
}

bootstrap();
