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
    <h1 className="font-bold text-center py-5">{language.toUpperCase()}</h1>
    <Editor
      className="border-4 border-black rounded-md"
      height={300}
      defaultLanguage={language}
      options={{
          minimap: {
              enabled: false
          },
          fontSize: "20px"
      }}
      theme="light"
      defaultValue={value}
      onChange={handleEditorChange}
    />
   </div>
  );
}