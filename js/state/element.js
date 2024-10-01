import renderChildren from "./children.js";

function element({
  node,
  renderElement
}){
  let children = renderChildren({
    node,
    renderElement,
    renderLeaf
  });

  return renderElement({
    element: node,
    children
  });
}

export default element;