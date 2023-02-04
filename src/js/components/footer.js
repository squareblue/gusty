/**
 * Render `content` in a <footer> element
 */

export function footer(content) {
  return [
    `<footer class="mt-4 border-t text-center">`,
    content,
    `</footer>`
  ].join('');
}
