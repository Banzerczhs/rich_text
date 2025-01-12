import { isBefore, isDomSelection } from '../util/index';
import { EditorRange } from '../interface/index.js';
import EditorPoint from '../editor/point';
import type {Range} from "../interface";

const EditRange: EditorRange = {
    savedRange: null,
    getSelectionRange() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return {
                anchor: {
                    path: [0],
                    offset: range.startOffset
                },
                focus: {
                    path: [0],
                    offset: range.endOffset
                }
            };
        }
        return null;
    },
    saveSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.savedRange = {
                anchor: {
                    path: [0],
                    offset: selection.getRangeAt(0).startOffset
                },
                focus: {
                    path: [0],
                    offset: selection.getRangeAt(0).endOffset
                }
            }
        }
    },
    isRange(target: any) {
        return target instanceof Range;
    },
    restoreSelection() {
        const selection = window.getSelection();
        if (this.savedRange && selection) {
            selection.removeAllRanges();
        }
    },
    formatRange(editor, domRange): Range | null {
        const el = isDomSelection(domRange) ? domRange.anchorNode : domRange.startContainer;
        let anchorNode
        let anchorOffset
        let focusNode
        let focusOffset
        let isCollapsed
        if(el){
            if(isDomSelection(domRange)){
                anchorNode = domRange.anchorNode;
                anchorOffset = domRange.anchorOffset;
                focusNode = domRange.focusNode;
                focusOffset = domRange.focusOffset;
                isCollapsed = domRange.isCollapsed;
            }else{
                anchorNode = domRange.startContainer;
                anchorOffset = domRange.startOffset;
                focusNode = domRange.endContainer;
                focusOffset = domRange.endOffset;
                isCollapsed = domRange.collapsed;
            }

            let focusBeforeAnchor = isBefore(anchorNode!, focusNode!) || (anchorNode! === focusNode! && focusOffset < anchorOffset);
            
            let anchor = EditorPoint.point(editor,[anchorNode!,anchorOffset]);
            let focus = isCollapsed ? anchor : EditorPoint.point(editor,[focusNode!,focusOffset],{
                exactMatch:true,
                searchDirection: focusBeforeAnchor ? 'forward' : 'backward'
            });

            return {
                anchor,
                focus
            }
        }
        return null;
    }
}

export default EditRange;
