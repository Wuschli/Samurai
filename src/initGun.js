import Gun from "gun/gun";
import Sea from 'gun/sea';
import unset from "gun/lib/unset"
import open from "gun/lib/open"
import load from "gun/lib/load"
import "gun/lib/webrtc";
import { writable } from "svelte/store";

export const pub = writable(undefined);

// Only init GUN once!
Gun.chain.subscribers = []
Gun.chain.subscribe = function (subscriber) {
    let gun = this, at = gun._, subscribers = gun.subscribers;
    subscribers.push(subscriber)
    if (subscribers === 1) {
        gun.on(function (data, key) {
            for (let i = 0; i < subscribers.length; i += 1) {
                subscribers[i](data)
            }
        })
    }
    return function stop() {
        if (subscribers.length === 0) {
            // gun.off() // Should ideally be enabled, but not sure of side effects
        }
    }
}

export const gun = Gun('https://quirky-superficial-flute.glitch.me/gun');
// export const gun = Gun();
gun.subscribe()