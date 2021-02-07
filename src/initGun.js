import Gun from "gun/gun";
import Sea from 'gun/sea';
import "gun/lib/webrtc";
import { writable } from "svelte/store";

export const gun = Gun();

export const pub = writable(undefined);

console.log(gun);
