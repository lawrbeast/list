class ArrayIterator {
    get length() { return this.array.length; }

    constructor(array) {
        this.array = array || [];
        this.index = -1;
    }

    current() {
        return this.array[this.index];
    }

    currentIndex() {
        return this.index;
    }

    done() {
        return this.index >= this.array.length;
    }

    reset() {
        this.index = -1;
    }

    prev() {
        this.index--;
    }

    next() {
        this.index++;
    }

    push(item) {
        this.array.push(item);
    }

    all() {
        return this.array;
    }
}

module.exports = ArrayIterator;