import Command from './command/command.js';
import DTD from './dtd/dtd.js';
import EventBus from './eventBus/eventBus.js';
import Range from './range/range.js';
import editor from './state/editor.js';
import renderChildren from './state/children.js';

const editorRef = document.getElementById('editor');
const charCounter = document.getElementById('charCounter');
const maxChars = 5000;
const eventBus = new EventBus();
const dtd = new DTD();
const range = new Range();

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
  
  console.log('----children----',children);
  // editorRef.appendChild(children);
}

function initializeEditor() {
  initializeValue(richTextState)
  bindEventListeners();

  renderToEditor();
}

initializeEditor();

const command = new Command(editor, {
  updateStructuredData: (start, end, style) => {
    // Your logic to update the structured data
  },
  insertNodeAtRange: (node, range) => {
    // Your logic to insert a node at the given range
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
  const text = editor.innerText;
  const charCount = text.length;
  charCounter.textContent = `${charCount}/${maxChars}`;
  if (charCount > maxChars) {
    editor.innerText = text.substring(0, maxChars);
    charCounter.textContent = `${maxChars}/${maxChars}`;
    alert('Character limit reached');
  }
}

function renderElement({element,children}) {
  let tag = element.tag;
  let node = null;
  switch (tag) {
    case 'p': {
      node = document.createElement('p');
      node.appendChild(children);
    };break;
    case 'div':{
      node = document.createElement('div');
      node.appendChild(children);
    };break;
    case 'h1':{
      node = document.createElement('h1');
      node.appendChild(children);
    };break;
  }

  return node;
}

function renderLeaf(node){
  let span = document.createElement('span');
  let decorate = node.decorate;
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