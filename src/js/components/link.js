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

export function linkToo(props, uid) {
  return [...props].reduce((a, cfg) => {
    if (uid) {
      a.setAttribute('data-uid', uid);
    }
    if (typeof cfg === 'function') {
      cfg(a);
      return a;
    }
    for (const [prop, value] of Object.entries(cfg)) {
      // use $attr to explicitly call 'setAttribute()'
      if (prop.startsWith('$')) {
        a.setAttribute(prop.replace(/^[$]/, ''), value);
        continue;
      }

      // delegate event listeners to the document and use
      // unique id to determine if event target matches
      if (prop.startsWith('on') && typeof value === 'function') {
        const callback = value; // rename for clarity
        const evtType = prop.toLowerCase().replace(/^on/, '');
        const evtId = uid || randomId('evt');
        // create unique id and delegate events to document
        // This should allow event listeners to fire
        // even if the rendered output is an HTML string.
        a.setAttribute('data-evt', evtId);
        document.addEventListener(evtType, (e) => {
          const evtTarget = e.target;
          if (evtTarget['getAttribute']('data-evt') === evtId) {
            callback(e);
          }
        });
        continue;
      }

      // finally, try to assign directly to an element property
      try {
        a[prop] = value;
      } catch (e) {
        // fail silently so *all* rendering doesn't stop, but log an error
        console.error(e);
      }
    }
    return a;
  }, document.createElement('a'));
}

function randomId(prefix = 'i') {
  return prefix + Math.random().toString(36).substring(2, 12).toLowerCase();
}
