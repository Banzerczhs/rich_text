import { NODE_TO_INDEX, NODE_TO_PARENT } from '../const.js';
import element from './element.js';

function renderChildren({ node, renderElement, renderLeaf }) {
  let children = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    NODE_TO_PARENT.set(child, node);
    NODE_TO_INDEX.set(child, i);
    if (child.type === 'node') {
      children.push(element({
        node: child,
        renderElement,
        renderLeaf
      }));
    } else {
      children.push(renderLeaf(child));
    }
  }

  return children;
}


export default renderChildren;