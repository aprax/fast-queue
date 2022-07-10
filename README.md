# fast-queue

A fast queue for node and javascript with constant time queuing and dequeuing.

## Usage

Using a native Javscript array as a queue can have slow queueing due to the use of [Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) and [Array.prototype.unshift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) which have worst case O(n) complexity due to array indexing.

The implementation uses a circular queue with O(1) queue/dequeue and O(N) space.

| Method  |   Args    | Return |
| ------- | :-------: | :----: |
| enqueue |     T     |  void  |
| dequeue | undefined |   T    |

## Example

```javascript
import FastQueue from "@aprax/fast-queue";

const myQueue = new FastQueue();
myQueue.enqueue(1);
myQueue.enqueue(2);
myQueue.enqueue(3);

myQueue.dequeue(); // 1
myQueue.dequeue(); // 2
myQueue.dequeue(); // 3
myQueue.dequeue(); // throws error because queue is empty
```
