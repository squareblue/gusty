/**
 * Default file for a fictional 'app'
 */
import { link } from './components/link';
import { footer } from './components/footer';
import { spawnHTML } from './lib/spawnHTML';

function clickLi(e, li) {
  console.log(e);
  console.log(li.textContent);
}

let countA = 0;
let countB = 0;

export function app(selector) {
document.querySelector(selector).insertAdjacentHTML('beforeend', footer(`
<p class="mt-4">
&copy; 2023 Square Blue 
<span class="px-4">|</span>
${link({
    id: 'squareblue-website',
    href: 'https://squareblue.dev',
    target: '_blank',
    'class': 'underline'
  })}
<span class="px-4">|</span>
${
    spawnHTML('a', [
      {
        // use '$' prefix to explicitly call .setAttribute()
        $href: 'https://github.com/squareblue/gusty/',
        // use 'attr' object used for .setAttribute(propName, propValue)
        attr: {
          target: '_blank'  
        },
        // use 'prop' object do explicitly assing a property to an element
        // (not necessarily the same as an attribute)
        prop: {
          id: 'squareblue-github-gusty'  
        },
        onclick: (e, a) => {
          e.preventDefault();
          console.log(e.currentTarget);
          console.log(a.href);
        },
        // bind listener to '#root' but only execute
        // when target is the element being spawned here
        // (useful to prevent calling handlers many many times 
        // for events that fire a lot like 'mousemove')
        // this works even for content rendered as HTML strings
        // as long as the parent context selector/element exists in
        // the document when this element is spawned
        onmouseover: ['#root', (e, a) => {
          console.log(a.href);
        }]
      },
      (a) => a.classList.add('underline')
    ], 'GitHub')
}
</p>
`
  ))
}
// Leaving this down here for reference.
//
// spawnHTML('ul', {
//   style: 'font-size:20px;color:red;'
// }, [
//   ['li', [
//     {
//       onclick: clickLi,
//       // onmouseover: () => console.log('HI')
//     },
//     {
//       onclick: function clickA() {
//         console.log(countA += 1);
//       }
//     },
//     {
//       onclick: function clickB() {
//         console.log(countB += 100);
//       }
//     },
//     {
//       onclick: function clickB() {
//         console.log(countB + (countA * 9));
//       }
//     },
//   ], 'foo'],
//   ['li', [
//     { onclick: clickLi },
//     {
//       style: {
//         color: 'cornflowerblue'
//       }
//     },
//     {
//       style: {
//         fontSize: 12
//       }
//     },
//     (li) => {
//       console.log(li);
//       const style = `${li.getAttribute('style')} font-weight:bold;`;
//       li.setAttribute('style', style);
//     }
//   ], 'bar']
// ]);
