import { randomId } from './randomId';

/**
 *
 * @param {string} tag
 * @param {Array<{[key]: any, data?: {[key]: string}}|Function>} props
 * @param {Array<string|Node|Array|Function>} children
 * @returns {*}
 */
export function spawnElement(tag = 'span', props = [], children = []) {
  const elem = document.createElement(tag);

  if (Array.isArray(props)) {
    // `props` can be an array. this allows the use
    // of functions to modify the generated element,
    // and preserves the order of execution if one
    // step depends on the result of a previous step
    [...props].forEach((cfg) => {
      // execute function to modify element
      if (typeof cfg === 'function') {
        cfg(elem);
        return elem;
      }
      // or apply 'props' config values
      applyProps(elem, cfg);
    });
  }
  else {
    applyProps(elem, props);
  }

  if (children && children.length) {
    for (const child of [].concat(children)) {
      if (Array.isArray(child)) {
        const [tag, props = [], children = []] = child;
        elem.appendChild(spawnElement(tag, props, children));
        continue;
      }
      if (typeof child === 'string') {
        elem.insertAdjacentHTML('beforeend', child);
        continue;
      }
      if ([
        document.ELEMENT_NODE,
        document.DOCUMENT_FRAGMENT_NODE,
        document.TEXT_NODE
      ].includes(child.nodeType)) {
        elem.appendChild(child);
      }
    }
  }

  return elem;
}

/**
 * Static method to return an HTML string instead of DOM element(s)
 */
spawnElement.html = (tag, cfg, children) => {
  const xx = document.createElement('x-x');
  xx.appendChild(spawnElement(tag, cfg, children));
  return xx.innerHTML;
}
// aliases(?)
spawnElement.toHTML = spawnElement.html;
spawnElement.asHTML = spawnElement.html;

function applyProps(elem, props) {
  // iterate cfg object
  for (const [prop, value] of Object.entries(props)) {
    // first function to return `true` wins!
    0  // ignore this 0 - silly hack to line up 'set*' functions
    || setElementAttributes(elem, prop, value)
    || setEventListeners(elem, prop, value)
    || setElementStyle(elem, prop, value)
    || setElementData(elem, prop, value)
    || setElementProperty(elem, prop, value);
  }
}

function setElementAttributes(elem, $attr, value) {
  // use $ prefix to explicitly call 'setAttribute()'
  const prefix = /^[$]/;

  if (prefix.test($attr)) {
    try {
      elem.setAttribute($attr.replace(prefix, ''), value);
    }
    catch (e) {
      console.error(e);
    }
    // return true even if the attribute isn't set
    // since the _intention_ of calling this function
    // was to set an attrubute (so don't try setting
    // style or event listeners, etc)
    return true;
  }
  // also allow use of an object named 'attr'
  if ($attr === 'attr' && isPlainObject(value)) {
    for (const [attr, val] of Object.entries(value)) {
      try {
        elem.setAttribute(attr, val);
      }
      catch (e) {
        console.error(e);
      }
    }
    return true;
  }
  // since this is the first function called, also check for 'prop' prop
  // to directly assign values to a property (even though the property
  // may not necessarily be an attribute)
  if ($attr === 'prop' && isPlainObject(value)) {
    for (const [prop, val] of Object.entries(value)) {
      try {
        elem[prop] = val;
      }
      catch (e) {
        console.error(e);
      }
    }
    return true;
  }
}

function setElementStyle(elem, prop, style) {
  if (prop === 'style') {
    if (typeof style === 'string') {
      elem.setAttribute('style', style);
    }
    else {
      for (const [prop, value] of Object.entries(style)) {
        try {
          // assume 'px' unit for number values
          elem.style[prop] = value === (value - 0) ? `${value}px` : value;
        }
        catch (e) {
          console.error(e);
        }
      }
    }
    return true;
  }
}

function setElementData(elem, prop, data) {
  // handle 'data-*' attributes using dataset property
  if (prop === 'data') {
    for (const [name, value] of Object.entries(data)) {
      try {
        elem.dataset[name] = String(value);
      }
      catch (e) {
        console.error(e);
      }
    }
    return true;
  }
}

function getEventIds(elem) {
  return elem.dataset.events
    ? elem.dataset.events.trim().split(/\s+/)
    : [];
}

function setEventIds(elem, id = '') {
  return [...new Set([...getEventIds(elem), id || randomId('e')])].join(' ');
}

// event handlers stored in this object are bound to the document
// and check if the clicked target matches when called
export const documentEvents = {
  // example:   (this does nothing)
  ezczybv2lxd: {
    type: 'click',
    handler: (e, elem) => {
      elem.classList.add('bogus');
      console.log('Added "bogus" class');
    }
  }
};

/**
 * Add event handler to a parent element (defaults to document)
 * @param { HTMLElement } elem - reference to DOM element to 'bind' to
 * @param { string } evtType - what type of event? ('click', 'mouseover', etc)
 * @param { function | Array<string|HTMLElement|document, function> } handler ...
 *        ...function to call on `elem` with optional parent selector
 */
function delegateHandler(elem, evtType, handler) {
  // set a unique event id on the element and return the value
  const evtId = randomId('e');

  // add event id to a space-separated list stored
  // in the element's 'data-events' attribute
  elem.dataset.events = setEventIds(elem, evtId);

  // concat (to force an array) then destructure to
  // extract the parent 'context' and handler function
  const handlerParams = [].concat(handler);

  let [context, evtHandler] = handlerParams;

  if (handlerParams.length === 1) {
    evtHandler = handlerParams[0];
    context = document;
  }
  else {
    // Allow passing a reference to an existing element?
    if (context instanceof HTMLElement) {
      // do nothing since we've got our parent context
    }
    else if (typeof context === 'string') {
      // fallback to `document` if no element matches the selector
      context = document.querySelector(context) || document;
    }
    else {
      // if `context` isn't a string or a reference to a parent element
      // ...what is it??? (just assign to `document`)
      context = document;
    }
  }

  // assign the stored event object to a local variable
  // as well as a property on the exported `documentEvents` object
  const storedEvent = documentEvents[evtId] = {
    type: evtType,
    handler: evtHandler
  };
  // is it best to remove listeners before adding one?
  // probably doesn't hurt... or matter.
  try {
    context.removeEventListener(evtType, storedEvent.handler);
    context.addEventListener(evtType, (e) => {
      if (e.target?.dataset?.events?.includes(evtId)) {
        // console.log(e.target);
        // pass reference to target element as second argument
        storedEvent.handler(e, e.target);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

// TODO: handle multiple events of the same type
function setEventListeners(elem, prop, handler) {
  // handle 'on' object with individual handler methods
  if (prop === 'on') {
    for (let [evtType, evtHandler] of Object.entries(handler)) {
      try {
        delegateHandler(elem, evtType, evtHandler);
      }
      catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  // handle 'on*' properties and delegate handlers to document
  if (prop.startsWith('on')) {
    try {
      const evtType = prop.toLowerCase().replace(/^on/, '');
      // Create unique id and delegate events to document.
      // This should allow event listeners to fire
      // even if the rendered output is an HTML string.
      delegateHandler(elem, evtType, handler);
    }
    catch (e) {
      console.error(e);
    }
    return true;
  }
}

function setElementProperty(elem, prop, value) {
  try {
    elem[prop] = value;
    return true;
  }
  catch (e) {
    console.error(e);
  }
}

function isPlainObject( obj ){
  return Object.prototype.toString.call(obj) === '[object Object]';
}
