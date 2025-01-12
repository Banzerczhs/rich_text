import { Editor } from ".";

export type TextNode = {
  type: 'text',
  value: String,
  decorate?: any
}

export type ElementNode = {
  type: 'node',
  tag: String,
  children: Array<ElementNode | TextNode>
}

export type Node = Editor | TextNode | ElementNode;