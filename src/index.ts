/**
 * Color formats a string.
 *
 * @param {string} s A string to format.
 * @param {number} fg A value between 30-37 and 90-97 inclusive.
 *  Defaults to the current terminal forground color.
 * @param {number} bg A value between 30-37 and 90-97 inclusive.
 *  Defaults to the current terminal background color
 * @param {boolean} underline Underlines the text. Default false
 * @param {boolean} bold Bolds the text. Default false
 *
 * @return {string}
 */
const formatValue = (
  s: string,
  fg = 39,
  bg = 49,
  underline = false,
  bold = false
): string => {
  const formatters = `${fg};${bg};${underline ? 4 : 24};${bold ? 1 : 22}`;
  return fg ? `\x1b[${formatters}m${s}\x1b[0m` : s;
};

/**
 * Queue with constant insert and deletion.
 * @param {FastQueue} this
 * @example
 *  const myQueue = new FastQueue();
 */
export default class FastQueue {
  // Points to the start of the continuation of the queue at the point
  // after the first continuation at the beginning has been reused.
  private newStartPtr: number | undefined = undefined;

  // Points to the front of the queue
  private frontPtr: number | undefined;

  // Used when there is no more space left at the end of the queue
  // but there are deleted cells from the beginning available.
  private reusedEndPtr: number | undefined = undefined;
  queue: (Object | undefined)[] = [];

  /**
   * Returns the last element inserted into the queue.
   * @return {Object | undefined} Undefined if empty, or the front element
   */
  get front(): Object | undefined {
    return this.frontPtr === undefined
      ? undefined
      : this.queue.at(this.frontPtr);
  }

  /**
   * Returns the element that was most recently inserted into the queue.
   */
  get back(): Object | undefined {
    if (this.newStartPtr) {
      return this.queue.at(-1);
    }
    if (this.reusedEndPtr !== undefined) {
      return this.queue.at(this.reusedEndPtr);
    }
    return this.queue.at(-1);
  }

  /**
   * Returns the length of the queue
   */
  get length(): number {
    let length = 0;
    if (this.frontPtr === undefined) {
      return length;
    }
    if (this.reusedEndPtr !== undefined) {
      length += this.reusedEndPtr;
    }
    length += this.queue.length - this.frontPtr;

    return length;
  }

  /**
   * Queues an element.
   *
   * @param {object} value A value containing a to string method
   * @return {void}
   */
  public enqueue(value: Object): void {
    if (this.reusedEndPtr !== undefined) {
      if (this.reusedEndPtr + 1 === this.frontPtr) {
        // If we run out of usuable cells,
        // then append to the end of the queue
        // and mark the start of where we started appending.
        if (!this.newStartPtr) {
          this.newStartPtr = this.queue.length;
        }
        this.queue.push(value);
      } else {
        this.queue[++this.reusedEndPtr] = value;
      }
    } else if (Number(this.frontPtr) > 0 && this.reusedEndPtr === undefined) {
      this.reusedEndPtr = 0;
      this.queue[this.reusedEndPtr] = value;
    } else {
      if (this.frontPtr === undefined) {
        this.frontPtr = 0;
      }
      this.queue.push(value);
    }
  }

  /**
   * Resets the queue and removes all data.
   */
  public reset() {
    this.frontPtr = undefined;
    this.newStartPtr = undefined;
    this.queue = [];
  }
  /**
   * Dequeues the current front ptr and increments the ftpr to the next element
   * in the queue
   * @return {object | undefined}
   */
  public dequeue() {
    if (this.frontPtr === undefined) {
      return undefined;
    }

    // If we move into the end of the space allocated for the reused cells
    // then we should unset the pointer
    if (this.frontPtr === this.reusedEndPtr) {
      this.reusedEndPtr = undefined;
      const dequeued = this.front;

      this.queue[this.frontPtr] = undefined;
      // and move to the new start pointer if it exists.
      if (this.newStartPtr) {
        this.frontPtr = this.newStartPtr;
        this.newStartPtr = undefined;
      } else {
        this.reset();
      }

      return dequeued;
    }

    const dequeued = this.front;
    this.queue[this.frontPtr] = undefined;
    if (this.frontPtr === this.queue.length - 1) {
      if (this.reusedEndPtr === undefined) {
        this.reset();
      } else {
        this.frontPtr = 0;
      }
      return dequeued;
    } else {
      // If we have moved into the new start pointer.
      // Then we should go back to the start of the reused cells.
      if (++this.frontPtr === this.newStartPtr) {
        // We should already had reuused cells
        // if we have defined a new start pointer.
        /*
        if (this.reusedEndPtr === undefined) {
          throw new Error("reusedEndPtr should not be undefined");
        }
        */
        this.frontPtr = 0;
      }
    }
    return dequeued;
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
   * Stringifies and formats the queue,
   *  Reused cells are green,
   *  Cells added to the end are blue.
   *  Front of the queue as bold.
   *  End of the queue as bold and underlined.
   * @return {string}
   */
  public toString(): string {
    const output: Object[] = this.queue.map((value) =>
      value === undefined ? formatValue("-", 37, 107) : value
    );

    // Colors the cells that have been reused to green.
    for (let x = 0; x <= Number(this.reusedEndPtr); x++) {
      output[x] = formatValue(
        this.queue[x]?.toString() || "",
        32,
        undefined,
        x === this.reusedEndPtr && !this.newStartPtr
      );
    }
    // Colors the cells that have been added since running out of reusable cells
    // to blue. This only applies to dynamically sized queues.
    if (this.newStartPtr) {
      for (let x = this.newStartPtr; x < this.queue.length; x++) {
        output[x] = formatValue(
          this.queue[x]?.toString() || "",
          94,
          undefined,
          x === this.queue.length - 1
        );
      }
    }
    if (this.frontPtr !== undefined) {
      output[this.frontPtr] = formatValue(
        output[this.frontPtr].toString(),
        undefined,
        undefined,
        undefined,
        true
      );
    }
    if (!this.newStartPtr && !this.reusedEndPtr) {
      output[this.queue.length - 1] = formatValue(
        this.queue[this.queue.length - 1]?.toString() || "",
        undefined,
        undefined,
        true,
        true
      );
    }
    return output.join(" ");
  }
}
