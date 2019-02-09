# simple-ws-socket

Provides a socket.io inspired API for sockets, but using native websockets protocol. This lib is isomorphic, so works on both nodejs (using [`ws`](https://www.npmjs.com/package/ws)) and browsers (using the native [`WebSocket` class](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)).

## Installing

`npm install simple-ws-wrapper`

## Usage

### Server

```js
const ws = require("ws");
const SocketWrapper = require("simple-ws-wrapper");

const socket = new SocketWrapper(new ws.Server({ port: 3000 }));

const messages = [];

socket.on("connection", () => {
  socket.emit(
    "welcome",
    "Welcome! You have successfully connected to the server"
  );
});

socket.on("request-initial-data", () => {
  socket.emit("initial-data", { name: "James", surename: "Bond" });
});

socket.on("add-message", message => {
  messages.push(message);
  console.log(messages); // [{ date: "2019-02-09T13:53:52.058Z", message: "hey there!" }]
});
```

### Client

```js
const WebSocket = require("ws");
const SocketWrapper = require("simple-ws-wrapper");

const socket = new SocketWrapper(new WebSocket("ws://localhost:3000"));

socket.on("welcome", data => {
  console.log(data); // "Welcome! You have successfully connected to the server"
});

socket.on("initial-data", data => {
  console.log(data); // { name: "James", surename: "Bond" }
});

const onConnect = async () => {
  await socket.waitConnection();
  socket.emit("request-initial-data");
  socket.emit("add-message", {
    date: "2019-02-09T13:53:52.058Z",
    message: "hey there!"
  });
};

onConnect();
```

### Browser

Browser usage is essentially the same as described in `Client` above, the only difference is that you use the native [`WebSocket` class](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), instead of the [`ws`](https://www.npmjs.com/package/ws) package.

### API

#### `.emit(type: string, data?: any): void`

Emits a message of given `type` to all listeners.

`type`: Type of the message which will be sent.

`data`: Optional. Data of the message.

```js
socket.emit("request-initial-data");
socket.emit("add-message", {
  date: "2019-02-09T13:53:52.058Z",
  message: "hey there!"
});
```

#### `.on(type: string, handler: (data: any) => void): void`

Adds a listener on given `type` message.

`type`: Which message will be listened.

`handler`: Function to be executed when given `type` is called. The first argument of the function is the data of the message.

```js
socket.on("add-message", data => {
  console.log(data); // { date: "2019-02-09T13:53:52.058Z", message: "hey there!" }
});
```

#### `.waitConnection(): Promise<void>`

On a server, will resolve when a client has connected.

On a client, will resolve when it connects to the server.
