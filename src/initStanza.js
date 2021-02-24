import * as XMPP from 'stanza';

// export const client = 1;
export const client = XMPP.createClient({
    jid: 'admin@localhost',
    password: 'admin',
    transports: {
        websocket: 'ws://localhost:5280/ws',
        bosh: 'https://localhost:5281/http-bind'
    }
});

client.on('session:started', () => {
    client.getRoster();
    client.sendPresence();
});

client.on('chat', msg => {
    client.sendMessage({
        to: msg.from,
        body: 'You sent: ' + msg.body
    });
});

client.connect();