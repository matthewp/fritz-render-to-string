
export const basicDev = `
customElements.define('f-shadow', class extends HTMLElement {
  connectedCallback() {
    let p = this.parentNode, t = p.firstElementChild;
    this.remove(); t.remove();
    p.attachShadow({ mode: 'open' }).append(t.content.cloneNode(true));
  }
});`.trim();

export const stylesDev = `
customElements.define('f-shadow', class extends HTMLElement {
  connectedCallback() {
    let p = this.parentNode, t = p.firstElementChild;
    this.remove(); t.remove();
    let f = t.content.cloneNode(true);
    if(this.hasAttribute('styles'))
      for(let style of f.querySelectorAll('style[data-f]')) {
        let text = document.getElementById(style.dataset.f).content.firstChild.textContent;
        style.textContent = text;
        delete style.dataset.f;
      }

    p.attachShadow({ mode: 'open' }).append(f);
  }
});`.trim();

export const minified = ``;