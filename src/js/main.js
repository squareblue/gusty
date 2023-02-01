/**
 * Entry file for site scripts.
 */

import { app } from './app';

console.log('Gusty!');
document.title = 'Hello from Gusty!';

// Hydrate 'dynamic' content into #root element
app('#footer-container');
