import { gun } from './initGun';

function customStore(ref, methods = {}) {
    const store = {}
    const subscribers = []

    // Add a listener to GUN data
    ref.on(function (data, key) {
        /* If the ref._get matches the data key it means we are getting
         * data from a call to gun.get(), and so we don't need the store
         * to be an object with nested data. Otherwise we are getting data
         * from a call to map() and should nest the data in an object
         */
        if (ref._.get === key) {
            store = data
        } else if (!data) {
            /* This clause will not work as intended on null values / false / 0
             * if you use such data consider subscribing to a parent node instead
             * eg. gun.get("temperature") instead of gun.get("temperature").get("value").
             * Or you can pass a validate() function (TODO: add example)
             */
            delete store[key]
        } else {
            store[key] = data
        }
        // Tell each subscriber that data has been updated
        for (let i = 0; i < subscribers.length; i += 1) {
            subscribers[i](store)
        }
    })


    function subscribe(subscriber) {
        subscribers.push(subscriber)

        // Publish initial value
        subscriber(store)

        // return cleanup function to be called on component dismount
        return () => {
            const index = subscribers.indexOf(subscriber)
            if (index !== -1) {
                subscribers.splice(index, 1)
            }
            if (!subscribers.length) {
                ref.off()
            }
        }
    }

    return { ...methods, subscribe }
}

const contactsRef = gun.get("contacts")
export const contacts = customStore(contactsRef.map(), {
    add: text => ref.set({ text, sender: "moi", icon: "😺" }),
    delete: key => ref.get(key).put(null)
})

