import Command from './js/command/command';
import EventBus from './js/eventBus/eventBus';
import EditorRange from './js/range';
import Editor from './js/richText/create-editor';
import renderChildren from './js/richText/children';
import * as editorOperate from "./js/editor";

import "./css/index.scss";
import { EDITOR_TO_ELEMENT, ELEMENT_TO_NODE } from './js/const.js';


const editorRef = document.getElementById('editor') as HTMLElement;
const charCounter = document.getElementById('charCounter');
const maxChars = 5000;
const eventBus = new EventBus();
const editor = Editor();

let richTextState = [
  {
    type: 'node',
    tag: 'p',
    children: [
      {
        type: 'text',
        value: 'This is a paragraph',
      },
      {
        type: 'text',
        value: 'some text...',
        decorate: {
          bold: true,
          italic: true,
          underline: true
        }
      }
    ]
  }
];



function scheduleOnDOMSelectionChange(event){
  let domSelection = document.getSelection();

  if(!domSelection){
    return;
  }

  let {anchorNode, focusNode} = domSelection;

  let anchorNodeSelectable = editorRef.contains(anchorNode) && anchorNode instanceof window.Node && editorRef.isContentEditable;
  let focusNodeInEditor = editorRef.contains(focusNode) && focusNode instanceof window.Node;


  ELEMENT_TO_NODE.set(editorRef,editor);
  if (anchorNodeSelectable && focusNodeInEditor) {
    const rangeInfo = EditorRange.formatRange(editor, domSelection, {
      exactMatch: false
    })

    if (rangeInfo) {
      editorOperate.select(editor, rangeInfo);
    }
  }
}

function bindEventListeners() {
  document
    .querySelector('.toolbar .bold')
    .addEventListener('click', () => command.applyStyle('fontWeight', 'bold'));
  document
    .querySelector('.toolbar .italic')
    .addEventListener('click', () => command.applyStyle('fontStyle', 'italic'));
  document
    .querySelector('.toolbar .underline')
    .addEventListener('click', () =>
      command.applyStyle('textDecoration', 'underline')
    );
  document
    .querySelector('.toolbar .strikethrough')
    .addEventListener('click', () =>
      command.applyStyle('textDecoration', 'line-through')
    );
  document
    .querySelector('.toolbar .color-palette .toggle-color-picker')
    .addEventListener('click', toggleColorPicker);
  document
    .querySelector('.color-picker .cancel')
    .addEventListener('click', cancelTextColor);
  document
    .querySelector('.toolbar select')
    .addEventListener('change', (event) =>
      command.applyFontSize(event.target.value)
    );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      command.handleEnterPress();
    }
  });

  document.addEventListener('selectionchange', scheduleOnDOMSelectionChange);
  editorRef.addEventListener('input', updateCharCount);
  editorRef.addEventListener('mouseup', () => command.saveSelection());
  editorRef.addEventListener('keyup', () => command.saveSelection());
}

function initializeValue(value) {
  editor.children = value;
}

function renderToEditor() {
  let children = renderChildren({
    node: editor,
    renderElement,
    renderLeaf
  });
  
  EDITOR_TO_ELEMENT.set(editor,editorRef);

  children.forEach(child=>{
    editorRef.appendChild(child);
  })

  editorRef.focus();
}

function initializeEditor() {
  initializeValue(richTextState)
  bindEventListeners();

  renderToEditor();
  scheduleOnDOMSelectionChange();
}

initializeEditor();

const command = new Command(editorRef, {
  updateStructuredData: (start, end, style) => {
    // Your logic to update the structured data
  },
  insertNodeAtRange: (node, range) => {
    // Your logic to insert a node at the given range
  },
  renderToEditor: (node,range) => {
    
  }
});

function toggleColorPicker() {
  const colorPickerContainer = document.querySelector('.color-picker');
  if (
    colorPickerContainer.style.display === 'none' ||
    colorPickerContainer.style.display === ''
  ) {
    colorPickerContainer.style.display = 'block';
  } else {
    colorPickerContainer.style.display = 'none';
  }
}

function cancelTextColor() {
  document.querySelector('.color-picker').style.display = 'none';
}

function updateCharCount() {
  const text = editorRef.innerText;
  const charCount = text.length;
  charCounter.textContent = `${charCount}/${maxChars}`;
  if (charCount > maxChars) {
    editor.innerText = text.substring(0, maxChars);
    charCounter.textContent = `${maxChars}/${maxChars}`;
    alert('Character limit reached');
  }
}

function renderElement({element,children,attributes}) {
  let tag = element.tag;
  let node = null;
  switch (tag) {
    case 'p': {
      node = document.createElement('p');
    };break;
    case 'div':{
      node = document.createElement('div');
    };break;
    case 'h1':{
      node = document.createElement('h1');
    };break;
  }

  if(node){
    for(let key in attributes){
      node.setAttribute(key,attributes[key]);
    }
  
    children.forEach(child=>{
      if(child){
        node.appendChild(child);
      }
    })  
  }
  
  return node;
}

function renderLeaf(node){
  let span = document.createElement('span');
  let decorate = node.decorate || {};
  let children = node.value;
  
  if (decorate.bold) {
    children = `<strong>${children}</strong>`
  }

  if (decorate.code) {
    children = `<code>${children}</code>`
  }

  if (decorate.italic) {
    children = `<em>${children}</em>`
  }

  if (decorate.underline) {
    children = `<u>${children}</u>`
  }

  span.innerHTML = children;
  return span;
}