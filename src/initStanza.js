import * as XMPP from 'stanza';

// export const client = 1;
export const client = XMPP.createClient({
    jid: 'Wuschli@localhost',
    password: '1234',
    transports: {
        websocket: 'ws://localhost:5280/ws',
        bosh: 'https://localhost:5281/http-bind'
    }
});

client.on('session:started', () => {
    console.log("XMPP: session:started");
    client.getRoster();
    client.sendPresence();
    client.enableCarbons();
    console.log(client);
});

client.on('chat', msg => {
    console.log("message received", msg);
    client.sendMessage({
        to: msg.from,
        body: 'You sent: ' + msg.body
    });
});

client.on('carbon:received', msg => {
    console.log("carbon received", msg);
    // client.sendMessage({
    //     to: msg.from,
    //     body: 'You sent: ' + msg.body
    // });
});

// client.on("*", (event, args) => {
//     console.log(event, args);
// });

client.connect();