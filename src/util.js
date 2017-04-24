const closest = function(el, selector, rootNode) {
  const rootElement = rootNode || document.body;
  let element = el;
  const matchesSelector = element.matches
                          || element.webkitMatchesSelector
                          || element.mozMatchesSelector
                          || element.msMatchesSelector;
  while (element) {
    const flagRoot = element === rootElement;
    if (flagRoot || matchesSelector.call(element, selector)) {
      if (flagRoot) {
        element = null;
      }
      break;
    }
    element = element.parentElement;
  }
  return element;
};

const getScrollElement = function(el) {
  let element = el;
  do {
    const overflow = getComputedStyle(element).overflow;
    if ((overflow === 'auto' || overflow === 'scroll')
        && (element && element.nodeType
            && (element.offsetWidth < element.scrollWidth
                || element.offsetHeight < element.scrollHeight))) {
      break;
    }
    if (!element || !element.nodeType || element === document.body) {
      element = null;
      break;
    }
    element = element.parentElement;
  } while (element);
  return element;
};

const getDomIndex = function(el) {
  return Array.from(el.parentNode.children).indexOf(el);
};

export { getScrollElement, closest, getDomIndex };
