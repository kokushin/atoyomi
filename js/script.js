'use strict'

window.onload = () => {
  createList()
  createTweetButton()
}

document.getElementById('save').addEventListener('click', (e) => {
  e.preventDefault()
  savePage()
})

const savePage = () => {
  chrome.tabs.getSelected(null, (tab) => {
    const data = {
      title: tab.title,
      url: tab.url
    }

    setDataStorage(data)
  })
}

const setDataStorage = (data) => {
  const schema = {
    id: uniqueId(),
    title: data.title,
    url: data.url
  }

  let values = getDataStorage()

  if (values !== null) {
    values.unshift(schema)
  } else {
    values = []
    values.push(schema)
  }

  localStorage.setItem('data', JSON.stringify(values))

  createList({
    refresh: true
  })
}

const getDataStorage = () => {
  return JSON.parse(localStorage.getItem('data'))
}

const deleteDataStorage = (id) => {
  let values = getDataStorage()

  for (let i = 0; i < values.length; i++) {
    if (values[i].id === id) {
      values.splice(i, 1)
    }
  }

  localStorage.setItem('data', JSON.stringify(values))

  createList({
    refresh: true
  })
}

const createList = (option = false) => {
  const $list = document.getElementById('list')
  const items = getDataStorage()

  if (option && option.refresh) {
    $list.innerHTML = ''
  }

  if (items.length > 0) {
    for (let key in items) {
      const listItem = document.createElement('li')

      listItem.innerHTML = `<a href="${items[key].url}" data-id="${items[key].id}" target="_blank">${items[key].title}</a>`
      listItem.addEventListener('click', autoDelete)

      $list.appendChild(listItem)
    }
  } else {
    $list.insertAdjacentHTML('beforeend', '<li class="is-empty">「あとで読む」ページはありません</li>')
  }
}

const createTweetButton = () => {
  chrome.tabs.getSelected(null, (tab) => {
    document.getElementById('tweet').setAttribute('href', `https://twitter.com/intent/tweet?url=${tab.url}&text=あとで読む+%2F+${tab.title}`)
  })
}

const autoDelete = (e) => {
  const id = e.currentTarget.children[0].dataset.id

  deleteDataStorage(id)
}

const uniqueId = () => {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}