export default class MinHeap {
  heap = [];
  idToIndex = {}; // For constant time when looking up keys

  peek() {
    return this.heap[0];
  }

  insert(id, cost) {
    const node = new Node(id, cost);
    this.idToIndex[id] = this.heap.length
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    this.swap(0, this.heap.length - 1); // Swap the first and the last element
    const minValNode = this.heap.pop();

    delete this.idToIndex[minValNode.id]
    this.heapifyDown(0); // Repair the heap

    console.log("Returning min val:", minValNode);

    return minValNode;
  }

  decreaseKey(id, newCost) {
    const index = this.idToIndex[id] ?? null;
    if (index != null && index >= 0) {
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
        // CORRECTION: Since the other child was already *a child of the parent*, its value must be lower than that of the parent.
        // So if the current value is lower than that of the parent, it will also be lower than that of the other child
        // this.heapifyDown(childIndex);
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


  swap(index1, index2) {
    const node1 = this.heap[index1];
    const node2 = this.heap[index2];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = node1;
    this.idToIndex[node1.id] = index2
    this.idToIndex[node2.id] = index1
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
