import "gun/gun";
import 'gun/sea';
// import "gun/lib/unset"
// import "gun/lib/open"
// import "gun/lib/load"
// import 'gun/lib/radix';
// import "gun/lib/webrtc";
// import 'gun/lib/rindexed';
// import 'gun/axe';
// import "gun/lib/time.js";
import { writable } from "svelte/store";

export const pub = writable(undefined);
export const localAlias = writable(undefined);

// Only init GUN once!
// Gun.chain.subscribers = []
// Gun.chain.subscribe = function (subscriber) {
//     let gun = this, at = gun._, subscribers = gun.subscribers;
//     subscribers.push(subscriber)
//     if (subscribers === 1) {
//         gun.on(function (data, key) {
//             for (let i = 0; i < subscribers.length; i += 1) {
//                 subscribers[i](data)
//             }
//         })
//     }
//     return function stop() {
//         if (subscribers.length === 0) {
//             // gun.off() // Should ideally be enabled, but not sure of side effects
//         }
//     }
// }

var opt = {};
export const peer = writable(undefined);
let p;

// opt.store = rindexedDB;
opt.peers = ['https://quirky-superficial-flute.glitch.me/gun'];
export const gun = Gun(opt);
// gun.subscribe()
gun.on('auth', function (ack) {
    console.log('Authentication was successful'/*, ack*/);

    p = new Peer(null, {
        debug: 2
    });
    p.on('open', initPeerjs);
    peer.set(p);
});

function initPeerjs(id) {
    console.log('My peer ID is', id);

    gun.user().once(function (user) {
        localAlias.set(user.alias.toLowerCase());
        gun.get('users').get(user.alias.toLowerCase()).get("peerId").put(id);
    });

    p.on('connection', function (conn) {
        // console.log('Peerjs connection opened', conn)
        // Receive messages
        conn.on('data', function (data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
    });
}