import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";

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
    table: Table,
    inlineCode: InlineCode,
    quote: {
      class: Quote,
      config: {
        quotePlaceholder: "Enter a quote",
        captionPlaceholder: "Quote's author",
      },
    },
    image: {
      class: Image,
      config: {
        endpoints: {
          byFile: "https://api.example.com/upload",
          byUrl: "https://api.example.com/fetch",
        },
      },
    },
  },

  placeholder: "Type your text here...",

  onReady: () => {
    console.log("Editor.js is ready!");
  },

  onChange: (_, event) => {
    console.log("Content changed!", event);
  },
});
