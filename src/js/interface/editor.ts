import { DOMElement } from '../util/dom';
import {Path} from './path';


// 操作相关类型
interface Operation {
  type: string
  path: Path
  position?: number
  properties?: Partial<Node>
  newProperties?: Partial<Node>
  node?: Node
  [key: string]: any
}

type Decorator = {
  type: string
  [key: string]: any
}

export interface Editor {
  operations: Operation[],
  children: Node[],
  selection: Range | null,
  _isRoot: Boolean,
  isInline: () => boolean,
  isSelectable: () => boolean,
  isVoid: () => boolean,
  onChange: (operations: Operation[]) => void,
  addDecorate: (decorator: Decorator) => void,
  removeDecorate: (decorator: Decorator) => void,
  range: (...args: any[]) => Range,
  apply: (...args: any[]) => void,
  toDOMNode: (...args: any[]) => DOMElement,
  toEditorNode: (...args: any[]) => Editor,
  findPath: (...args: any[]) => Number[]
}