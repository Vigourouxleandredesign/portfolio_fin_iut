/**
 * @file Skills taxonomy
 * @module data/skills
 * @description Category ids shared by the projects markup (`data-project-category`) and the filter UI.
 *   Editorial project content stays in `pages/projects.html` so crawlers index it.
 */

/**
 * Skill category identifier.
 */
export type SkillCategory =
  'interactive-devices' | 'web-development' | 'webdesign' | 'product-design' | '3d' | 'motion';

/**
 * A filterable skill category.
 */
export type Skill = {
  id: SkillCategory;
  label: string;
};

/**
 * Ordered skill categories used to build the projects filter.
 * Interactive devices and web development lead — creative developer profile.
 */
export const skills: Skill[] = [
  { id: 'interactive-devices', label: 'Dispositifs interactifs' },
  { id: 'web-development', label: 'Développement web' },
  { id: 'webdesign', label: 'Webdesign & UI/UX' },
  { id: 'product-design', label: 'Design produit' },
  { id: '3d', label: 'Création 3D' },
  { id: 'motion', label: 'Animation 2D/3D' },
];
