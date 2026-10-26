/**
 * @file Feature — Lab Horizon texts written by Léandre on 26/10 (L14 part B)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Compares on collapsed whitespace and with entities decoded to plain spaces. */
const page = readFileSync(resolve(process.cwd(), 'pages/projects/lab-horizon.html'), 'utf8')
  .replace(/&#8239;|&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

describe('Lab Horizon, Léandre’s words', () => {
  it('« Ce que j’ai fait » keeps his text verbatim', () => {
    expect(page).toContain(
      'Développement front, UI/UX (maquettes, parcours utilisateur), architecture et documentation, et mise en place d’une chaîne CI/CD : des hooks pre-commit et pre-merge sur la branche main (production) imposent des tests automatisés, reproductibles et impossibles à contourner, contrairement à des tests lancés par une IA.',
    );
  });

  it('chapter III keeps his text verbatim', () => {
    expect(page).toContain(
      'Le projet est remis avec un dossier de passation (lancer, maintenir, faire évoluer). Chaque commit et chaque fusion sur main passent par des hooks pre-commit et pre-merge qui lancent les tests : types, secrets, couleurs, tests unitaires, build. Le résultat est le même à chaque exécution et ne peut pas être contourné, contrairement à des tests lancés par une IA.',
    );
  });

  it('no longer carries the previous wording', () => {
    expect(page).not.toContain('outils anti-régression pour le développement assisté par IA');
    expect(page).not.toContain('un garde-fou pensé comme une petite CI');
  });
});
