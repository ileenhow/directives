/**
 * Simple directive for dragging events
 */
import createEvent from '../_create-event'

export default {
  name: 'drag',
  bind (el, { value, modifiers }) {
    let startPoint = null
    let direction
    el.addEventListener('mousedown', el._drag_mousedown = e => {
      startPoint = {
        pageX: e.pageX,
        pageY: e.pageY
      }

      const dragStart = createEvent('dragstart', true, { originalEvent: e })
      el.dispatchEvent(dragStart)

      if (dragStart.defaultPrevented) {
        return
      }

      const doc = el.ownerDocument
      // 绑定到 document
      doc.addEventListener('mousemove', el._drag_mousemove = e => {
        if (!startPoint) {
          return
        }

        // set drag direction's value after mousedown
        // and never change it until touchend
        if (!direction) {
          direction = isHorizontal(e, startPoint) ? 'horizontal' : 'vertical'
        }

        // don't dispatch drag event when modifiers don't match drag direction
        if ((modifiers.horizontal && !modifiers.vertical && direction === 'vertical') ||
            (modifiers.vertical && !modifiers.horizontal && direction === 'horizontal')) {
          return
        }
        el.dispatchEvent(createEvent('drag', true, { originalEvent: e }))
      })
      // 绑定到 document
      doc.addEventListener('mouseup', el._drag_mouseup = e => {
        doc.removeEventListener('mousemove', el._drag_mousemove)
        doc.removeEventListener('mouseup', el._drag_mouseup)
        if (direction) {
          direction = null
        }
        if (startPoint) {
          startPoint = null
          el.dispatchEvent(createEvent('dragend', true, { originalEvent: e }))
        }
      })
    })
  },
  unbind (el) {
    el.removeEventListener('mousedown', el._drag_mousedown)
    const doc = el.ownerDocument
    doc.removeEventListener('mousemove', el._drag_mousemove)
    doc.removeEventListener('mouseup', el._drag_mouseup)
  }
}

function isHorizontal (to, from) {
  return Math.abs(to.pageX - from.pageX) > Math.abs(to.pageY - from.pageY)
}
