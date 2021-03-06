/**
 * Directive for emitting custom event tapoutside
 * when tap event fired by other elements
 */
import createEvent from './_create-event'

export default {
  name: 'tapoutside',

  bind (el) {
    el.ownerDocument.addEventListener('tap', el._tapoutside_tap = e => {
      // if e.target exists in dom tree,
      // then judge whether it is contained by el
      if (el.ownerDocument.contains(e.target) && !el.contains(e.target)) {
        // canBubbleArg: false, make tapoutside event can't bubble
        el.dispatchEvent(createEvent('tapoutside', null, { originalEvent: e }))
      }
    })
  },

  unbind (el) {
    el.ownerDocument.removeEventListener('tap', el._tapoutside_tap)
  }
}
