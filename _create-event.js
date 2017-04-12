 export default (name, options, mixins) => {  
  let event  
  try {  
    // Not supported in some versions of Android's old WebKit-based WebView  
    // use document.createEvent() instead  
    event = new Event(name, options)  
  } catch (e) {  
    if (!options) {  
      options = {}  
    }  
    event = document.createEvent('CustomEvent')  
    event.initCustomEvent(name, !!options.bubbles, !!options.cancelable)  
  }  
  return Object.assign(event, mixins)  
} 
