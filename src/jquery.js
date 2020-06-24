window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements
  if (typeof selectorOrArrayOrTemplate === 'string') {
    if (selectorOrArrayOrTemplate[0] === '<') {
      elements = [createElement(selectorOrArrayOrTemplate)]
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate)
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate
  }

  function createElement(template) {
    const container = document.createElement('template')
    container.innerHTML = template.trim()
    return container.content.firstChild
  }

  const api = Object.create(jQuery.prototype)
  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi
  })

  return api
}

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jQuery: true,
  get(index) {
    return this.elements[index]
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each(el => node.appendChild(el))
    } else if (node.jQuery === true) {
      this.each(el => node.get(0).appendChild(el))
    }
  },
  append(children) {
    if (children instanceof Element) {
      console.log('element')
      this.get(0).appendChild(children)
    } else if (children instanceof HTMLCollection) {
      console.log('html')
      for (let i = 0; i < children; i++) {
        this.get(0).appendChild(children[i])
      }
    } else if (children.jQuery === true) {
      console.log('jQuery')
      children.each(node => this.get(0).appendChild(node))
    }
  },
  find(selector) {
    let array = []
    for (let i = 0; i < this.elements.length; i++) {
      const elements2 = Array.from(this.elements[i].querySelectorAll(selector))
      array = array.concat(elements2)
    }
    array.oldApi = this
    return jQuery(array)
  },
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className)
    }
    return this
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i)
    }
    return this
  },
  parent() {
    const array = []
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode)
      }
    })
    return jQuery(array)
  },
  children() {
    const array = []
    this.each((node) => {
      array.push(...node.children)
    })
    return jQuery(array)
  },
  siblings() {
    const array = []
    this.each((node) => {
      array.push(...Array.from(node.parentNode.children).filter(n => n !== node))
    })
    return jQuery(array)
  },
  print() {
    console.log(this.elements)
  },
  end() {
    return this.oldApi
  }
}
