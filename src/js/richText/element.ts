import renderChildren from "./children.js";

function element({
  node,
  renderElement,
  renderLeaf
}){
  let children = renderChildren({
    node,
    renderElement,
    renderLeaf
  });

  const attributes = {
    'data-slate-node': 'element',
  }

  return renderElement({
    element: node,
    children,
    attributes
  });
}

export default element;