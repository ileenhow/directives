import Vue from 'vue'
import tap from 'directives/tap'
import tapoutside from 'directives/tapoutside'

Vue.directive('tap', tap)
Vue.directive('tapoutside', tapoutside)

describe('tapoutside', () => {
  let el
  let vm

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    vm.$destroy()
  })

  it('should handle tap outside', done => {
    vm = new Vue({
      el,
      template: '<div><div v-tapoutside @tapoutside="onTapOutside" v-tap @tap="onTap"></div></div>',
      methods: {
        onTap () {
          assert(false, 'should NOT be called')
        },
        onTapOutside () {
          assert(true, '')
          done()
        }
      }
    })

    triggerHTMLEvents(vm.$el, 'tap')
  })
})
