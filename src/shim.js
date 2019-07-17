
export const basicDev = `
customElements.define('f-shadow', class extends HTMLElement {
  connectedCallback() {
    let p = this.parentNode, t = p.firstElementChild;
    this.remove(); t.remove();
    p.attachShadow({ mode: 'open' }).append(t.content.cloneNode(true));
  }
});`.trim();

export const basicMinified = `customElements.define(f-shadow,class extends HTMLElement{connectedCallback(){let a=this.parentNode,b=a.firstElementChild;this.remove(),b.remove(),a.attachShadow({mode:open}).append(b.content.cloneNode(!0))}});`;

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

export const stylesMinified = `customElements.define(f-shadow,class extends HTMLElement{connectedCallback(){let a=this.parentNode,b=a.firstElementChild;this.remove(),b.remove();let c=b.content.cloneNode(!0);if(this.hasAttribute(styles))for(let a of c.querySelectorAll(a[data-c])){let b=document.getElementById(a.dataset.f).content.firstChild.textContent;a.textContent=b,delete a.dataset.f}a.attachShadow({mode:open}).append(c)}});`;
