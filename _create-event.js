export default (name, options, mixins) => {
  return Object.assign(new Event(name, options), mixins)
}
