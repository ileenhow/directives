export default (name, bubbles, mixins = {}) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(name, bubbles, true)
  return Object.assign(e, mixins)
}
