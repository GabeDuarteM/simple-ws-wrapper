const extractMessageContents = (messageString) => {
  let type
  let data

  try {
    const message = JSON.parse(messageString)
    type = message.type
    data = message.data
  } catch (e) {
    type = messageString
  }

  return { type, data }
}

const log = (isReceived, type, data) => {
  console.log()
  console.log(
    isReceived ? '<<<<<<<<<< Message received:' : '>>>>>>>>>> Message sent:',
  )
  console.log(`Type: ${type}`)
  console.log(`Data: ${JSON.stringify(data, undefined, 2)}`)
  console.log()
}

const createEmmiter = (ws) => (type, data) => {
  log(false, type, data)
  const message = JSON.stringify({ type, data })
  ws.send(message)
}

class SocketWrapper {
  constructor(ws) {
    this.ws = ws
    this.isServer = !ws.url
    this.isBrowser = typeof window !== 'undefined'
    this.handlers = {}

    this._handleMessage = this._handleMessage.bind(this)
    this.waitConnection = this.waitConnection.bind(this)
    this.on = this.on.bind(this)
    this._configureListenersAndEmmiter = this._configureListenersAndEmmiter.bind(
      this,
    )

    this._configureListenersAndEmmiter()
  }

  _configureListenersAndEmmiter() {
    if (this.isBrowser) {
      this.ws.addEventListener('message', this._handleMessage)

      this.emit = createEmmiter(this.ws)
    } else if (!this.isServer) {
      this.emit = createEmmiter(this.ws)

      this.ws.on('message', this._handleMessage)
    } else {
      this.ws.on('connection', (client) => {
        this.emit = createEmmiter(client)

        client.on('message', this._handleMessage)
      })
    }
  }

  _handleMessage(message) {
    const { type, data } = extractMessageContents(
      message.data ? message.data : message,
    )

    log(true, type, data)

    if (this.handlers[type]) {
      this.handlers[type].forEach((handler) => {
        handler(data)
      })
    }
  }

  on(type, handler) {
    const defaultHandlers = ['connection', 'open']

    if (defaultHandlers.includes(type)) {
      this.ws.on(type, handler)
      return
    }

    if (!this.handlers[type]) {
      this.handlers[type] = []
    }

    this.handlers[type] = [...this.handlers[type], handler]
  }

  waitConnection() {
    return new Promise((resolve) => {
      if (this.ws.on) {
        this.ws.on(this.isServer ? 'connection' : 'open', () => resolve())
      } else {
        this.ws.addEventListener('open', () => resolve())
      }
    })
  }
}

module.exports = SocketWrapper
