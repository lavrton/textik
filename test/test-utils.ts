import { assert } from 'chai';
import { Textika } from '../src/index';

import carota from '../src/carota';

export const isNode = typeof global.document === 'undefined';
export const isBrowser = !isNode;

export function getContainer() {
  return document.getElementById('test-container') as HTMLDivElement;
}

export function addContainer() {
  if (isNode) {
    return;
  }
  var container = document.createElement('div');

  getContainer().appendChild(container);
  container.style.position = 'relative';
  container.style.border = '1px solid black';
  container.style.display = 'inline-block';
  container.style.width = '300px';
  return container;
}

export function createEditor(attrs?) {
  const container = addContainer();
  var canvas =
    (!isNode && global.document.createElement('canvas')) || undefined;

  container.appendChild(canvas);

  const editor = new Textika({
    canvas,
  });

  return editor;
}

export function createCarota() {
  const el = addContainer();
  var exampleEditor = carota.editor.create(el);
  return exampleEditor;
}
