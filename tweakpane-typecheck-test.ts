import { Pane } from 'tweakpane';
const pane = new Pane({ title: 'Test' });
const params = { value: 1 };
pane.addBinding(params, 'value', { min: 0, max: 10, step: 0.1 });
