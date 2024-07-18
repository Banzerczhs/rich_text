import KNode from './state/kNode.js';
import Command from './command/command.js';
import DTD from './dtd/dtd.js';
import EventBus from './eventBus/eventBus.js';
import Range from './range/range.js';

const editor = document.getElementById('editor');
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
        value: 'Start typing here...'
      }
    ]
  }
];

function renderToEditor() {
  const render = (data) => {
    const { type, tag, children, props } = data;
    if (type === 'text') {
      return document.createTextNode(data.value);
    }
    const element = document.createElement(tag);
    if (props) {
      for (let prop in props) {
        element.style[prop] = props[prop];
      }
    }
    children.forEach((child) => {
      element.appendChild(render(child));
    });
    return element;
  };
  editor.innerHTML = '';
  richTextState.forEach((node) => {
    const element = render(node);
    editor.appendChild(element);
  });
}

renderToEditor();

const command = new Command(editor, {
  updateStructuredData: (start, end, style) => {
    // Your logic to update the structured data
  },
  renderToEditor,
  insertNodeAtRange: (node, range) => {
    // Your logic to insert a node at the given range
  }
});

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

  editor.addEventListener('input', updateCharCount);
  editor.addEventListener('mouseup', () => command.saveSelection());
  editor.addEventListener('keyup', () => command.saveSelection());
}

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

bindEventListeners();
