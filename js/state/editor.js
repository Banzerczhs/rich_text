let editor = {
  children: [],
  operations: [],
  selection: null,
  isInline: () => false,
  isSelectable: () => true,
  isVoid: () => false,
  onChange: ()=>{},
  
  addDecorate: ()=>{},
  removeDecorate: ()=>{},
  insertNode: (...args) => insertNode(editor, ...args),
  insertText: (...args) => insertText(editor, ...args),
}

export default editor;