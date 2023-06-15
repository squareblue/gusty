/**
 * Render a link with specified attributes and content
 */
import { spawnElement } from '../lib/spawnElement';

export function link(attrs, content) {
  const {
    href = '',
    $href = href,
    ...otherAttrs
  } = attrs;

  return spawnElement.html('a', {
    ...otherAttrs,
    $href,
  }, [].concat(content || $href));
}
