/**
 * Default file for a fictional 'app'
 */

import { footer } from './components/footer';

export function app(selector) {
  document.querySelector(selector).insertAdjacentHTML('beforeend', footer(`
<div style="max-width:400px;margin:0 auto;color:#aaa;">
<br><hr>
<p class="mt-4">&copy; 2023 Mulletech <span class="px-2">|</span> https://mulle.tech</p>
</div>
`));
}
