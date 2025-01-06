export default class MinHeap {
  heap = [];

  peek() {
    return this.heap[0];
  }

  insert(id, cost) {
    const node = new Node(id, cost);
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    this.swap(0, this.heap.length - 1); // Swap the first and the last element
    const minValNode = this.heap.pop();
    this.heapifyDown(0); // Repair the heap
    console.log("Returning min val:", minValNode);

    return minValNode;
  }

  decreaseKey(id, newCost) {
    const index = this.indexOfId(id);
    if (index != null) {
      console.log("Decreasing cost for", id, "to:", newCost, "At index:", index);
      this.heap[index].cost = newCost;
      this.heapifyUp(index);
    }
  }

  // Used in combination with decrease key and insertions
  heapifyUp(childIndex) {
    let parentIndex = this.indexOfParent(childIndex);
    while (parentIndex >= 0) {
      if (this.heap[parentIndex].cost > this.heap[childIndex].cost) {
        // let isLeftChild = nodeIndex % 2 // Right child is always on even index, left child on odd
        this.swap(parentIndex, childIndex);
        childIndex = parentIndex;
        parentIndex = this.indexOfParent(childIndex);
      } else {
        // This is in case we performed a swap with a parent where the other child actually had a lower value than this.
        this.heapifyDown(childIndex);
        return;
      }
    }
  }

  heapifyDown(parentIndex) {
    let childIndex = this.indexOfLeftChild(parentIndex);
    while (childIndex < this.heap.length) {
      // Right child is at left child index + 1. If right child's value is lower, it should be moved up instead
      if (childIndex + 1 < this.heap.length && this.heap[childIndex].cost > this.heap[childIndex + 1].cost) {
        childIndex += 1;
      }
      if (this.heap[parentIndex].cost > this.heap[childIndex].cost) {
        this.swap(parentIndex, childIndex);
        parentIndex = childIndex;
        childIndex = this.indexOfLeftChild(parentIndex);
      } else {
        return;
      }
    }
  }

  idAtIndex(index) {
    return this.heap[index].id;
  }

  isEmpty() {
    return this.heap.length == 0;
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

  indexOfId(id) {
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i].id === id) {
        return i;
      }
    }
    return null; // Not found
  }

  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}

class Node {
  id;
  cost;
  constructor(id, cost = Infinity) {
    this.id = id;
    this.cost = cost;
  }
}
