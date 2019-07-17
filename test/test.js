const assert = require('assert');
const { renderToString } = require('../render-to-string.js');
const { fritz, Component, h } = require('fritz');

describe('renderToString', () => {
  it('Ignores event handlers', () => {
    let expected = '<on-click><template><a href="#"></a></template><f-shadow></f-shadow></on-click>';

    class Event extends Component {
      render() {
        return h('a', { onClick: () => {}, href: '#' });
      }
    }

    fritz.define('on-click', Event);
    let { body } = renderToString(h('on-click'));
    assert.equal(body, expected);
  });

  it('Doesn\'t render __self and __source attrs from sucrase', () => {
    let expected = '<div class="foo"></div>';
    let vdom = h('div', { class: 'foo', __self: 'info', __source: 'info' });
    let { body } = renderToString(vdom);
    assert.equal(body, expected);
  });

  it('Elements with no attributes should not have a space before the >', () => {
    let expected = '<div></div>';
    let vdom = h('div', { __source: '' }, []);
    let { body } = renderToString(vdom);
    assert.equal(body, expected);
  });

  it('Self-closing tags work', () => {
    let expected = '<div><br><input type="text"></div>';
    let vdom = h('div', null, [h('br'), h('input', {type: 'text'})]);
    let { body } = renderToString(vdom);
    assert.equal(body, expected);
  });

  it('Hoists duplicate style tags', () => {
    let expected = '<template id="style-1"><style>body{color:blue;}</style></template><div><style data-f="style-1"></style><style data-f="style-1"></style></div>';
    let vdom = h('div', null, [h('style', null, 'body{color:blue;}'), h('style', null, 'body{color:blue;}')]);
    let { body } = renderToString(vdom);
    assert.equal(body, expected);
  });
});