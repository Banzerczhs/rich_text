import { ExtendedType } from '../../types'
import {Editor, Path} from ".";
import { DOMPoint } from "../util/dom";

export interface BasePoint {
  path: Path  //节点路径
  offset: number  //偏移量
}

export type Point = ExtendedType<'Point', BasePoint>


export interface EditorPoint {
  point: (editor:Editor,nodes:DOMPoint,options?:{
    exactMatch?:boolean,
    searchDirection?:'forward' | 'backward'
  }) => Point
}