import Editor from "@monaco-editor/react";

export default function MonacoEditor(props) {
    const {
      language,
      value,
      onChange
    } = props 
  function handleEditorChange(value, event) {
    onChange(value);
  }

  return (
  <div className="w-full">
    <h1>{language.toUpperCase()}</h1>
    <Editor
      height={300}
      defaultLanguage={language}
      options={{
          minimap: {
              enabled: false
          },
      }}
      theme="vs-dark"
      defaultValue={value}
      onChange={handleEditorChange}
    />
   </div>
  );
}