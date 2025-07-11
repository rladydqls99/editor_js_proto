import type { BlockTool, BlockToolData } from "@editorjs/editorjs";

interface Data {
  url: string;
}

class CustomImage implements BlockTool {
  private data: Data;
  private wrapper: HTMLElement | undefined;

  // Editor.js 툴바에 표시될 아이콘과 제목을 정의
  static get toolbox() {
    return {
      title: "Image",
      icon: "⚒️",
    };
  }

  // 최초에 생성될 때 호출
  constructor({ data }: { data: Data }) {
    this.data = data || { url: "" };
  }

  // Editor.js가 이 툴을 렌더링할 때 호출
  render() {
    const input = this.createInput("Paste image URL here...");
    input.value = this.data && this.data.url ? this.data.url : "";

    input.addEventListener("paste", (event: ClipboardEvent) => {
      this.renderImageView(event.clipboardData?.getData("text/plain") || "");
    });

    this.wrapper = this.createWrapper();
    this.wrapper.appendChild(input);

    return this.wrapper;
  }

  // Editor.js가 이 툴의 데이터를 저장할 때 호출
  save(blockContent: HTMLInputElement) {
    return {
      url: blockContent.value,
    };
  }

  // Editor.js가 이 툴의 데이터를 불러올 때 호출하여 유효성 검증
  validate(savedData: BlockToolData) {
    if (!savedData.url.trim()) {
      return false;
    }
    return true;
  }

  // 이미지 URL을 받아서 이미지를 생성
  private renderImageView(url: string) {
    if (!this.wrapper) return;

    const image = this.createImage(url);
    const caption = this.createInput("Caption...");

    this.wrapper.replaceChildren(image, caption);
  }

  // 컴포넌트 생성 함수 -----------------------------------------
  private createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-wrapper");

    return wrapper;
  }

  private createInput(placeholder: string) {
    const input = document.createElement("input");
    input.classList.add("image-input");
    input.placeholder = placeholder;

    return input;
  }

  private createImage(url: string) {
    const image = document.createElement("img");
    image.src = url;
    image.alt = "Image";

    return image;
  }
}

export default CustomImage;
