import { NODE_TO_INDEX } from '../const.js';

function renderChildren({ node, renderElement, renderLeaf }) {
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    let path = NODE_TO_INDEX.get(child);
    if (child.type === 'element') {
      return renderElement(child);
    } else {
      return renderLeaf(child);
    }
    NODE_TO_INDEX.set(child, i);
  }
}


export default renderChildren;