import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

declare global {
  interface Window {
    editor: EditorJS;
  }
}

export const editor = new EditorJS({
  holder: "editorjs",

  tools: {
    header: Header,
    list: List,
  },

  placeholder: "Type your text here...",
});
