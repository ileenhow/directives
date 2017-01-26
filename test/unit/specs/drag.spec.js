import Vue from 'vue'
import drag from 'directives/drag'

Vue.directive('drag', drag)

describe('drag', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    vm.$destroy()
  })

  it('should dispatch drag* event', done => {
    vm = new Vue({
      el,
      template: '<div v-drag @dragstart="onDragStart" @drag="onDrag" @dragend="onDragEnd"></div>',
      methods: {
        onDragStart () {
          count++
        },
        onDrag () {
          count++
        },
        onDragEnd () {
          assert(count === 2, '')
          done()
        }
      }
    })

    let count = 0

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: 1,
        pageY: 1
      }]
    })
    triggerTouchEvents(vm.$el, 'touchend')
  })

  it('should dispatch dragend event on touchcancel', done => {
    vm = new Vue({
      el,
      template: '<div v-drag @dragend="onDragEnd"></div>',
      methods: {
        onDragEnd () {
          done()
        }
      }
    })

    triggerTouchEvents(vm.$el, 'touchstart', e => {
      e.touches = [{
        pageX: 0,
        pageY: 0
      }]
    })
    triggerTouchEvents(vm.$el, 'touchmove', e => {
      e.touches = [{
        pageX: 1,
        pageY: 1
      }]
    })
    triggerTouchEvents(vm.$el, 'touchcancel')
  })

  describe('should handle dragging direction', () => {
    it('horizontal: vertical then horizontal', done => {
      vm = new Vue({
        el,
        template: '<div v-drag.horizontal @drag="onDrag"></div>',
        methods: {
          onDrag () {
            count++
          }
        }
      })

      setTimeout(() => {
        expect(count).to.equal(0)
        done()
      }, 500)

      let count = 0

      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      // shoud not trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 0,
          pageY: 1
        }]
      })
      // shoud not trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 1
        }]
      })
      triggerTouchEvents(vm.$el, 'touchend')
    })

    it('horizontal: horizontal then vertical', done => {
      vm = new Vue({
        el,
        template: '<div v-drag.horizontal @drag="onDrag"></div>',
        methods: {
          onDrag () {
            count++
          }
        }
      })

      setTimeout(() => {
        expect(count).to.equal(2)
        done()
      }, 500)

      let count = 0

      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      // shoud trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 0
        }]
      })
      // shoud trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 1
        }]
      })
      triggerTouchEvents(vm.$el, 'touchend')
    })

    it('vertical: horizontal then vertical', done => {
      vm = new Vue({
        el,
        template: '<div v-drag.vertical @drag="onDrag"></div>',
        methods: {
          onDrag () {
            count++
          }
        }
      })

      setTimeout(() => {
        expect(count).to.equal(0)
        done()
      }, 500)

      let count = 0

      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      // shoud not trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 0
        }]
      })
      // shoud not trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 1
        }]
      })
      triggerTouchEvents(vm.$el, 'touchend')
    })

    it('vertical: vertical then horizontal', done => {
      vm = new Vue({
        el,
        template: '<div v-drag.vertical @drag="onDrag"></div>',
        methods: {
          onDrag () {
            count++
          }
        }
      })

      setTimeout(() => {
        expect(count).to.equal(2)
        done()
      }, 500)

      let count = 0

      triggerTouchEvents(vm.$el, 'touchstart', e => {
        e.touches = [{
          pageX: 0,
          pageY: 0
        }]
      })
      // shoud trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 0,
          pageY: 1
        }]
      })
      // shoud trigger drag
      triggerTouchEvents(vm.$el, 'touchmove', e => {
        e.touches = [{
          pageX: 1,
          pageY: 1
        }]
      })
      triggerTouchEvents(vm.$el, 'touchend')
    })
  })
})
