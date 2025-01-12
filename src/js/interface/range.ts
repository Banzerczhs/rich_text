import { ExtendedType } from '../../types';
import {Point} from ".";
import {Editor} from "./editor";
import { DOMRange, DOMSelection } from '../util/dom';

export interface BaseRange {
  anchor: Point  //起始点
  focus: Point  //结束点
}

export type Range = ExtendedType<'Range', BaseRange>


export interface EditorRange {
  savedRange: Range | null,
  getSelectionRange: () => Range | null,
  saveSelection: () => void,
  isRange: (target:any) => boolean,
  restoreSelection: () => void,
  formatRange: (editor:Editor,domRange:DOMRange | DOMSelection,options:{
    exactMatch: boolean
  }) => Range | null
}