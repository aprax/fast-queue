import FastQueue from ".";

it("should return all numbers in the same order as pushed", () => {
  const queue = new FastQueue();
  let counter = 1;
  queue.enqueue(1);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueing 1`);
  queue.enqueue(2);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueing 2`);
  queue.enqueue(3);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueing 3`);

  expect(queue.dequeue()).toBe(1);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeuing 1`);
  expect(queue.dequeue()).toBe(2);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeuing 2`);

  queue.enqueue(4);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueuing 4`);
  expect(queue.front).toBe(3);

  queue.enqueue(5);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueing 5`);
  expect(queue.front).toBe(3);
  expect(queue.back).toBe(5);
  queue.enqueue(6);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after queueing 6`);

  expect(queue.dequeue()).toBe(3);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeueing 3`);
  expect(queue.dequeue()).toBe(4);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeueing 4`);
  expect(queue.dequeue()).toBe(5);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeueing 5`);
  expect(queue.dequeue()).toBe(6);
  expect(queue.toString()).toMatchSnapshot(`${counter++} after dequeuing 6`);
  expect(queue.dequeue()).toBeUndefined();
  expect(queue.toString()).toMatchSnapshot(`${counter++} after empty dequeue `);

  expect(queue.toArray()).toHaveLength(0);
});

it("should reset when the last item is dequed", () => {
  const queue = new FastQueue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);

  expect(queue.dequeue()).toBe(1);
  expect(queue.dequeue()).toBe(2);

  queue.enqueue(4);
  expect(queue.front).toBe(3);
  expect(queue.back).toBe(4);
  expect(queue.dequeue()).toBe(3);
  expect(queue.front).toBe(4);
  expect(queue.back).toBe(4);
  expect(queue.dequeue()).toBe(4);

  expect(queue.front).toBeUndefined();
  expect(queue.back).toBeUndefined();
});

it("should reuse previous cells", () => {
  const queue = new FastQueue();

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
  expect(queue.toArray()).toEqual([]);
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

it("should return undefined when dequeuing an already empty queue", () => {
  const queue = new FastQueue();
  expect(queue.dequeue()).toBeUndefined();
  queue.enqueue(1);
  expect(queue.dequeue()).toBe(1);
  expect(queue.length).toBe(0);
  expect(queue.dequeue()).toBeUndefined();
  expect(queue.length).toBe(0);
  expect(queue.dequeue()).toBeUndefined();
  expect(queue.length).toBe(0);
});
