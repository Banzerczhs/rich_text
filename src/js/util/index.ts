import { DOMSelection } from './dom';

export const isDomSelection = (value:any): value is DOMSelection => {
  return !!window && value instanceof window.Selection;
}

export const isBefore = (node:Node,otherNode:Node) => {
  return node.compareDocumentPosition(otherNode) === Node.DOCUMENT_POSITION_PRECEDING;
}

export const isAfter = (node:Node,otherNode:Node) => {
  return node.compareDocumentPosition(otherNode) === Node.DOCUMENT_POSITION_FOLLOWING;
}