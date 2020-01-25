window.addEventListener("DOMContentLoaded", (event) => {
    const validateButton = document.querySelector('#validate')
    const stopButton = document.querySelector('#stop')
    const div = document.querySelector('#tweets')
    const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`)
    let keys = []
    let keysAlreadyDisplayed = []        
    let datasLoaded = false

    validateButton.addEventListener('click', (event) => {
      init()
      const options = document.querySelectorAll('option')
      let selectedTracks = Array.from(options).filter(option => option.selected).map(option => option.value)
      socket.send(selectedTracks)
    })

    stopButton.addEventListener('click', (event) => {
      socket.send("stop")
    })

    socket.addEventListener('message', (event) => {
        if (!datasLoaded) {
            datasLoaded = true
            let trendsParsed = null
            try {
                trendsParsed = JSON.parse(event.data).trends
                if (trendsParsed) {
                    bindDropdown(trendsParsed)
                }
            } catch (error) {
                console.error(error)
            }
        } else if (!Object.keys(keys).includes(event.data)) {
            keys[event.data] = 1
        } else {
            keys[event.data] = keys[event.data] += 1
        }
        displayTweets()
    })

    function init() {
      if (div && div.innerHTML) {
        div.innerHTML = ""
      }
      keys = []
      keysAlreadyDisplayed = []
    }

    function bindDropdown (trends) {
        let keywords = document.querySelector('#keywords')
        for (let trend of trends) {
            let option = document.createElement('option')
            option.text = trend
            option.value = trend
            keywords.append(option)
        }
    }   

    function displayTweets() {
        let count = null
        const MAX_VALUE = 100
        if (keys) {
            for (const [key, value] of Object.entries(keys)) {
                if (!keysAlreadyDisplayed.includes(key)) {
                    keysAlreadyDisplayed.push(key)
                    let title = document.createElement('h1')
                    title.id = 'title' + key
                    count = document.createElement('div')
                    count.id = 'count' + key
                    count.classList.add('bar')
                    count.style.width = 0
                    if (key && title) {
                        title.innerHTML = key
                    }
                    div.append(title)
                    div.append(count)
                } else {
                    count = document.getElementById('count' + key)
                }
                if (value && count) {
                    if (value >= MAX_VALUE) {
                        count.style.width = MAX_VALUE
                    } else {
                        count.style.width = value * 10 + "px"
                    }
                    count.innerHTML = value
                } 
            }
        }
    }
  })