import type { BlockTool, BlockToolData } from "@editorjs/editorjs";

interface Data {
  url: string;
}

class CustomImage implements BlockTool {
  private data: Data;

  static get toolbox() {
    return {
      title: "Image",
      icon: "⚒️",
    };
  }

  constructor({ data }: { data: Data }) {
    this.data = data || { url: "" };
  }

  render() {
    const input = document.createElement("input");
    input.classList.add("image");
    input.value = this.data && this.data.url ? this.data.url : "";
    return input;
  }

  save(blockContent: HTMLInputElement) {
    return {
      url: blockContent.value,
    };
  }

  validate(savedData: BlockToolData) {
    if (!savedData.url.trim()) {
      return false;
    }
    return true;
  }
}

export default CustomImage;
