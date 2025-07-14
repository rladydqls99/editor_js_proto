import type {
  BlockTool,
  BlockToolData,
  PasteEvent,
  FilePasteEvent,
  PatternPasteEvent,
  ToolConfig,
  BlockAPI,
} from "@editorjs/editorjs";

interface Tune {
  name: string;
  icon: string;
}

interface CustomImageInstance {
  data?: BlockToolData;
  block: BlockAPI;
  config?: ToolConfig;
}

// https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg

class CustomImage implements BlockTool {
  private _data: BlockToolData;
  private _block: BlockAPI;
  private _config: ToolConfig;
  private _wrapper: HTMLElement | undefined;
  private _TuneList: Tune[] = [
    { name: "with-border", icon: "🖼️" },
    { name: "with-background", icon: "🎨" },
    { name: "stretched", icon: "📏" },
  ];

  // Editor.js 툴바에 표시될 아이콘과 제목을 정의
  // static get toolbox() {
  //   return {
  //     title: "Image",
  //     icon: "⚒️",
  //   };
  // }

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
  constructor({ data, block, config }: CustomImageInstance) {
    this._data = data || { url: "" };
    this._block = block;
    this._config = config || {};
  }

  // Editor.js가 이 툴을 렌더링할 때 호출
  render() {
    const input = this._createElement<HTMLInputElement>(
      "input",
      "image-input",
      {
        placeholder: this._config.placeholder || "...",
        value: this._data?.url || "",
      }
    );

    input.addEventListener("paste", (event: ClipboardEvent) => {
      this._renderImageView(event.clipboardData?.getData("text/plain") || "");
    });

    this._wrapper = this._createElement("div", "image-wrapper");
    this._wrapper.appendChild(input);

    return this._wrapper;
  }

  // Editor.js가 이 툴의 설정을 렌더링할 때 호출
  renderSettings() {
    const tuneWrapper = this._createElement("div", "tuneList-wrapper");

    const tuneButtonList = this._TuneList.map((tune) =>
      this._createTuneButton(tune)
    );
    tuneWrapper.append(...tuneButtonList);

    return tuneWrapper;
  }

  // Editor.js가 이 툴의 데이터를 저장할 때 호출
  save(blockContent: HTMLDivElement) {
    const image = blockContent.querySelector("img");
    const caption = blockContent.querySelector("input");

    return Object.assign(this._data, {
      url: image?.src || "",
      caption: caption?.value || "",
    });
  }

  // Editor.js가 이 툴의 데이터를 불러올 때 호출하여 유효성 검증
  validate(savedData: BlockToolData) {
    console.log("validate", savedData);
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
        this._renderImageView(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }

    if (event.type === "pattern") {
      const patternPasteEvent = event as PatternPasteEvent;
      const url = patternPasteEvent.detail.data;
      this._renderImageView(url);
    }
  }

  // utility 함수 -----------------------------------------
  private _renderImageView(url: string) {
    if (!this._wrapper) return;

    const image = this._createElement("img", null, {
      src: url,
      alt: "Image",
    });
    const caption = this._createElement<HTMLInputElement>("input", null, {
      placeholder: "Caption...",
    });

    this._wrapper.replaceChildren(image, caption);
    this._acceptTune();
  }

  private _toggleTune(tune: Tune) {
    this._data[tune.name] = !this._data[tune.name];
    this._acceptTune();
  }

  private _acceptTune() {
    this._TuneList.forEach((tune) => {
      this._wrapper?.classList.toggle(tune.name, !!this._data[tune.name]);

      if (tune.name === "stretched" && this._block) {
        this._block.stretched = !!this._data[tune.name];
      }
    });
  }

  // 컴포넌트 생성 함수 -----------------------------------------
  private _createElement<T extends HTMLElement = HTMLElement>(
    tag: string,
    classNames?: string | string[] | null,
    attributes?: Record<string, string>
  ): T {
    const element = document.createElement(tag) as T;

    if (Array.isArray(classNames)) {
      element.classList.add(...classNames);
    } else if (classNames) {
      element.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (attrName === "innerHTML") {
        element.innerHTML = attributes[attrName];
      } else {
        element.setAttribute(attrName, attributes[attrName]);
      }
    }

    return element;
  }
  private _createTuneButton(tune: Tune) {
    const button = this._createElement("button", "tune-button", {
      innerHTML: tune.icon,
    });

    button.addEventListener("click", () => {
      this._toggleTune(tune);
      button.classList.toggle("tune-button-active");
    });

    return button;
  }
}

export default CustomImage;
