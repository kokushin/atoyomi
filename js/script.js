class Atoyomi {

  constructor () {
    // DOM要素をキャッシュ
    this.elements = {
      saveButton: document.getElementById('save'),
      tweetButton: document.getElementById('tweet'),
      list: document.getElementById('list'),
      tweetText: document.getElementById('i18n-tweet'),
      saveText: document.getElementById('i18n-save')
    }
    
    this.bind()
    this.i18n()
    this.createList()
    this.createTweetButton()
  }

  bind () {
    this.elements.saveButton.addEventListener('click', (event) => {
      event.preventDefault()
      this.savePage()
    })
  }

  async savePage () {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const data = {
        title: tab.title,
        url: tab.url
      }

      this.setStorageData(data)
    } catch (error) {
      console.error('Error saving page:', error)
    }
  }

  setStorageData (data) {
    try {
      const schema = {
        id: this.uniqueId(),
        title: data.title || 'Untitled',
        url: data.url,
        date: this.getCurrentTime()
      }

      const values = this.getStorageData() || []
      values.unshift(schema)

      localStorage.setItem('data', JSON.stringify(values))

      this.createList({
        refresh: true
      })
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  getStorageData () {
    try {
      const data = localStorage.getItem('data')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error parsing storage data:', error)
      return null
    }
  }

  deleteStorageData (id) {
    try {
      const values = this.getStorageData()
      
      if (!values) return
      
      const filteredValues = values.filter(item => item.id !== id)
      
      localStorage.setItem('data', JSON.stringify(filteredValues))

      this.createList({
        refresh: true
      })
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  createList (option = false) {
    const items = this.getStorageData()
    let badgeText = 0

    if (option && option.refresh) {
      this.elements.list.innerHTML = ''
    }

    if (items && items.length > 0) {
      badgeText = items.length
      
      // DocumentFragmentを使用してDOM操作を最適化
      const fragment = document.createDocumentFragment()
      
      items.forEach((item) => {
        const listItem = this.createListItem(item)
        fragment.appendChild(listItem)
      })
      
      this.elements.list.appendChild(fragment)
    } else {
      this.elements.list.insertAdjacentHTML('beforeend', `<li class="is-empty">${chrome.i18n.getMessage('extEmptyListText')}</li>`)
    }

    this.setCounterBadge(badgeText)
  }

  createListItem(item) {
    const listItem = document.createElement('li')
    const link = document.createElement('a')
    const time = document.createElement('time')
    const clockIcon = document.createElement('i')
    
    // 属性設定
    link.href = item.url
    link.dataset.id = item.id
    clockIcon.className = 'fa-regular fa-clock'
    
    // テキスト設定
    time.appendChild(clockIcon)
    time.appendChild(document.createTextNode(item.date))
    link.appendChild(time)
    link.appendChild(document.createTextNode(item.title))
    
    // イベントリスナー追加
    link.addEventListener('click', (event) => {
      this.openNewTab(event)
    })
    
    listItem.appendChild(link)
    return listItem
  }

  setCounterBadge (badgeText) {
    try {
      chrome.action.setBadgeText({
        text: badgeText > 0 ? String(badgeText) : ''
      })
    } catch (error) {
      console.error('Error setting badge:', error)
    }
  }

  async createTweetButton () {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const tweetUrl = this.buildTweetUrl(tab.url, tab.title)
      this.elements.tweetButton.href = tweetUrl
    } catch (error) {
      console.error('Error creating tweet button:', error)
    }
  }

  buildTweetUrl(url, title) {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const message = chrome.i18n.getMessage('extDefaultTitle')
    return `https://x.com/intent/tweet?url=${encodedUrl}&text=${message}+%2F+${encodedTitle}`
  }

  openNewTab (event) {
    event.preventDefault()

    const link = event.currentTarget
    const id = link.dataset.id
    const url = link.href

    if (url && id) {
      window.open(url)
      this.deleteStorageData(id)
    }
  }

  i18n () {
    this.elements.tweetText.textContent = chrome.i18n.getMessage('extTweetButtonText')
    this.elements.saveText.textContent = chrome.i18n.getMessage('extSaveButtonText')
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