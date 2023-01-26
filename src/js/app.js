/**
 * Default file for a fictional 'app'
 */
import { link } from './components/link';
import { footer } from './components/footer';

export function app(selector) {
  document.querySelector(selector).insertAdjacentHTML('beforeend', footer(`
<p class="mt-4">
&copy; 2023 Square Blue 
<span class="px-4">|</span>
${link({ 
    href: 'https://squareblue.dev', 
    'class': 'underline' 
})}
<span class="px-4">|</span>
${link({ 
    href: 'https://github.com/squareblue/gusty/', 
    'class': 'underline' 
  }, 'GitHub')}
</p>
`));
}
