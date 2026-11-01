/**
 * @file Feature — Lab Horizon texts (L14 part B, replaced by the v2 texts of 30/10, L15)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Compares on collapsed whitespace and with entities decoded to plain spaces. */
const page = readFileSync(resolve(process.cwd(), 'pages/projects/lab-horizon.html'), 'utf8')
  .replace(/&#8239;|&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

describe('Lab Horizon, Léandre’s words (v2, 30/10)', () => {
  it('quotes his reflection sheet verbatim in the key chapter', () => {
    expect(page).toContain(
      '« Cette pipeline ne règle pas tout : elle ne vérifie que ce que j’ai prévu de vérifier, et elle n’est qu’une réponse parmi d’autres possibles à ce problème. »',
    );
  });

  it('states his part in one line under the hero sentence', () => {
    expect(page).toContain(
      'Projet à trois. Ma part : le cadrage UX et le parcours utilisateur, le front-end, l’architecture du dépôt, la documentation de passation et la pipeline CI/CD.',
    );
  });

  it('no longer carries the wording removed by the v2 brief', () => {
    expect(page).not.toContain('contrairement à des tests lancés par une IA');
    expect(page).not.toContain('Ce qui reste à venir');
    expect(page).not.toContain('outils anti-régression pour le développement assisté par IA');
    expect(page).not.toContain('un garde-fou pensé comme une petite CI');
  });

  it('names no teammate, only their roles', () => {
    expect(page).toContain(
      'Projet à trois : un développeur back (API et base de données), un développeur chargé du modèle IA de vulgarisation, et moi.',
    );
  });
});
