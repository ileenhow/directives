export default (name, bubbles, mixins = {}) => {
  const tapEvent = document.createEvent('HTMLEvents')
  tapEvent.initEvent(name, bubbles, true)
  return Object.assign(tapEvent, mixins)
}
