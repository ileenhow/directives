/**
 * Simple directive for dragging events
 */
import createEvent from './_create-event'

export default {
  name: 'drag',

  bind (el, { value, modifiers }) {
    let startPoint = null
    let direction

    el.addEventListener('touchstart', el._drag_touchstart = e => {
      // 仅允许单点触摸
      if (e.touches && e.touches.length === 1) {
        startPoint = {
          pageX: e.touches[0].pageX,
          pageY: e.touches[0].pageY
        }
      } else {
        startPoint = null
        return
      }

      const dragStart = createEvent('dragstart', null, { originalEvent: e })
      el.dispatchEvent(dragStart)

      if (dragStart.defaultPrevented) {
        return
      }

      const doc = el.ownerDocument

      // 移动
      doc.addEventListener('touchmove', el._drag_touchmove = e => {
        if (!startPoint) {
          return
        }

        // set drag direction's value after touchstart
        // and never change it until touchend
        if (!direction) {
          direction = isHorizontal(e.touches[0], startPoint) ? 'horizontal' : 'vertical'
        }

        const { horizontal, vertical } = modifiers

        // don't dispatch drag event when modifiers don't match drag direction
        if ((horizontal && !vertical && direction === 'vertical') ||
            (vertical && !horizontal && direction === 'horizontal')) {
          return
        }

        el.dispatchEvent(createEvent('drag', null, { originalEvent: e }))
      })

      // 完成
      doc.addEventListener('touchend', el._drag_touchend = e => {
        doc.removeEventListener('touchmove', el._drag_touchmove)
        doc.removeEventListener('touchcancel', el._drag_touchcancel)
        doc.removeEventListener('touchend', el._drag_touchend)

        if (direction) {
          direction = null
        }

        if (startPoint) {
          startPoint = null
          el.dispatchEvent(createEvent('dragend', null, { originalEvent: e }))
        }
      })

      // 取消
      doc.addEventListener('touchcancel', el._drag_touchend)
    })
  },

  unbind (el) {
    el.removeEventListener('touchstart', el._drag_touchstart)
    const doc = el.ownerDocument
    doc.removeEventListener('touchmove', el._drag_touchmove)
    doc.removeEventListener('touchcancel', el._drag_touchend)
    doc.removeEventListener('touchend', el._drag_touchend)
  }
}

function isHorizontal (to, from) {
  return Math.abs(to.pageX - from.pageX) > Math.abs(to.pageY - from.pageY)
}
