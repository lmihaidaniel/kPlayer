function copyProperties(target, source) {
    //Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source));
    for (let key of Reflect.ownKeys(source)) {
        if (key !== "constructor" && key !== "prototype" && key !== "name") {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

export default function mix(...mixins) {
    class Mix {}

    // Programmatically add all the methods and accessors
    // of the mixins to class Mix.
    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }
    
    return Mix;
};