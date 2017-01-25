/**
 * Directive for emitting custom event tapoutside
 * when tap event fired by other elements
 */
import createEvent from './_create-event'

export default {
  name: 'tapoutside',

  bind (el) {
    el.ownerDocument.addEventListener('tap', el._tapoutside_tap = e => {
      if (!el.contains(e.target)) {
        el.dispatchEvent(createEvent('tapoutside', { originalEvent: e }))
      }
    })
  },

  unbind (el) {
    el.ownerDocument.removeEventListener('tap', el._tapoutside_tap)
  }
}
