/**
 * @file Jury area entry
 * @module entries/jury
 * @description Shared bootstrap for pages/jury/*.html (protected area): styles, navigation, footer.
 *   Contains NO jury text — bundles under /assets are public (docs/SECURITY.md §0).
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
import '../../styles/components/cartel.css';
import '../../styles/components/paint.css';
import '../../styles/components/project-detail.css';
import '../../styles/pages/jury.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
}

bootstrap();
