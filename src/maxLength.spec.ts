import FastQueue from ".";
it("should show the correct length", () => {
  const queue = new FastQueue(2);
  queue.enqueue(1);
  queue.enqueue(2);
  queue.dequeue();
  expect(queue.length).toBe(1);
  queue.dequeue();
  expect(queue.length).toBe(0);
});
it("should show the correct length for test case 8", () => {
  const queue = new FastQueue(2);

  expect(queue.length).toBe(0);

  queue.enqueue(1);

  expect(queue.length).toBe(1);

  queue.enqueue(2);

  expect(queue.length).toBe(2);

  queue.dequeue();

  expect(queue.length).toBe(1);

  queue.enqueue(3);

  expect(queue.length).toBe(2);

  queue.dequeue();

  expect(queue.length).toBe(1);
});
