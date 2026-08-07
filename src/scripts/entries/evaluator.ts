/**
 * @file Evaluator page entry
 * @module entries/evaluator
 * @description Bootstraps evaluator auth and private media dashboard.
 * @see {@link ../../../docs/SUPABASE.md}
 */

import '../../styles/fonts.css';
import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
import '../../styles/components/site-header.css';
import '../../styles/components/site-footer.css';
import '../../styles/components/evaluator-login.css';
import '../../styles/components/evaluator-dashboard.css';
import '../../styles/pages/evaluator.css';

import { initSiteFooter } from '../components/site-footer';
import { initSiteLogo } from '../components/site-logo';
import { initSiteNav } from '../components/site-nav';
import { initEvaluatorApp } from '../features/evaluator/evaluator-app';

function bootstrap(): void {
  initSiteLogo();
  initSiteNav();
  initSiteFooter();

  const appRoot = document.querySelector<HTMLElement>('[data-evaluator-app]');
  if (appRoot) {
    initEvaluatorApp(appRoot);
  }
}

bootstrap();
