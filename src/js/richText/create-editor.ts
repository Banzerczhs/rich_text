import { apply, toDOMNode, toEditorNode, findPath } from '../editor';
import range from '../range';
import { Editor } from '../interface';

let createEditor = ():Editor=>{
  const editor = {
    children: [],
    operations: [],
    selection: null,
    isInline: () => false,
    isSelectable: () => true,
    isVoid: () => false,
    onChange: ()=>{},
    
    addDecorate: ()=>{},
    removeDecorate: ()=>{},
  
    range: (...args:any[]) => range.formatRange(...args),
    apply: (...args:any[]) => apply(editor,args),
    toDOMNode: (...args:any[]) => toDOMNode(...args),
    toEditorNode: (...args:any[]) => toEditorNode(...args),
    findPath: (...args:any[]) => findPath(...args),
    _isRoot: true
  }
  return editor;
}

export default createEditor;