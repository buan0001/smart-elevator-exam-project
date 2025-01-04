export default class MinHeap {
  heap = [];

  peek() {
    return this.heap[0];
  }

  insert(floor, cost) {}

  extractMin() {

    this.swap(0, this.heap.length-1) // Swap the first and the last element
    this.heapifyDown(0); // Repair the heap
    return this.heap.pop()
  }

  decreaseKey(index, newCost) {
    this.heap[index] = newCost;
  }

  // Used in combination with decrease key
  heapifyUp(childIndex) {
    let parentIndex = this.indexOfParent(childIndex);
    while (parentIndex >= 0) {
      if (this.heap[parentIndex] > this.heap[childIndex]) {
        // let isLeftChild = nodeIndex % 2 // Right child is always on even index, left child on odd
        this.swap(parentIndex, childIndex)
        childIndex = parentIndex
        parentIndex = this.indexOfParent(childIndex)
      } else {
        // This is in case we performed a swap with a parent where the other child actually had a lower value than this.
        this.heapifyDown(childIndex);
        return;
      }
    }
  }

  heapifyDown(parentIndex) {
    let childIndex = this.indexOfLeftChild(parentIndex);
    while (childIndex < this.heap.length - 1) {
      // Right child is at left child index + 1. If right child's value is lower, it should be moved up instead
      if (this.heap[childIndex] > this.heap[childIndex + 1]) {
        childIndex += 1;
      }
      if (this.heap[parentIndex] > this.heap[childIndex]) {
        this.swap(parentIndex, childIndex);
        parentIndex = childIndex;
        childIndex = this.indexOfLeftChild(parentIndex);
      } else {
        return;
      }
    }
  }

  isEmpty() {
    return this.heap.length > 0;
  }

  indexOfLeftChild(index) {
    return 2 * index + 1;
  }

  indexOfRightChild(index) {
    return 2 * index + 2;
  }

  indexOfParent(index) {
    return Math.floor((index - 1) / 2);
  }

  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}
