/**
 * @file Evaluator page entry
 * @module entries/evaluator
 * @description Bootstraps evaluator auth and private media dashboard.
 * @see {@link ../../../docs/SUPABASE.md}
 */

import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
import '../../styles/components/evaluator-login.css';
import '../../styles/components/evaluator-dashboard.css';
import '../../styles/pages/evaluator.css';

import { initSiteFooter } from '../components/site-footer';
import { initEvaluatorApp } from '../features/evaluator/evaluator-app';

function bootstrap(): void {
  initSiteFooter();

  const appRoot = document.querySelector<HTMLElement>('[data-evaluator-app]');
  if (appRoot) {
    initEvaluatorApp(appRoot);
  }
}

bootstrap();
