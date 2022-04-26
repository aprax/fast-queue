import type Args from "./types/Args";
export interface Prototype {
  enqueue: typeof FastQueue.prototype.enqueue;
  dequeue: typeof FastQueue.prototype.dequeue;
  toArray: typeof FastQueue.prototype.toArray;
}

/**
 * Color formats a string.
 *
 * @param {string} character
 * @param {number} ansiColorCode A value between 30-37 and 90-97 inclusive.
 *
 * @return {string}
 */
const formatValue = (character: string, ansiColorCode?: number) =>
  ansiColorCode
    ? `\x01\x1b[${ansiColorCode}m${character.trim()}\x1b[39m\x02`
    : character.trim();

/**
 * @param {FastQueue} this
 * @example
 *  const myQueue = new FastQueue();
 */
function FastQueue(this: Args) {
  this.queue = [];
  this.sPtr = 0;
  this.offset = undefined;
  this.newStart = undefined;
}

FastQueue.prototype.enqueue = function (this: Args, value: Object) {
  if (this.offset) {
    if (this.offset === this.sPtr) {
      if (!this.newStart) {
        this.newStart = this.queue.length;
      }
      this.queue.push(value);
    } else {
      this.queue[this.offset++] = value;
    }
  } else if (this.sPtr > 0) {
    this.offset = 0;
    this.queue[this.offset++] = value;
  } else {
    this.queue.push(value);
  }
  return this.queue;
};

FastQueue.prototype.toArray = function (this: Args) {
  return this.queue;
};

FastQueue.prototype.toString = function (this: Args) {
  const output: (Object | undefined)[] = [...this.queue];

  // Colors the cells that have been reused to green.
  for (let reusedCell = 0; reusedCell < Number(this.offset); reusedCell++) {
    output[reusedCell] = formatValue(
      this.queue[reusedCell]?.toString() || "",
      32
    );
  }
  // Colors the cells that have been added since running out of reusable cells 
  // to blue.
  if (this.newStart) {
    for (
      let addedCells = this.newStart;
      addedCells < this.queue.length;
      addedCells++
    ) {
      output[addedCells] = formatValue(
        this.queue[addedCells]?.toString() || "",
        34
      );
    }
  }
  return output.join(" ");
};

FastQueue.prototype.dequeue = function dequeue(this: Args) {
  if (this.sPtr === this.newStart) {
    if (this.offset) {
      this.sPtr = 0;
      this.offset = undefined;
    } else {
      this.newStart = undefined;
    }
  } else if (this.queue[this.sPtr] === undefined) {
    if (this.offset) {
      this.sPtr = 0;
      this.offset = undefined;
    } else if (this.newStart) {
      this.sPtr = this.newStart;
      this.newStart = undefined;
    } else {
      this.queue = [];
    }
  }
  if (this.queue.length) {
    const dequeued = this.queue[this.sPtr];
    this.queue[this.sPtr++] = undefined;
    return dequeued;
  } else {
    return undefined;
  }
};

export default FastQueue;
