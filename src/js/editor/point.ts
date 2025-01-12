import { DOMElement, normalizationDOMPoint } from "../util/dom";
import { EditorPoint as EditorPointType, Point } from "../interface";


const EditorPoint:EditorPointType = {
  point(editor,domPoint,options): Point{
    const { exactMatch, searchDirection = 'forward' } = options || {};
    const [ nearestNode, nearestOffset ] = exactMatch ? domPoint : normalizationDOMPoint(domPoint);

    const parentNode = nearestNode.parentNode as DOMElement;
    let textNode: DOMElement | null = null
    let offset = 0

    if (parentNode) {
      const editorEl = editor.toDOMNode(editor, editor);

      const potentialVoidNode = parentNode.closest('[data-slate-void="true"]');
      const voidNode =
        potentialVoidNode && editorEl.contains(potentialVoidNode)
          ? potentialVoidNode
          : null
      const potentialNonEditableNode = parentNode.closest(
        '[contenteditable="false"]'
      )
      const nonEditableNode =
        potentialNonEditableNode && editorEl.contains(potentialNonEditableNode)
          ? potentialNonEditableNode
          : null
      let leafNode = parentNode.closest('[data-slate-leaf]')
      let domNode: DOMElement | null = null

      // Calculate how far into the text node the `nearestNode` is, so that we
      // can determine what the offset relative to the text node is.
      if (leafNode) {
        textNode = leafNode.closest('[data-slate-node="text"]')

        if (textNode) {
          const range = window.document.createRange()
          range.setStart(textNode, 0)
          range.setEnd(nearestNode, nearestOffset)

          const contents = range.cloneContents()
          const removals = [
            ...Array.prototype.slice.call(
              contents.querySelectorAll('[data-slate-zero-width]')
            ),
            ...Array.prototype.slice.call(
              contents.querySelectorAll('[contenteditable=false]')
            ),
          ]

          removals.forEach(el => {
            // COMPAT: While composing at the start of a text node, some keyboards put
            // the text content inside the zero width space.
            if (
              !exactMatch &&
              el.hasAttribute('data-slate-zero-width') &&
              el.textContent.length > 0 &&
              el.textContext !== '\uFEFF'
            ) {
              if (el.textContent.startsWith('\uFEFF')) {
                el.textContent = el.textContent.slice(1)
              }

              return
            }

            el!.parentNode!.removeChild(el)
          })

          // COMPAT: Edge has a bug where Range.prototype.toString() will
          // convert \n into \r\n. The bug causes a loop when slate-react
          // attempts to reposition its cursor to match the native position. Use
          // textContent.length instead.
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10291116/
          offset = contents.textContent!.length
          domNode = textNode
        }
      } else if (voidNode) {
        // For void nodes, the element with the offset key will be a cousin, not an
        // ancestor, so find it by going down from the nearest void parent and taking the
        // first one that isn't inside a nested editor.
        const leafNodes = voidNode.querySelectorAll('[data-slate-leaf]')
        for (let index = 0; index < leafNodes.length; index++) {
          const current = leafNodes[index]
          if (ReactEditor.hasDOMNode(editor, current)) {
            leafNode = current
            break
          }
        }

        // COMPAT: In read-only editors the leaf is not rendered.
        if (!leafNode) {
          offset = 1
        } else {
          textNode = leafNode.closest('[data-slate-node="text"]')!
          domNode = leafNode
          offset = domNode.textContent!.length
          domNode.querySelectorAll('[data-slate-zero-width]').forEach(el => {
            offset -= el.textContent!.length
          })
        }
      } else if (nonEditableNode) {
        // Find the edge of the nearest leaf in `searchDirection`
        const getLeafNodes = (node: DOMElement | null | undefined) =>
          node
            ? node.querySelectorAll(
                // Exclude leaf nodes in nested editors
                '[data-slate-leaf]:not(:scope [data-slate-editor] [data-slate-leaf])'
              )
            : []
        const elementNode = nonEditableNode.closest(
          '[data-slate-node="element"]'
        )

        if (searchDirection === 'forward') {
          const leafNodes = [
            ...getLeafNodes(elementNode),
            ...getLeafNodes(elementNode?.nextElementSibling),
          ]
          leafNode =
            leafNodes.find(leaf => isAfter(nonEditableNode, leaf)) ?? null
        } else {
          const leafNodes = [
            ...getLeafNodes(elementNode?.previousElementSibling),
            ...getLeafNodes(elementNode),
          ]
          leafNode =
            leafNodes.findLast(leaf => isBefore(nonEditableNode, leaf)) ?? null
        }

        if (leafNode) {
          textNode = leafNode.closest('[data-slate-node="text"]')!
          domNode = leafNode
          if (searchDirection === 'forward') {
            offset = 0
          } else {
            offset = domNode.textContent!.length
            domNode.querySelectorAll('[data-slate-zero-width]').forEach(el => {
              offset -= el.textContent!.length
            })
          }
        }
      }
    }

    if (!textNode) {
      throw new Error(
        `Cannot resolve a Slate point from DOM point: ${domPoint}`
      )
    }

    // COMPAT: If someone is clicking from one Slate editor into another,
    // the select event fires twice, once for the old editor's `element`
    // first, and then afterwards for the correct `element`. (2017/03/03)
    const editorNode = editor.toEditorNode(textNode);
    const path = editor.findPath(editorNode);
    return { path, offset } as T extends true ? Point | null : Point
  }
}

export default EditorPoint;