/**
 * Simple directive for mocking tap event
 */
import createEvent from './_create-event'

export default {
  name: 'tap',
  bind (el, { value, modifiers }) {
    const threshold = window.innerWidth / 10
    let startPoint
    el.addEventListener('touchstart', el._tap_touchstart = e => {
      startPoint = null
      if (e.touches && e.touches.length === 1) {
        // fix e.touches bug in iOS 8.1.3
        startPoint = {
          pageX: e.touches[0].pageX,
          pageY: e.touches[0].pageY
        }
        el.addEventListener('touchmove', el._tap_touchmove = e => {
          if (startPoint) {
            if (Math.sqrt(Math.pow(e.touches[0].pageX - startPoint.pageX, 2) + Math.pow(e.touches[0].pageY - startPoint.pageY, 2)) > threshold) {
              startPoint = null
            }
          }
        })
        el.addEventListener('touchend', el._tap_touchend = e => {
          el.removeEventListener('touchmove', el._tap_touchmove)
          el.removeEventListener('touchend', el._tap_touchend)
          if (startPoint) {
            startPoint = null
            if (modifiers.prevent) {
              e.preventDefault()
            }
            if (modifiers.stop) {
              e.stopPropagation()
            }
            // dispatch a tap event
            const tapEvent = createEvent('tap', !modifiers.capture, { originalEvent: e })
            if (modifiers.delay) {
              // useful for hiding el after tap that has a link inside
              // see: components/navibar.vue
              setTimeout(() => {
                el.dispatchEvent(tapEvent)
              }, value || 300)
            } else {
              el.dispatchEvent(tapEvent)
            }
          }
        })
      }
    })
  },
  unbind (el) {
    el.removeEventListener('touchstart', el._tap_touchstart)
    el.removeEventListener('touchmove', el._tap_touchmove)
    el.removeEventListener('touchend', el._tap_touchend)
  }
}
