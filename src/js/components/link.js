/**
 * Render a link with specified attributes and content
 */

export function link(attrs, content = '') {
  const a = document.createElement('a');
  for (const [name, value] of Object.entries(attrs)) {
    a.setAttribute(name, String(value));
  }
  a.insertAdjacentHTML('beforeend', content || attrs.href || 'link');
  const tmp = document.createElement('x-tmp');
  tmp.appendChild(a);
  return tmp.innerHTML;
}
