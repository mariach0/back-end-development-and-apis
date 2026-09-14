import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';


const server = http.createServer((req, res) => {
    fs.readFile("./public/index.html", "utf-8", (err, data) => {
        if (err) {
            res.writeHead(500, "error on the server while reading file")
            return
        }
        res.writeHead(200, { "content-type": "text/html" })
        res.end(data)
    })
})

const wss = new WebSocketServer({ server })
wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username")

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                "type": "system",
                "text": `${username} joined`
            }))
        }
    })

    socket.on("message", (message) => {
        const messageObj = JSON.parse(message)
        const data = {
            "type": "chat",
            "username": messageObj["username"],
            "text": messageObj["text"]
        }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
            }
        })
    })

    socket.on("close", () => {

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    "type": "system",
                    "text": `${username} left`
                }))
            }
        })
    })

})

const PORT = 3001;

server.listen(PORT, () => {
    console.log("Chat server running at http://localhost:3001")
})