const closest = function(el, selector, rootNode) {
  rootNode = rootNode || document.body;
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    const flagRoot = el === rootNode;
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
      }
      break;
    }
    el = el.parentElement;
  }
  return el;
};

const getScrollElement = function(el, direction) {
  do {
    const overflow = getComputedStyle(el).overflow;
    if ((overflow === 'auto' || overflow === 'scroll') && ((el && el.nodeType && (el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight)) || !el || !el.nodeType)) {
      break;
    }
  } while (el = el.parentNode);
  if (!el || !el.nodeType) {
    el = null;
  }
  return el;
};

const getDomIndex = function(el) {
  return Array.from(el.parentNode.children).indexOf(el)
};

export {getScrollElement, closest, getDomIndex};
