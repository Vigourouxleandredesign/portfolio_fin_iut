/**
 * @file Stylelint config
 * @description Encodes the color rule of AGENTS.md: brand colors live only in
 *   src/styles/variables.css; every other stylesheet uses var(--color-*).
 * @see docs/DA.md
 */
const COLOR_MESSAGE = 'Colors only in src/styles/variables.css — use var(--color-*) (AGENTS.md).';

export default {
  extends: ['stylelint-config-recommended'],
  rules: {
    // BEM modifiers/states are declared next to their block on purpose; reordering would
    // change the cascade. This heuristic rule only produces false positives here.
    'no-descending-specificity': null,
    'color-no-hex': [true, { message: COLOR_MESSAGE }],
    'color-named': ['never', { message: COLOR_MESSAGE }],
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch'],
      { message: COLOR_MESSAGE },
    ],
  },
  overrides: [
    {
      files: ['src/styles/variables.css'],
      rules: { 'color-no-hex': null, 'color-named': null, 'function-disallowed-list': null },
    },
  ],
};
