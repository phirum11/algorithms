export const ALGORITHMS = [
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    slug: 'quick-sort',
    category: 'Sorting',
    complexity: 'O(n log n)',
    space: 'O(log n)',
    status: 'Optimal',
    desc: 'Divide-and-conquer algorithm using partitioning.',
    best_case: 'General-purpose sorting on RAM-based arrays.',
    feedback: [
      { type: 'success', text: 'Highly efficient cache utilization' },
      { type: 'info', text: 'Implement random pivot to mitigate O(n^2) worst case' },
      { type: 'warning', text: 'Unstable sorting method' }
    ],
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    slug: 'merge-sort',
    category: 'Sorting',
    complexity: 'O(n log n)',
    space: 'O(n)',
    status: 'Stable',
    desc: 'Stable recursive sorting by splitting and merging lists.',
    best_case: 'Sorting linked lists or datasets requiring stability.',
    feedback: [
      { type: 'success', text: 'Guaranteed O(n log n) performance' },
      { type: 'info', text: 'Excels at external sorting scenarios' },
      { type: 'warning', text: 'High auxiliary space requirement' }
    ],
    code: `function merge(left, right) {
  let arr = []
  while (left.length && right.length) {
    if (left[0] < right[0]) arr.push(left.shift())
    else arr.push(right.shift())
  }
  return [ ...arr, ...left, ...right ]
}`
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    slug: 'bubble-sort',
    category: 'Sorting',
    complexity: 'O(n²)',
    space: 'O(1)',
    status: 'Inefficient',
    desc: 'Simple comparisons of adjacent elements repeated.',
    best_case: 'Educational use or nearly sorted minimal datasets.',
    feedback: [
      { type: 'success', text: 'Extremely simple logic' },
      { type: 'info', text: 'Add swap flag to detect pre-sorted condition' },
      { type: 'warning', text: 'Severely inefficient for large datasets' }
    ],
    code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
    }
  }
}`
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    slug: 'dijkstra',
    category: 'Graph',
    complexity: 'O(E log V)',
    space: 'O(V)',
    status: 'Optimal',
    desc: 'Shortest path algorithm for weighted graphs.',
    best_case: 'Single-source shortest path on non-negative graphs.',
    feedback: [
      { type: 'success', text: 'Guarantees optimal shortest path' },
      { type: 'info', text: 'Utilize Fibonacci heap for densest graphs' },
      { type: 'warning', text: 'Fails if negative weight edges exist' }
    ],
    code: `while (pq.size() > 0) {
  let { node, dist } = pq.pop();
  for (let neighbor of adj[node]) {
    let newDist = dist + weight;
    if (newDist < distance[neighbor]) {
      distance[neighbor] = newDist;
      pq.push({ neighbor, newDist });
    }
  }
}`
  }
];

export function generateData(complexity) {
  const base = [];
  for (let n = 10; n <= 100; n += 10) {
    let time = 0;
    if (complexity === 'O(n log n)') {
      time = n * Math.log2(n) * 0.5;
    } else if (complexity === 'O(n²)') {
      time = n * n * 0.1;
    } else if (complexity === 'O(E log V)') {
      time = n * Math.log2(n) * 0.8;
    }
    time += Math.random() * (time * 0.1);
    base.push({
      elements: n,
      ops: Math.floor(time),
      memory: Math.floor(Math.random() * 50 + 10)
    });
  }
  return base;
}
