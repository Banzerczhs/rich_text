class DTD {
  constructor() {
      this.validChildren = {
          p: ['#text', 'a', 'b', 'i', 'u', 'span', 'br'],
          span: ['#text', 'a', 'b', 'i', 'u'],
          // Add more tag rules as necessary
      };
  }

  isValidChild(parentTag, childTag) {
      return this.validChildren[parentTag].includes(childTag);
  }
}


export default DTD;