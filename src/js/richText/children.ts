import { ELEMENT_TO_NODE, NODE_TO_INDEX, NODE_TO_PARENT } from '../const.js';
import element from './element.js';
import { renderText } from "./text.js";

function renderChildren({ node, renderElement, renderLeaf }) {
  let children = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    NODE_TO_PARENT.set(child, node);
    NODE_TO_INDEX.set(child, i);
    if (child.type === 'node') {
      let el = element({
        node: child,
        renderElement,
        renderLeaf
      }) as HTMLElement;
      children.push(el);
      ELEMENT_TO_NODE.set(el,child);
    } else {
      let el = renderText({
        node: child,
        renderLeaf
      })
      children.push(el);
      ELEMENT_TO_NODE.set(el,child);
    }
  }

  return children;
}


export default renderChildren;