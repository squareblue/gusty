/**
 * Entry file for site scripts.
 */

import { app } from './app';

console.log('Gusty!');
document.title = 'Hello from Gusty!';

// Hydrate 'dynamic' content into specified element
// You can use a selector string or a reference to
// an existing DOM node. For an SPA that is completely
// rendered dynamically, you'd typically have one DOM
// element on the page (conventionally with the id 'root')
// and use that for your render target.
app('#footer-container');
