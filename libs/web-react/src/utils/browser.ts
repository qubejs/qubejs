const _body = document.body;
const _window: any = window;
const order = ['xs', 'sm', 'md', 'lg', 'xlg'];

const breakpoints = {
  current: () => {
    const styles = _window.getComputedStyle(_body, ':after');
    const content = styles['content'];
    return (content || 'xs').replace(/"/g, '').replace(/'/g, '');
  },
  down: (breakpoint) => {
    const current = breakpoints.current();
    const currentIdx = order.indexOf(current);
    const breakIdx = order.indexOf(breakpoint);
    if (currentIdx <= breakIdx) {
      return true;
    }
    return false;
  },
  up: (breakpoint) => {
    const current = breakpoints.current();
    const currentIdx = order.indexOf(current);
    const breakIdx = order.indexOf(breakpoint);
    if (currentIdx >= breakIdx) {
      return true;
    }
    return false;
  },
};

const scriptManager = {
  insertDynamicScript: (dScript, target = 'head') => {
    const str = dScript;
    // Create an element outside the document to parse the string with
    const head = document.createElement('head');
    // Parse the string
    head.innerHTML = str;
    // Copy those nodes to the real `head`, duplicating script elements so
    // they get processed
    let node:any = head.firstChild;
    while (node) {
      const next = node.nextSibling;
      if (node.tagName === 'SCRIPT') {
        // Just appending this element wouldn't run it, we have to make a fresh copy
        const newNode = document.createElement('script');
        if (node.src) {
          newNode.src = node.src;
        }
        while (node.firstChild) {
          // Note we have to clone these nodes
          newNode.appendChild(node.firstChild.cloneNode(true));
          node.removeChild(node.firstChild);
        }
        node = newNode;
      }
      document[target].appendChild(node);
      node = next;
    }
  },
};

export default { breakpoints, scriptManager };
