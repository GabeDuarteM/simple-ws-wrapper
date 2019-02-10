<div align="center">
  <h1>simple-ws-wrapper</h1>

  <p>Provides a socket.io inspired API for sockets, but using native websockets protocol.</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

This lib is isomorphic, so works on both nodejs (using [`ws`](https://www.npmjs.com/package/ws)) and browsers (using the native [`WebSocket` class](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)).

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```bash
npm install --save simple-ws-wrapper
```

## The problem

There are a lot of libraries that provide a great API for interacting via WebSockets, but most of them require a custom client to use it. Because of this, it becomes harder to use them on a cross-platform environment (e.g. the server made using `node` and the client being a native mobile app). Because they do not work with native WebSocket clients, if the library does not provide the client for accessing it on the environment you are using, you just cannot use it.

As an alternative we could use libraries like `ws`, which does not require any client package to interact with the server, but unfortunately it does not provide the best of the API's for that, so you end up with a lot of weird boilerplate just to manage the messages.

## This solution

When using on a `node` environment, this is just a simple wrapper around `ws`, and when on browsers, it is a wrapper around the native `WebSocket` class. In both cases, we provide the same `socket.io` inspired API for exchanging messages between server and client.

Because `ws` works natively with native websocket clients, if you create a server using this package, you can use it in whatever enviromnent which supports `websockets` without any additional package.

Under the hood, we work with objects with the shape below, so if you don't plan to use our wrapper on the client as well, you can just send an object with that shape and everything will work the same.

```ts
{
  type: string;
  data?: any;
}
```

## Usage

### Server

```js
const ws = require('ws')
const SocketWrapper = require('simple-ws-wrapper')

const socket = new SocketWrapper(new ws.Server({ port: 3000 }))

const messages = []

socket.on('connection', () => {
  socket.emit(
    'welcome',
    'Welcome! You have successfully connected to the server',
  )
})

socket.on('request-initial-data', () => {
  socket.emit('initial-data', { name: 'James', surename: 'Bond' })
})

socket.on('add-message', (message) => {
  messages.push(message)
  console.log(messages) // [{ date: "2019-02-09T13:53:52.058Z", message: "hey there!" }]
})
```

### Client

```js
const WebSocket = require('ws')
const SocketWrapper = require('simple-ws-wrapper')

const socket = new SocketWrapper(new WebSocket('ws://localhost:3000'))

socket.on('welcome', (data) => {
  console.log(data) // "Welcome! You have successfully connected to the server"
})

socket.on('initial-data', (data) => {
  console.log(data) // { name: "James", surename: "Bond" }
})

const onConnect = async () => {
  await socket.waitConnection()
  socket.emit('request-initial-data')
  socket.emit('add-message', {
    date: '2019-02-09T13:53:52.058Z',
    message: 'hey there!',
  })
}

onConnect()
```

### Browser

Browser usage is essentially the same as described in `Client` above, the only difference is that you use the native [`WebSocket` class](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), instead of the [`ws`](https://www.npmjs.com/package/ws) package.

### API

#### `.emit(type: string, data?: any): void`

Emits a message of given `type` to all listeners.

`type`: Type of the message which will be sent.

`data`: Optional. Data of the message.

```js
socket.emit('request-initial-data')
socket.emit('add-message', {
  date: '2019-02-09T13:53:52.058Z',
  message: 'hey there!',
})
```

#### `.on(type: string, handler: (data: any) => void): void`

Adds a listener on given `type` message.

`type`: Which message will be listened.

`handler`: Function to be executed when given `type` is called. The first argument of the function is the data of the message.

```js
socket.on('add-message', (data) => {
  console.log(data) // { date: "2019-02-09T13:53:52.058Z", message: "hey there!" }
})
```

#### `.waitConnection(): Promise<void>`

On a server, will resolve when a client has connected.

On a client, will resolve when it connects to the server.

## Inspiration

The API is heavily inspired by the awesome [`socket.io`](https://socket.io)

## Other Solutions

- [`ws`](https://www.npmjs.com/package/ws): The library which we use internally to provide the wrapper.

I'm not aware of any others, if you are please [make a pull request][prs] and add it
here!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/com/GabrielDuarteM/simple-ws-wrapper/master.svg?style=flat-square
[build]: https://travis-ci.com/GabrielDuarteM/simple-ws-wrapper
[coverage-badge]: https://img.shields.io/codecov/c/github/GabrielDuarteM/simple-ws-wrapper.svg?style=flat-square
[coverage]: https://codecov.io/github/GabrielDuarteM/simple-ws-wrapper
[version-badge]: https://img.shields.io/npm/v/simple-ws-wrapper.svg?style=flat-square
[package]: https://www.npmjs.com/package/simple-ws-wrapper
[downloads-badge]: https://img.shields.io/npm/dm/simple-ws-wrapper.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/simple-ws-wrapper
[license-badge]: https://img.shields.io/github/license/GabrielDuarteM/simple-ws-wrapper.svg?style=flat-square
[license]: https://github.com/GabrielDuarteM/simple-ws-wrapper/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/GabrielDuarteM/simple-ws-wrapper/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/GabrielDuarteM/simple-ws-wrapper.svg?style=social
[github-watch]: https://github.com/GabrielDuarteM/simple-ws-wrapper/watchers
[github-star-badge]: https://img.shields.io/github/stars/GabrielDuarteM/simple-ws-wrapper.svg?style=social
[github-star]: https://github.com/GabrielDuarteM/simple-ws-wrapper/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20simple-ws-wrapper%20by%20%40GabrielDuarteM%20https%3A%2F%2Fgithub.com%2FGabrielDuarteM%2Fsimple-ws-wrapper%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/GabrielDuarteM/simple-ws-wrapper.svg?style=social
