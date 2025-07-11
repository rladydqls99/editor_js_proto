import type {
  API,
  BlockTool,
  BlockToolData,
  PasteEvent,
  FilePasteEvent,
  PatternPasteEvent,
} from "@editorjs/editorjs";

interface Tune {
  name: string;
  icon: string;
}

interface CustomImageInstance {
  data: BlockToolData;
  api: API;
}

// https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg

class CustomImage implements BlockTool {
  private data: BlockToolData;
  private api: API;
  private wrapper: HTMLElement | undefined;
  private TuneList: Tune[];

  // Editor.js 툴바에 표시될 아이콘과 제목을 정의
  static get toolbox() {
    return {
      title: "Image",
      icon: "⚒️",
    };
  }

  // 툴이 붙여넣기 이벤트를 수신할 수 있도록 설정
  static get pasteConfig() {
    return {
      files: {
        mimeTypes: ["image/*"],
        extensions: [".jpg", ".jpeg", ".png", ".gif"],
      },
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i,
      },
    };
  }

  // 최초에 생성될 때 호출
  constructor({ data, api }: CustomImageInstance) {
    this.data = data || { url: "" };
    this.api = api;
    this.TuneList = [
      { name: "with-border", icon: "🖼️" },
      { name: "with-background", icon: "🎨" },
      { name: "stretched", icon: "📏" },
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
    const tuneWrapper = this.createWrapper("tuneList-wrapper");

    const tuneButtonList = this.TuneList.map((tune) =>
      this.createTuneButton(tune)
    );
    tuneWrapper.append(...tuneButtonList);

    return tuneWrapper;
  }

  // Editor.js가 이 툴의 데이터를 저장할 때 호출
  save(blockContent: HTMLDivElement) {
    const image = blockContent.querySelector("img");
    const caption = blockContent.querySelector("input");

    return Object.assign(this.data, {
      url: image?.src || "",
      caption: caption?.value || "",
    });
  }

  // Editor.js가 이 툴의 데이터를 불러올 때 호출하여 유효성 검증
  validate(savedData: BlockToolData) {
    if (!savedData.url.trim()) {
      return false;
    }
    return true;
  }

  // 붙여넣기 이벤트
  onPaste(event: PasteEvent): void {
    if (event.type === "file") {
      const filePasteEvent = event as FilePasteEvent;
      const file = filePasteEvent.detail.file;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.renderImageView(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }

    if (event.type === "pattern") {
      const patternPasteEvent = event as PatternPasteEvent;
      const url = patternPasteEvent.detail.data;
      this.renderImageView(url);
    }
  }

  // utility 함수 -----------------------------------------
  private renderImageView(url: string) {
    if (!this.wrapper) return;

    const image = this.createImage(url);
    const caption = this.createInput("Caption...");

    this.wrapper.replaceChildren(image, caption);
    this.acceptTune();
  }

  private toggleTune(tune: Tune) {
    this.data[tune.name] = !this.data[tune.name];
    this.acceptTune();
  }

  private acceptTune() {
    this.TuneList.forEach((tune) => {
      this.wrapper?.classList.toggle(tune.name, !!this.data[tune.name]);

      if (tune.name === "stretched") {
        this.api.blocks.stretchBlock(
          this.api.blocks.getCurrentBlockIndex(),
          !!this.data.stretched
        );
      }
    });
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

  private createTuneButton(tune: Tune) {
    const button = document.createElement("button");
    button.classList.add("tune-button");
    button.innerHTML = tune.icon;

    button.addEventListener("click", () => {
      this.toggleTune(tune);
      button.classList.toggle("tune-button-active");
    });

    return button;
  }
}

export default CustomImage;
