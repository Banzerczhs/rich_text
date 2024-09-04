import Range from '../range/range.js';

class Command {
    constructor(editor, state) {
        this.editor = editor;
        this.state = state;
        this.range = new Range();
    }

    applyStyle(styleName, value) {
        const range = this.range.getSelectionRange();
        if (!range) return;
        const start = range.startOffset;
        const end = range.endOffset;
        const commonAncestorContainer = range.commonAncestorContainer;

        if (!this.editor.contains(commonAncestorContainer)) {
            alert('Please make a selection within the editor.');
            return;
        }

        this.state.updateStructuredData({ 
            css: {
                [styleName]: value
            },
            rangeInfo: {
                start,
                end
            }
        });
        this.state.renderToEditor();
        this.range.saveSelection();
    }

    applyFontSize(fontSize) {
        this.applyStyle('fontSize', fontSize);
    }

    handleEnterPress() {
        const range = this.range.getSelectionRange();
        if (!range) return;
        const p = new KNode('node', 'p', '', {});
        const br = new KNode('node', 'br', '', {});
        p.addChild(br);
        this.state.insertNodeAtRange(p, range);
    }

    saveSelection() {
        this.range.saveSelection();
    }

    restoreSelection() {
        this.range.restoreSelection();
    }
}

export default Command;
