import Editor from "@monaco-editor/react";

export default function NewEditor(props) {
    const {
      language,
      value,
      onChange
    } = props 
  function handleEditorChange(value, event) {
    onChange(value);
  }

  return (
   <Editor
     height="90vh"
     defaultLanguage={language}
     the
     defaultValue="// some comment"
     onChange={handleEditorChange}
   />
  );
}