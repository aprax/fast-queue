/**
 * Color formats a string.
 *
 * @param {string} character
 * @param {number} ansiColorCode A value between 30-37 and 90-97 inclusive.
 *
 * @return {string}
 */
const formatValue = (character: string, ansiColorCode?: number): string =>
  ansiColorCode
    ? `\x01\x1b[${ansiColorCode}m${character.trim()}\x1b[39m\x02`
    : character.trim();

/**
 * @param {FastQueue} this
 * @example
 *  const myQueue = new FastQueue();
 */

/**
 * Queue with constant insert and deletion.
 */
export default class FastQueue {
  private newStartPtr: number | undefined = undefined;
  private nextDequeuePtr = 0;
  private reusedPtr: number | undefined = undefined;
  queue: (Object | undefined)[] = [];

  /**
   * Returns the length of the queue
   */
  get length() {
    return this.queue.length;
  }
  /**
   * Queues an element.
   *
   * @param {object} value A value containing a to string method
   * @return {void}
   */
  public enqueue(value: Object): (Object | undefined)[] {
    if (this.reusedPtr) {
      if (this.reusedPtr === this.nextDequeuePtr) {
        if (!this.newStartPtr) {
          this.newStartPtr = this.queue.length;
        }
        this.queue.push(value);
      } else {
        this.queue[this.reusedPtr++] = value;
      }
    } else if (this.nextDequeuePtr > 0) {
      this.reusedPtr = 0;
      this.queue[this.reusedPtr++] = value;
    } else {
      this.queue.push(value);
    }
    return this.queue;
  }

  /**
   *
   * @return {object | undefined}
   */
  public dequeue() {
    if (this.nextDequeuePtr === this.newStartPtr) {
      if (this.reusedPtr) {
        this.nextDequeuePtr = 0;
        this.reusedPtr = undefined;
      } else {
        this.newStartPtr = undefined;
      }
    } else if (this.queue[this.nextDequeuePtr] === undefined) {
      if (this.reusedPtr) {
        this.nextDequeuePtr = 0;
        this.reusedPtr = undefined;
      } else if (this.newStartPtr) {
        this.nextDequeuePtr = this.newStartPtr;
        this.newStartPtr = undefined;
      } else {
        this.queue = [];
      }
    }
    if (this.queue.length) {
      const dequeued = this.queue[this.nextDequeuePtr];
      this.queue[this.nextDequeuePtr++] = undefined;
      if (
        this.nextDequeuePtr >= this.queue.length &&
        this.reusedPtr === undefined
      ) {
        this.queue = [];
        this.nextDequeuePtr = 0;
      }
      return dequeued;
    } else {
      return undefined;
    }
  }

  /**
   * Returns the current queue.
   *
   * @return {(object | undefined)[]}
   */
  public toArray(): (object | undefined)[] {
    return this.queue;
  }

  /**
   *
   * @return {string}
   */
  public toString(): string {
    const output: (Object | undefined)[] = [...this.queue];

    // Colors the cells that have been reused to green.
    for (
      let reusedCell = 0;
      reusedCell < Number(this.reusedPtr);
      reusedCell++
    ) {
      output[reusedCell] = formatValue(
        this.queue[reusedCell]?.toString() || "",
        32
      );
    }
    // Colors the cells that have been added since running out of reusable cells
    // to blue. This only applies to dynamically sized queues.
    if (this.newStartPtr) {
      for (
        let addedCells = this.newStartPtr;
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
  }
}
