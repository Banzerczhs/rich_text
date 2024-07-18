class Range {
  constructor() {
      this.savedRange = null;
  }

  getSelectionRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
          return selection.getRangeAt(0);
      }
      return null;
  }

  saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
          this.savedRange = selection.getRangeAt(0);
      }
  }

  restoreSelection() {
      const selection = window.getSelection();
      if (this.savedRange) {
          selection.removeAllRanges();
          selection.addRange(this.savedRange);
      }
  }
}

export default Range;
