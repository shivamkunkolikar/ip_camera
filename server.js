const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

let clients = []

wss.on('connection', (ws) => {
    clients.push(ws)
    console.log('Current Client Count: ', clients.length)

    ws.on('message', (message) => {
        clients.forEach(client => {
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message)
            }
        })
    })

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws)
        console.log('Client Disconnected')
    })
})