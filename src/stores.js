import { writable } from 'svelte/store';

Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

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
        length: wrap('length'),
        removeIf: wrap('removeIf')
    };
    result[Symbol.iterator] = wrap(Symbol.iterator);
    return result;
}