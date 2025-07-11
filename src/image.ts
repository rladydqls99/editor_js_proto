import type { BlockTool, BlockToolData } from "@editorjs/editorjs";
import type { MenuConfig } from "@editorjs/editorjs/types/tools";

interface Data {
  url: string;
}
interface Setting {
  name: string;
  icon: string;
}

class CustomImage implements BlockTool {
  private data: Data;
  private wrapper: HTMLElement | undefined;
  private settings: Setting[];
  private settingButtons: HTMLButtonElement[] = []; // 설정 버튼들의 참조 저장

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
    this.settings = [
      { name: "with-border", icon: "🖼️" },
      { name: "with-background", icon: "🎨" },
    ];
  }

  // Editor.js가 이 툴을 렌더링할 때 호출
  render() {
    const input = this.createInput("Paste image URL here...");
    input.value = this.data && this.data.url ? this.data.url : "";

    input.addEventListener("paste", (event: ClipboardEvent) => {
      this.renderImageView(event.clipboardData?.getData("text/plain") || "");
    });

    this.wrapper = this.createWrapper("image-wrapper");
    this.wrapper.appendChild(input);

    return this.wrapper;
  }

  // Editor.js가 이 툴의 설정을 렌더링할 때 호출
  renderSettings() {
    const settingsWrapper = this.createWrapper("settings-wrapper");

    this.settingButtons = this.settings.map((setting) =>
      this.createSettingButton(setting)
    );
    settingsWrapper.append(...this.settingButtons);

    return settingsWrapper;
  }

  // Editor.js가 이 툴의 데이터를 저장할 때 호출
  save(blockContent: HTMLDivElement) {
    const image = blockContent.querySelector("img");
    const caption = blockContent.querySelector("input");

    return {
      url: image?.src || "",
      caption: caption?.value || "",
    };
  }

  // Editor.js가 이 툴의 데이터를 불러올 때 호출하여 유효성 검증
  validate(savedData: BlockToolData) {
    if (!savedData.url.trim()) {
      return false;
    }
    return true;
  }

  // utility 함수 -----------------------------------------
  private renderImageView(url: string) {
    if (!this.wrapper) return;

    const image = this.createImage(url);
    const caption = this.createInput("Caption...");

    this.wrapper.replaceChildren(image, caption);
  }

  private toggleSetting(clickedButton: HTMLButtonElement) {
    if (!this.wrapper) return;

    if (clickedButton.dataset.state === "active") {
      clickedButton.dataset.state = "inactive";
      this.wrapper.dataset.setting = "";
      return;
    }

    this.settingButtons.forEach((button) => {
      button.dataset.state = "inactive";
    });

    clickedButton.dataset.state = "active";
    this.wrapper.dataset.setting = clickedButton.dataset.name || "";
  }

  // 컴포넌트 생성 함수 -----------------------------------------
  private createWrapper(className: string) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(className);

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

  private createSettingButton(setting: Setting) {
    const button = document.createElement("button");
    button.classList.add("setting-button");
    button.innerHTML = setting.icon;
    button.dataset.state = "inactive";
    button.dataset.name = setting.name;

    button.addEventListener("click", () => {
      this.toggleSetting(button);
    });

    return button;
  }
}

export default CustomImage;
