/**
 * WIP
 * Simple directive for sorting objects with dragging
 */
import createEvent from '../_create-event'

export default {
  name: 'sort',
  bind (el, { value }) {
    if (value === false) {
      return
    }
    let dragging
    let pageY
    let target
    let dummy
    let swap
    el.addEventListener('dragstart', el._sort_dragstart = e => {
      if (e.defaultPrevented) {
        return
      }

      dragging = true
      swap = null
      pageY = e.originalEvent.pageY
      target = e.target
      dummy = cloneNode(target)

      // 按需绑定
      el.addEventListener('drag', el._sort_drag = ({ originalEvent: e }) => {
        if (dragging) {
          if (!dummy) {
            dummy = cloneNode(target)
          }
          dummy.style.marginTop = e.pageY - pageY + 'px'
          const hit = hitTest(el.children, dummy)
          if (hit.target && hit.target !== target) {
            if (hit.position === 1) {
              target.before(hit.target)
            } else if (hit.position === -1) {
              target.after(hit.target)
            }
            swap = hit
          }
        }
      })

      // 按需绑定
      el.addEventListener('dragend', el._sort_dragend = ({ originalEvent: e }) => {
        el.removeEventListener('drag', el._sort_drag)
        el.removeEventListener('dragend', el._sort_dragend)
        if (dragging) {
          if (swap && swap.target) {
            el.dispatchEvent(createEvent('swap', true, { from: target, to: swap.target, position: swap.position }))
          }
          dragging = false
          swap = null
          dummy.remove()
        }
      })
    })
  },
  unbind (el) {
    el.removeEventListener('dragstart', el._sort_dragstart)
    el.removeEventListener('drag', el._sort_drag)
    el.removeEventListener('dragend', el._sort_dragend)
  }
}

function cloneNode (node) {
  const dummy = node.cloneNode()
  const rect = node.getBoundingClientRect()
  document.body.appendChild(dummy)
  dummy.style.position = 'absolute'
  dummy.style.zIndex = 1
  dummy.style.left = rect.left + 'px'
  dummy.style.top = rect.top + 'px'
  dummy.style.width = rect.width + 'px'
  dummy.style.height = rect.height + 'px'
  dummy.style.boxSizing = 'border-box'
  dummy.style.border = '1px solid rgba(0, 0, 255, 0.5)'
  dummy.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'
  dummy.style.cursor = 'default'
  dummy.style.userSelect = 'none'
  return dummy
}

function hitTest (targets = [], dummy) {
  const dummyRect = dummy.getBoundingClientRect()
  const hit = {}
  Array.prototype.slice.call(targets).some(target => {
    const position = comparePosition(dummyRect, target.getBoundingClientRect())
    if (position !== 0) {
      hit.target = target
      hit.position = position
      return true
    }
    return false
  })
  return hit
}

function comparePosition (rect1, rect2) {
  if (rect1.top < rect2.top && rect1.top + rect1.height / 2 > rect2.top) {
    return 1
  }
  if (rect2.top < rect1.top && rect2.top + rect2.height / 2 > rect1.top) {
    return -1
  }
  return 0
}
