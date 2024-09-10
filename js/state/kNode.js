class KNode {
  constructor(data) {
    this.type = data.type;
    this.tag = data.tag;
    this.value = data.value;
    this.props = data.props;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }

  static fromHTML(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      return new KNode('text', null, element.nodeValue);
    } else {
      const node = new KNode('node', element.tagName.toLowerCase());
      for (const child of element.childNodes) {
        node.addChild(KNode.fromHTML(child));
      }
      return node;
    }
  }

  toHTML() {
    if (this.type === 'text') {
      return document.createTextNode(this.value);
    }
    const element = document.createElement(this.tag);
    for (const prop in this.props) {
      element.style[prop] = this.props[prop];
    }
    this.children.forEach((child) => {
      element.appendChild(child.toHTML());
    });
    return element;
  }
}

export default KNode;
