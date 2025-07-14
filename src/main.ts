import { editor } from "./editor";

interface DOMElements {
  saveButton: HTMLButtonElement;
  output: HTMLElement;
}

class UIEventHandler {
  private elements: DOMElements;

  constructor(elements: DOMElements) {
    this.elements = elements;
  }

  private async handleSaveClick(): Promise<void> {
    const savedData = await editor.save();
    this.displayOutput(savedData);
  }

  private displayOutput(data: any): void {
    this.elements.output.innerHTML = JSON.stringify(data, null, 2);
  }

  registerEventListeners(): void {
    this.elements.saveButton.addEventListener("click", () => {
      this.handleSaveClick();
    });
  }
}

class DOMManager {
  static getRequiredElements(): DOMElements {
    const saveButton = document.getElementById(
      "save-button"
    ) as HTMLButtonElement;
    const output = document.getElementById("output") as HTMLElement;

    if (!saveButton || !output) {
      throw new Error("Required DOM elements not found");
    }

    return { saveButton, output };
  }
}

class Application {
  private uiEventHandler: UIEventHandler;
  private domElements: DOMElements;

  constructor() {
    this.domElements = DOMManager.getRequiredElements();
    this.uiEventHandler = new UIEventHandler(this.domElements);
  }

  async start(): Promise<void> {
    try {
      window.editor = editor;

      // UI 이벤트 리스너 등록
      this.uiEventHandler.registerEventListeners();
    } catch (error) {
      console.error("Failed to start application:", error);
    }
  }
}

const initializeApplication = async (): Promise<void> => {
  const app = new Application();
  await app.start();
};

// DOM 로드 완료 후 애플리케이션 시작
document.addEventListener("DOMContentLoaded", initializeApplication);
