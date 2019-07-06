
export const dev = `
customElements.define('f-shadow', class extends HTMLElement {
  connectedCallback() {
    let p = this.parentNode, t = p.firstElementChild;
    this.remove();
    p.attachShadow({ mode: 'open' }).append(t.content.cloneNode(true));
  }
});`.trim();

export const minified = ``;