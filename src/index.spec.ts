import FastQueue from ".";

const queue = Object.create(FastQueue.prototype);

it("should queue three values", () => {
  FastQueue.apply(queue);
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);

  expect(queue.toArray()).toEqual([1, 2, 3]);
  expect(queue.dequeue()).toBe(1);
  expect(queue.dequeue()).toBe(2);
  expect(queue.dequeue()).toBe(3);

  expect(queue.toArray()).toEqual([undefined, undefined, undefined]);

  expect(queue.dequeue()).toBeUndefined();
  expect(queue.toArray()).toHaveLength(0);
  expect(queue.dequeue()).toBeUndefined();
  expect(queue.toArray()).toHaveLength(0);
});

it("should reuse previous cells", () => {
  FastQueue.apply(queue);

  queue.enqueue(4);
  queue.enqueue(5);
  queue.enqueue(6);
  queue.enqueue(7);
  expect(queue.toArray()).toEqual([4, 5, 6, 7]);

  expect(queue.dequeue()).toBe(4);
  expect(queue.dequeue()).toBe(5);
  queue.enqueue(8);
  expect(queue.toArray()).toEqual([8, undefined, 6, 7]);

  queue.enqueue(9);
  expect(queue.toArray()).toEqual([8, 9, 6, 7]);

  queue.enqueue(10);

  expect(queue.toArray()).toEqual([8, 9, 6, 7, 10]);

  queue.enqueue(11);

  expect(queue.toArray()).toEqual([8, 9, 6, 7, 10, 11]);
  expect(queue.dequeue()).toEqual(6);
  expect(queue.toArray()).toEqual([8, 9, undefined, 7, 10, 11]);

  expect(queue.dequeue()).toEqual(7);
  expect(queue.toArray()).toEqual([8, 9, undefined, undefined, 10, 11]);

  expect(queue.dequeue()).toEqual(8);

  expect(queue.toArray()).toEqual([undefined, 9, undefined, undefined, 10, 11]);
  expect(queue.dequeue()).toEqual(9);
  expect(queue.toArray()).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
    10,
    11,
  ]);
  expect(queue.dequeue()).toEqual(10);
  expect(queue.toArray()).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    11,
  ]);
  expect(queue.dequeue()).toEqual(11);
  expect(queue.toArray()).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  expect(queue.dequeue()).toBeUndefined();

  expect(queue.dequeue()).toBeUndefined();

  queue.enqueue(12);
  expect(queue.toArray()).toHaveLength(1);
  queue.enqueue(13);
  expect(queue.toArray()).toHaveLength(2);
  queue.enqueue(14);
  expect(queue.toArray()).toHaveLength(3);
  expect(queue.dequeue()).toBe(12);

  queue.enqueue(15);

  expect(queue.dequeue()).toBe(13);
  expect(queue.dequeue()).toBe(14);
  expect(queue.dequeue()).toBe(15);

  queue.enqueue(16);
  expect(queue.dequeue()).toBe(16);
  expect(queue.dequeue()).toBeUndefined;
});

describe("when dequeuing an empty queue", () => {
  beforeEach(() => {
    FastQueue.apply(queue);
  });

  it("should clear the queue and return undefined", () => {
    expect(queue.dequeue()).toBeUndefined();
    queue.enqueue(1);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.toArray()).toHaveLength(0);
  });
});
