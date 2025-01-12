export const select = (editor, target) => {
  const {selection} = editor;
  target = editor.range(editor, target);

  if(!Range.isRange(target)){
    throw new Error(`When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${Scrubber.stringify(
      target
    )}`);
  }

  console.log('------target------',target);

  if(selection){
    editor.apply({
      type: 'set_selection',
      selection: target
    });
  }
}