export default class Queue {
  // Array is used to implement a Queue
  constructor() {
    this.items = [];
  }

  // Functions to be implemented
  put(element) {
    this.items.push(element);
  }

  get() {
    if (this.isEmpty()) return 'Underflow';
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return 'No elements in Queue';
    return this.items[0];
  }

  isEmpty() {
    // return true if the queue is empty.
    return this.items.length === 0;
  }

  printQueue() {
    let str = '';
    for (let i = 0; i < this.items.length; i++) str += `${this.items[i] } `;
    return str;
  }
}
