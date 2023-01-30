import { spawnElement } from './spawnElement';

/**
 * Spawn HTML strings from spawnElement-type patterns
 */
export function spawnHTML(tag, cfg, children) {
  const xx = document.createElement('x-x');
  xx.appendChild(spawnElement(tag, cfg, children));
  return xx.innerHTML;
}
