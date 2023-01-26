/**
 * Default file for a fictional 'app'
 */
import { link } from './components/link';
import { footer } from './components/footer';

export function app(selector) {
  document.querySelector(selector).insertAdjacentHTML('beforeend', footer(`
<p class="mt-4">
&copy; 2023 Mulletech 
<span class="px-4">|</span>
${link({ 
    href: 'https://mulle.tech', 
    'class': 'underline' 
})}
<span class="px-4">|</span>
${link({ 
    href: 'https://github.com/mulletech/gusty/', 
    'class': 'underline' 
  }, 'GitHub')}
</p>
`));
}
