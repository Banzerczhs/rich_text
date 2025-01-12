import { EDITOR_TO_ELEMENT, ELEMENT_TO_NODE, NODE_TO_INDEX, NODE_TO_PARENT } from "../const";
import { Editor, Node } from "../interface";
import { isDOMElement } from "../util/dom";

export const toDOMNode = (editor: any) => {
  const editorEl = EDITOR_TO_ELEMENT.get(editor);
  return editorEl;
}

export const toEditorNode = (domNode: any) => {
  let domEl = isDOMElement(domNode) ? domNode : domNode.parentElement
  
  if (domEl && !domEl.hasAttribute('data-slate-node')) {
    domEl = domEl.closest(`[data-slate-node]`)
  }

  console.log('------domEl------',domEl);
  const node = domEl ? ELEMENT_TO_NODE.get(domEl as HTMLElement) : null

  if (!node) {
    throw new Error(`Cannot resolve a Slate node from DOM node: ${domEl}`)
  }

  return node
}

export const findPath = (node: Node) => {
  const path: number[] = [];
  let currentNode = node;

  while(true){
    const parent = NODE_TO_PARENT.get(currentNode);

    if (parent == null) {
      if (currentNode._isRoot) {
        return path
      } else {
        break
      }
    }

    const i = NODE_TO_INDEX.get(currentNode)

    if (i == null) {
      break
    }

    path.unshift(i)
    currentNode = parent
  }

  throw new Error(
    `Unable to find the path for Slate node: ${JSON.stringify(node)}`
  )
}

export const apply = (editor: any, op: any) => {
  switch(op.type){
    case 'insert_node':
      editor.insertNode(op.node);
      break;
    case 'insert_text':
      editor.insertText(op.text);
      break;
    case 'set_selection':
      editor.setSelection(op.selection);
      break;
  }
}