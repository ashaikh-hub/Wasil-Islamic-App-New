// Smoke test: the real application entry (src/index.js), not the unused root App.tsx.
// Passes when the whole module graph loads and the shell mounts and renders output without throwing.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../../src';

const flush = ms => new Promise(resolve => setTimeout(resolve, ms));

test('application shell mounts and renders without throwing', async () => {
  let renderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await flush(300); // let ThemeProvider / onboarding storage reads settle
  });
  expect(renderer.toJSON()).not.toBeNull();
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 300000);
