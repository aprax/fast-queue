/* eslint-disable require-jsdoc */
import FastQueue from ".";

class MyCircularQueue<T> extends FastQueue<T> {
  enQueue(value: T): boolean {
    if (this.isFull()) {
      return false;
    }
    this.enqueue(value);
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) {
      return false;
    }
    this.dequeue();
    return true;
  }

  // This is the first item that is next to bedequeued
  Front(): T | number {
    if (this.first === undefined) {
      return -1;
    }
    return this.first;
  }

  // This is the last item in the queue that was just most recently enqueued
  Rear(): T | number {
    if (this.last === undefined) {
      return -1;
    }
    return this.last;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  isFull(): boolean {
    return this.length >= Number(this.maxLength);
  }
}

export default MyCircularQueue;
