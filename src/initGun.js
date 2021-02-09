import Gun from "gun/gun";
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

// opt.store = rindexedDB;
opt.peers = ['https://quirky-superficial-flute.glitch.me/gun'];
export const gun = Gun(opt);
// gun.subscribe()
gun.on('auth', ack => console.log('Authentication was successful: ', ack))
// Gun.on('opt', function (ctx) {
//     this.to.next(ctx);
//     ctx.on('hi', function (opt) {
//         console.log('HI!! PEER', new Date(), opt.pid);
//         // setTimeout(function () {
//         //     document.getElementById('pid').innerHTML = gun._.opt.pid;
//         // });
//     });
// });