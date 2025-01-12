import { Editor } from "./interface";

export const NODE_TO_INDEX = new Map();
export const NODE_TO_PARENT = new WeakMap();
export const NODE_TO_ELEMENT = new WeakMap();
export const ELEMENT_TO_NODE = new WeakMap<HTMLElement,Editor>();
export const ELEMENT_TO_EDITOR = new WeakMap();
export const EDITOR_TO_ELEMENT = new WeakMap();

export const NODE_TO_KEY = new WeakMap();