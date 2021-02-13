import { writable } from 'svelte/store';

export function array(value = []) {
    const store = writable(value);

    const wrap = method => {
        return (...args) => {
            let ret;
            store.update(value => {
                ret = value[method](...args);
                return value;
            });
            return ret;
        };
    };

    var result = {
        ...store,
        push: wrap('push'),
        pop: wrap('pop'),
        shift: wrap('shift'),
        unshift: wrap('unshift'),
        reverse: wrap('reverse'),
        slice: wrap('slice'),
        splice: wrap('splice'),
    };
    result[Symbol.iterator] = value[Symbol.iterator];
    return result;
}