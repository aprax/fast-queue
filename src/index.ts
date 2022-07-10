/**
 * [value, prev, next]
 */
export type Node<T> = [T, Node<T> | undefined, Node<T> | undefined];

/**
 * Queue with constant insert and deletion.
 * @param {FastQueue} this
 * @example
 *  const myQueue = new FastQueue();
 */
export default class FastQueue<T> {
  protected maxLength: number | undefined;

  /**
   * Initializes a FastQueue instance
   * @param {number} [maxLength] A max length for the queue
   */
  constructor(maxLength?: number) {
    this.maxLength = maxLength;
  }
  /**
   * Returns the last element inserted into the queue.
   * @return {Node<T> | undefined} Undefined if empty, or the front element
   */
  public firstPtr: Node<T> | undefined;

  public lastPtr: Node<T> | undefined;

  /**
   * Returns the length of the queue.
   */
  public length = 0;

  /**
   * Returns next item to be dequeued.
   */
  get first() {
    return this.firstPtr?.[0];
  }
  /**
   * Returns last value that was enqueued.
   */
  get last() {
    return this.lastPtr?.[0];
  }

  /**
   * alias for this.first
   */
  get front() {
    return this.first;
  }
  /**
   * alias for this.last
   */
  get back() {
    return this.last;
  }
  /**
   * Queues an element.
   *
   * @param {T} value A value containing a to string method
   * @return {void}
   */
  public enqueue(value: T): void {
    if (this.length === this.maxLength) {
      throw new Error("Max queue length reached");
    }
    if (this.lastPtr) {
      this.lastPtr[1] = [value, undefined, this.lastPtr];
      this.lastPtr = this.lastPtr[1];
    } else {
      // Queue is empty
      if (this.firstPtr) {
        throw new Error("should not have front if no back");
      }
      this.lastPtr = [value, undefined, undefined];
      this.firstPtr = this.lastPtr;
    }
    this.length++;
  }

  /**
   * Returns the first item and removes it from the queue.
   * @return {T | undefined}
   */
  public dequeue() {
    if (!this.firstPtr) {
      throw new Error("dequeueing an empty queue");
    }
    const dequeued = this.firstPtr;
    this.firstPtr = this.firstPtr[1];
    if (!this.firstPtr) {
      this.lastPtr = this.firstPtr;
    }
    this.length--;
    return dequeued[0];
  }

  /**
   * Returns the queue from first to last as an array
   * @return {T[]}
   */
  public toArray() {
    if (!this.firstPtr) {
      return [];
    }
    let ptr: Node<T> | undefined = this.firstPtr;
    const array = new Array(this.length);
    let index = 0;
    while (ptr) {
      array[index++] = ptr[0];
      ptr = ptr[1];
    }
    return array;
  }
  /**
   * Returns a column deliminated string of the que values from first to last
   * @return {string}
   */
  public toString() {
    return this.toArray().toString();
  }
}
