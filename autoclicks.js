/**
 * Automatic clicks on defined elements.
 *
 * @see https://github.com/Mykola10987/AutoClicks
 *
 * @param {Element} attr.el - elements for which clicks are made.
 * @param {string} attr.e:
 *    "loaded" - clicks after the entire document is loaded;
 *    "click" - clicks after clicking on an element;
 *    "hover" - clicks after hover an element. counting of clicks starts from the beginning at the next hover.
 *    "hovering" - clicks after hover an element. the click count is not canceled on the next hover.
 * @param {number} 1 || attr.count - number of clicks.
 * @param {boolean} false || attr.loop - clicks from beginning to end.
 * @param {number} 0 || attr.delay - delay before clicking.
 * @param {number} 0 || attr.interval - delay before next click.
 * @param {function} false || attr.action - execute the function after each click
 * @param {function} false || attr.callback - execute the function after the clicks are finished.
 */

class AutoClicks {
  constructor(attr) {
    if (typeof attr != 'object' || !Object.keys(attr).length) return

    if ('ontouchstart' in document.documentElement && (attr?.e == 'hovering' || attr?.e == 'hover')) return

    this.el = []

    this.create(attr)
  }

  create(attr) {
    if (attr.el instanceof NodeList) this.attr_el = Array.from(attr.el)
    else if (attr.el instanceof Element) this.attr_el = [attr.el]
    else {
      console.error('Need to use the element... Refer to the AutoClicks documentation.')

      return false
    }

    for (let el of this.attr_el) {
      this.el.push(new AutoClicksElement(el, attr))
    }
  }

  get(el) {
    if (!el) return this.el

    if (!(el instanceof NodeList) || !(el instanceof Element)) return

    el = el instanceof Element ? [el] : Array.from(el)

    return this.el.filter(element => el.includes(element))
  }

  stop(el) {
    let stop = this.get(el)

    stop.forEach(element => {
      element.stop = true
    })
  }
}

class AutoClicksElement {
  constructor(el, attr) {
    this.el = el

    this.e = ['loaded', 'click', 'hover', 'hovering']

    this._count = this.count = typeof attr?.count == 'number' ? attr.count : 1

    this.loop = typeof attr?.loop == 'boolean' ? attr.loop : false

    this.delay = typeof attr?.delay == 'number' ? attr.delay : 0

    this.interval = typeof attr?.interval == 'number' ? attr.interval : 0

    this.action = typeof attr?.action == 'function' ? attr.action : false

    this.callback = typeof attr?.callback == 'function' ? attr.callback : false

    this.stop = false

    if (typeof attr?.e == 'string' && this.e.includes(attr.e)) {
      this.e = attr.e

      this.init(this.e)
    } else {
      console.error('Need to define event... Refer to the AutoClicks documentation.')

      return
    }
  }

  init(e = this.e) {
    this.events = {
      hover: () => {
        const add = () => {
          this.el.addEventListener(
            'mouseover',
            async () => {
              await this.execute()

              add()
            },
            { once: true }
          )
        }

        add()
      },

      hovering: () => {
        this.events.hover()
      },

      click: () => {
        this.el.addEventListener('click', async e => {
          if (e.isTrusted && !this.executing) {
            this.execute()
          }
        })
      },

      loaded: () => {
        document.addEventListener('DOMContentLoaded', async () => {
          this.execute()
        })
      }
    }

    this.events?.[e]()
  }

  async execute() {
    if (!this.permission()) return

    await this.wait(this.delay)

    let ready = await this.clicks()

    if (ready && this.callback) this.callback()

    if (ready && this.loop) this.count = this._count
  }

  async clicks() {
    this.executing = true

    for (this.count; this.count > 0; this.count--) {
      if (!this.permission()) break

      await this.wait(this.interval)

      this.el.click()

      if (this.action) this.action()
    }

    this.executing = false

    if (this.count == 0) return Promise.resolve(true)
  }

  permission() {
    if (this.stop) return false

    if (this.e == 'hovering' && !this.el.matches(':hover')) return false

    return true
  }

  wait(ms) {
    return new Promise(res => {
      setTimeout(res, ms)
    })
  }
}
