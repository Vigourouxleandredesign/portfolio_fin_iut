/**
 * @file Project filter
 * @module components/project-filter
 * @description Builds filter controls from the skills taxonomy and toggles static project cards.
 *   Cards stay in HTML (SEO); this only hides or shows them. The chosen domain is read from, and mirrored
 *   to, the `?domaine=` query parameter (unknown value → « Tout »).
 */

import { skills } from '../../data/skills';

const ALL_FILTER = 'all';

/** Query parameter shared with the home « domaines » plaques: `/projects?domaine=3d`. */
const DOMAIN_PARAM = 'domaine';

/**
 * Mounts the projects filter inside `[data-project-filter]`.
 * @returns Teardown function removing the generated controls.
 */
export function initProjectFilter(): () => void {
  const container = document.querySelector<HTMLElement>('[data-project-filter]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-project-category]'));

  if (!container || cards.length === 0) {
    return () => undefined;
  }

  /** A card can belong to several categories: `data-project-category="web-development 3d"`. */
  const categoriesOf = (card: HTMLElement): string[] =>
    (card.dataset.projectCategory ?? '').split(/\s+/).filter(Boolean);

  const availableCategories = new Set(cards.flatMap(categoriesOf));

  const entries = [
    { id: ALL_FILTER, label: 'Tout' },
    ...skills.filter((skill) => availableCategories.has(skill.id)),
  ];

  const buttons = entries.map((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-filter__button';
    button.dataset.filterValue = entry.id;
    button.textContent = entry.label;
    button.setAttribute('aria-pressed', String(entry.id === ALL_FILTER));
    return button;
  });

  const apply = (value: string): void => {
    cards.forEach((card) => {
      const matches = value === ALL_FILTER || categoriesOf(card).includes(value);
      card.hidden = !matches;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filterValue === value));
    });
  };

  /** Mirrors the active filter in the address bar without adding a history entry. */
  const syncUrl = (value: string): void => {
    const url = new URL(window.location.href);
    if (value === ALL_FILTER) url.searchParams.delete(DOMAIN_PARAM);
    else url.searchParams.set(DOMAIN_PARAM, value);
    window.history.replaceState(window.history.state, '', url);
  };

  const onClick = (event: Event): void => {
    const target = event.currentTarget as HTMLButtonElement;
    const value = target.dataset.filterValue ?? ALL_FILTER;
    apply(value);
    syncUrl(value);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', onClick);
    container.append(button);
  });

  container.hidden = false;

  const requested = new URLSearchParams(window.location.search).get(DOMAIN_PARAM) ?? ALL_FILTER;
  apply(entries.some((entry) => entry.id === requested) ? requested : ALL_FILTER);

  return () => {
    buttons.forEach((button) => {
      button.removeEventListener('click', onClick);
      button.remove();
    });
    cards.forEach((card) => {
      card.hidden = false;
    });
    container.hidden = true;
  };
}
