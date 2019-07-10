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
});