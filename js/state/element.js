import renderChildren from "./children";
import KNode from "./knode";

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