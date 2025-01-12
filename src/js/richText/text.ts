export function renderText({node,renderLeaf}){
  const leaf = renderLeaf(node);
  leaf.dataset.slateNode="text";
  leaf.dataset.slateLeaf="true";
  return leaf;
}