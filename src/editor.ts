import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import CustomImage from "./image";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";

declare global {
  interface Window {
    editor: EditorJS;
  }
}

export const editor = new EditorJS({
  holder: "editorjs",
  autofocus: true,

  tools: {
    header: Header,
    list: List,
    quote: {
      class: Quote,
      config: {
        quotePlaceholder: "Enter a quote",
        captionPlaceholder: "Quote's author",
      },
    },
    table: Table,
    image: {
      class: CustomImage,
      inlineToolbar: false,
      config: {
        placeholder: "Paste an image URL or upload an image file...",
      },
    },
    code: Code,
    inlineCode: InlineCode,
    delimiter: Delimiter,
  },

  placeholder: "Type your text here...",

  data: { blocks: [] },
  onReady: () => {},
  onChange: (_api, _event) => {},
});
