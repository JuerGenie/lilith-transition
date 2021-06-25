/// <reference types="svelte" />

declare namespace lilith {
  let template: {
    transition: HTMLElement;
  };
}

declare module "*.html" {
  const content: string;
  export default content;
}
