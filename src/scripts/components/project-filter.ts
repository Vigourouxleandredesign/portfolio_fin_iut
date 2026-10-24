/**
 * @file Project filter
 * @module components/project-filter
 * @description Builds filter controls from the skills taxonomy and toggles static project cards.
 *   Cards stay in HTML (SEO); this only hides or shows them.
 */

import { skills } from '../../data/skills';

const ALL_FILTER = 'all';

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

  const availableCategories = new Set(cards.map((card) => card.dataset.projectCategory ?? ''));

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
      const matches = value === ALL_FILTER || card.dataset.projectCategory === value;
      card.hidden = !matches;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filterValue === value));
    });
  };

  const onClick = (event: Event): void => {
    const target = event.currentTarget as HTMLButtonElement;
    apply(target.dataset.filterValue ?? ALL_FILTER);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', onClick);
    container.append(button);
  });

  container.hidden = false;

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
