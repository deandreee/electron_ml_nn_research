class Queue {
  constructor(period) {
    if (!period) {
      throw new Error("Queue: period not set");
    }

    this.period = period;
    this.queue = [];
  }

  enqueue(x) {
    let removed = null;
    if (this.queue.length >= this.period) {
      removed = this.queue.shift();
    }

    this.queue.push(x);

    return removed;
  }
}

module.exports = Queue;
