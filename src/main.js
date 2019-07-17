import fritz from 'fritz';
import * as shims from './shim.js';

const OPEN = 1;
const CLOSE = 2;
const TEXT = 4;

const banned = new Set(['__self', '__source']);

const encodeEntities = s => String(s)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const voids = new Set([
  'area','base','br','col',
  'embed','hr','img','input',
  'link','meta','param',
  'source','track','wbr'
]);

function* render(vnode) {
  let position = 0, len = vnode.length, inStyle = false, needsHoisting = false;
  while(position < len) {
    let instr = vnode[position];
    let command = instr[0];

    switch(command) {
      case OPEN: {
        let tagName = instr[1];
        let Component = fritz._tags.get(tagName);
        let props = Component ? {} : null;
        let pushProps = props ? (name, value) => props[name] = value : Function.prototype;

        if(tagName === 'style') {
          inStyle = true;
          break;
        }

        yield '<' + tagName;
        let attrs = instr[3];
        let i = 0, attrLen = attrs ? attrs.length : 0;
        let sentFirstSpace = false;
        while(i < attrLen) {
          let attrName = attrs[i];
 
          // Prevent pushing dev hyperscript props
          if(!banned.has(attrName)) {
            if(!sentFirstSpace) {
              yield ' ';
              sentFirstSpace = true;
            }

            let attrValue = attrs[i + 1];
            pushProps(attrName, attrValue);
            yield attrName + '="' + encodeEntities(attrValue) + '"';
          }

          i += 2;
        }
        yield '>';

        
        if(Component) {
          yield '<template>';
          let instance = new Component();
          let includeStyleUpgrade = yield* render(instance.render(props, {}));
          yield `</template><f-shadow${includeStyleUpgrade ? ' styles' : ''}></f-shadow>`;
        }

        break;
      }
      case CLOSE: {
        if(inStyle) {
          inStyle = false;
          break;
        }

        let tagName = instr[1];
        if(!voids.has(tagName)) {
          yield '</' + instr[1] + '>';
        }
        break;
      }
      case TEXT: {
        let text = instr[1];
        let encoded = encodeEntities(text);
        if(inStyle) {
          needsHoisting = true;
          yield [0, text];
          break;
        }

        yield encoded;
        break;
      }
    }

    position++;
  }

  return needsHoisting;
}

function renderToString(vnode, { dev = false } = {}) {
  let styles = new Map();
  let styleParts = [];
  let parts = [];
  for(let part of render(vnode)) {
    if(Array.isArray(part)) {
      let string = part[1];
      let data = styles.get(string);
      if(!data) {
        data = [0,[]];
        styles.set(string, data);
      }
      data[0]++;
      data[1].push(parts.length);
      parts.push('');
    } else {
      parts.push(part);
    }
  }

  let shimStyles = dev ? shims.stylesDev : shims.stylesMinified;
  let shim = dev ? shims.basicDev : shims.basicMinified;

  for(let [text, [count, indices]] of styles) {
    if(count > 1) {
      shim = shimStyles;
      let id = `style-${styleParts.length + 1}`;
      styleParts.push(`<template id="${id}"><style>${text}</style></template>`);

      for(let index of indices) {
        parts[index] = `<style data-f="${id}"></style>`;
      }
    } else {
      parts[indices[0]] = text;
    }
  }

  let body = styleParts.join('') + parts.join('');

  return {
    shim,
    body
  };
}

export {
  render,
  renderToString
};
