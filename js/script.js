class Atoyomi {

  constructor () {
    this.bind()
    this.i18n()
    this.createList()
    this.createTweetButton()
  }

  bind () {
    document.getElementById('save').addEventListener('click', (events) => {
      events.preventDefault()

      this.savePage()
    })
  }

  savePage () {
    chrome.tabs.getSelected(null, (tab) => {
      const data = {
        title: tab.title,
        url: tab.url
      }

      this.setStorageData(data)
    })
  }

  setStorageData (data) {
    const schema = {
      id: this.uniqueId(),
      title: data.title,
      url: data.url,
      date: this.getCurrentTime()
    }

    let values = this.getStorageData()

    if (values !== null) {
      values.unshift(schema)
    } else {
      values = []
      values.push(schema)
    }

    localStorage.setItem('data', JSON.stringify(values))

    this.createList({
      refresh: true
    })
  }

  getStorageData () {
    return JSON.parse(localStorage.getItem('data'))
  }

  deleteStorageData (id) {
    let values = this.getStorageData()

    for (let i = 0; i < values.length; i++) {
      if (values[i].id === id) {
        values.splice(i, 1)
      }
    }

    localStorage.setItem('data', JSON.stringify(values))

    this.createList({
      refresh: true
    })
  }

  createList (option = false) {
    const $list = document.getElementById('list')
    const items = this.getStorageData()
    let badgeText = 0

    if (option && option.refresh) {
      $list.innerHTML = ''
    }

    if (items !== null && items.length > 0) {
      badgeText = items.length

      for (let key in items) {
        const listItem = document.createElement('li')

        listItem.innerHTML = `<a href="${items[key].url}" data-id="${items[key].id}">
          <time><i class="fa fa-clock-o"></i>${items[key].date}</time>
          ${items[key].title}
        </a>`
        listItem.addEventListener('click', (events) => {
          this.openNewTab(events)
        })

        $list.appendChild(listItem)
      }
    } else {
      $list.insertAdjacentHTML('beforeend', `<li class="is-empty">${chrome.i18n.getMessage('extEmptyListText')}</li>`)
    }

    this.setCounterBadge(badgeText)
  }

  setCounterBadge (badgeText) {
    chrome.browserAction.setBadgeText({
      text: badgeText > 0 ? String(badgeText) : ''
    })
  }

  createTweetButton () {
    chrome.tabs.getSelected(null, (tab) => {
      document.getElementById('tweet').setAttribute('href', `https://twitter.com/intent/tweet?url=${encodeURIComponent(tab.url)}&text=${chrome.i18n.getMessage('extDefaultTitle')}+%2F+${encodeURIComponent(tab.title)}`)
    })
  }

  openNewTab (events) {
    events.preventDefault()

    const id = events.currentTarget.children[0].dataset.id
    const url = events.currentTarget.children[0].getAttribute('href')

    window.open(url)

    this.deleteStorageData(id)
  }

  i18n () {
    document.getElementById('i18n-tweet').innerText = chrome.i18n.getMessage('extTweetButtonText')
    document.getElementById('i18n-save').innerText = chrome.i18n.getMessage('extSaveButtonText')
  }

  uniqueId () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  getCurrentTime () {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()

    return `${year}/${month}/${day}`
  }
}

const atoyomi = new Atoyomi()