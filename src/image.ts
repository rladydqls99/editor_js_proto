class Image {
  static get toolbox() {
    return {
      title: "Image",
      icon: "⚒️",
    };
  }
  render() {
    return document.createElement("input");
  }

  save(blockContent: HTMLInputElement) {
    return {
      url: blockContent.value,
    };
  }
}

export default Image;
