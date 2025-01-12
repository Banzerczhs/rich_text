import DOMNode = globalThis.Node
import DOMComment = globalThis.Comment
import DOMElement = globalThis.Element
import DOMText = globalThis.Text
import DOMRange = globalThis.Range
import DOMSelection = globalThis.Selection
import DOMStaticRange = globalThis.StaticRange

export {
  DOMNode,
  DOMComment,
  DOMElement,
  DOMText,
  DOMRange,
  DOMSelection,
  DOMStaticRange,
}

export type DOMPoint = [DOMNode, number]

export const isDOMNode = (value: any): value is DOMNode => {
  return !!window && value instanceof window.Node
}

export const isDOMElement = (value: any): value is DOMElement => {
  return isDOMNode(value) && value.nodeType === 1
}


export const isDOMComment = (value: any): value is DOMComment => {
  return isDOMNode(value) && value.nodeType === 8
}

export const getEditableChildAndIndex = (
  parent: DOMElement,
  index: number,
  direction: 'forward' | 'backward'
): [DOMNode, number] => {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (
    isDOMComment(child) ||
    (isDOMElement(child) && child.childNodes.length === 0) ||
    (isDOMElement(child) && child.getAttribute('contenteditable') === 'false')
  ) {
    if (triedForward && triedBackward) {
      break
    }

    if (i >= childNodes.length) {
      triedForward = true
      i = index - 1
      direction = 'backward'
      continue
    }

    if (i < 0) {
      triedBackward = true
      i = index + 1
      direction = 'forward'
      continue
    }

    child = childNodes[i]
    index = i
    i += direction === 'forward' ? 1 : -1
  }

  return [child, index]
}


export const getEditableChild = (
  parent: DOMElement,
  index: number,
  direction: 'forward' | 'backward'
): DOMNode => {
  const [child] = getEditableChildAndIndex(parent, index, direction)
  return child
}

export const normalizationDOMPoint = (point:DOMPoint): DOMPoint => {
  let [node,offset] = point;

  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (isDOMElement(node) && node.childNodes.length) {
    let isLast = offset === node.childNodes.length
    let index = isLast ? offset - 1 : offset;
    [node, index] = getEditableChildAndIndex(
      node,
      index,
      isLast ? 'backward' : 'forward'
    )
    // If the editable child found is in front of input offset, we instead seek to its end
    isLast = index < offset

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (isDOMElement(node) && node.childNodes.length) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getEditableChild(node, i, isLast ? 'backward' : 'forward')
    }

    // Determine the new offset inside the text node.
    offset = isLast && node.textContent != null ? node.textContent.length : 0
  }

  // Return the node and offset.
  return [node, offset]
}