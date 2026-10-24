/**
 * @file Contact page entry
 * @module entries/contact
 * @description Bootstraps styles and navigation for pages/contact.html.
 *   Form submission is handled by the host (Netlify Forms) — no client secret.
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
import '../../styles/components/page-hero.css';
import '../../styles/components/section.css';
import '../../styles/components/contact-card.css';
import '../../styles/components/contact-form.css';
import '../../styles/pages/contact.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();
}

bootstrap();
