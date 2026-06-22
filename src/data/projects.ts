/**
 * @file Projects — portfolio content model
 * @module data/projects
 * @description Single source of truth for project listings (rendered in HTML or via future scripts).
 */

/**
 * A portfolio project entry.
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  href?: string;
};

/**
 * Portfolio projects (placeholder).
 */
export const projects: Project[] = [];
