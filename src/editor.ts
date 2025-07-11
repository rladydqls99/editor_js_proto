import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import CustomImage from "./image";

declare global {
  interface Window {
    editor: EditorJS;
  }
}

export const editor = new EditorJS({
  holder: "editorjs",
  autofocus: true,
  defaultBlock: "paragraph",

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
      class: CustomImage,
      inlineToolbar: false,
      config: {
        placeholder: "Paste an image URL or upload an image file...",
      },
    },
  },

  placeholder: "Type your text here...",

  // 초기 데이터를 정의할 수 있음
  // data: {
  //   blocks: [
  //     {
  //       type: "header",
  //       data: {
  //         text: "Welcome to Editor.js",
  //         level: 2,
  //       },
  //     },
  //   ],
  // },

  onReady: () => {},

  onChange: (_api, _event) => {},
});
