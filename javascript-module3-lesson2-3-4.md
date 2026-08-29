# JAVASCRIPT COMPLETE COURSE - MODULE 3: LESSONS 2-4

---

# Lesson 2: Performance Optimization

### Learning Outcomes
- [ ] Identify performance bottlenecks
- [ ] Optimize algorithms
- [ ] Manage memory efficiently
- [ ] Improve DOM operations
- [ ] Optimize bundle size

---

## Quick Code Examples

### Example 1: Algorithm Optimization
```javascript
// ❌ SLOW - O(n²)
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ FAST - O(n)
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const num of arr) {
    if (seen.has(num)) duplicates.add(num);
    seen.add(num);
  }
  return Array.from(duplicates);
}
```

### Example 2: Memoization
```javascript
// Expensive computation को cache करो
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n]; // Cache hit!
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// 10x faster के लिए
console.time("fib");
console.log(fibonacci(40)); // Fast!
console.timeEnd("fib");
```

### Example 3: Debounce for Performance
```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Use करो
window.addEventListener("resize", debounce(() => {
  console.log("Window resized");
  // Expensive calculation
}, 300));
// हर 300ms में सिर्फ एक बार!
```

### Example 4: Lazy Loading
```javascript
// Images को lazy load करो
const images = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### Example 5: Virtual Scrolling
```javascript
// Large lists को efficiently render करो
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.render();
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleCount;

    const visibleItems = this.items.slice(startIndex, endIndex);
    
    // सिर्फ visible items render करो
    this.container.innerHTML = visibleItems
      .map((item, i) => 
        `<div style="transform: translateY(${(startIndex + i) * this.itemHeight}px)">${item}</div>`
      )
      .join("");
  }
}
```

### Example 6: Object Pool Pattern
```javascript
// Objects को reuse करो (garbage collection कम होगा)
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.active = false;
  }

  activate(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
  }
}

class ParticlePool {
  constructor(size) {
    this.pool = Array.from({ length: size }, () => new Particle());
    this.available = [...this.pool];
  }

  get() {
    return this.available.pop() || new Particle();
  }

  return(particle) {
    particle.reset();
    this.available.push(particle);
  }
}
```

### Example 7: Web Worker
```javascript
// Heavy computation को separate thread में करो
// main.js
const worker = new Worker("worker.js");

worker.postMessage({ data: largeArray, operation: "sort" });

worker.onmessage = (event) => {
  const sortedData = event.data;
  console.log("Sorted:", sortedData);
  // UI thread पर कोई lag नहीं!
};

// worker.js
self.onmessage = (event) => {
  const { data, operation } = event.data;
  
  if (operation === "sort") {
    const sorted = data.sort((a, b) => a - b);
    self.postMessage(sorted);
  }
};
```

### Example 8: RequestAnimationFrame
```javascript
// Smooth animations के लिए
class Animation {
  constructor(element) {
    this.element = element;
    this.position = 0;
    this.animate();
  }

  animate() {
    this.position += 1;
    this.element.style.transform = `translateX(${this.position}px)`;
    
    if (this.position < 500) {
      requestAnimationFrame(() => this.animate());
    }
  }
}
```

### Example 9: Memory Leak Detection
```javascript
// Memory leak को avoid करो
class Component {
  constructor(id) {
    this.id = id;
    this.listeners = [];
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    // Cleanup के लिए track करो
    this.listeners.push({ element, event, handler });
  }

  destroy() {
    // Cleanup करो
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}
```

### Example 10: Tree Shaking
```javascript
// utils.js
export function used() { return "used"; }
export function unused() { return "unused"; }

// main.js
import { used } from "./utils.js";
console.log(used());

// Build time: unused() remove हो जाएगा!
```

---

## Performance Tips
1. **Algorithms को optimize करो** - Time complexity कम करो
2. **Memoization use करो** - Repeated calculations avoid करो
3. **Lazy loading** - जरूरत पर load करो
4. **Debounce/Throttle** - Event handlers को optimize करो
5. **Virtual scrolling** - Large lists के लिए
6. **Web Workers** - Heavy computation को offload करो
7. **Tree shaking** - Bundle size कम करो
8. **Code splitting** - Large bundles को split करो

---

---

# Lesson 3: Testing with Jest

### Learning Outcomes
- [ ] Write unit tests
- [ ] Test async code
- [ ] Mock modules
- [ ] Measure coverage
- [ ] Test patterns

---

## Jest Setup

```bash
npm install --save-dev jest
npx jest --init
```

---

## Testing Examples

### Example 1: Basic Unit Test
```javascript
// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// math.test.js
describe("Math functions", () => {
  test("add numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("multiply numbers correctly", () => {
    expect(multiply(4, 5)).toBe(20);
  });
});
```

### Example 2: Testing Objects
```javascript
describe("User object", () => {
  test("should have correct properties", () => {
    const user = { name: "Alice", age: 30 };
    
    expect(user).toEqual({ name: "Alice", age: 30 });
    expect(user).toHaveProperty("name");
    expect(user.age).toBeGreaterThan(18);
  });
});
```

### Example 3: Async Testing
```javascript
describe("Async operations", () => {
  test("should fetch data", async () => {
    const data = await fetchUser(1);
    expect(data.name).toBe("Alice");
  });

  test("should handle rejection", async () => {
    await expect(fetchUser(-1)).rejects.toThrow();
  });
});
```

### Example 4: Mocking
```javascript
// api.js
export const fetchUsers = async () => {
  const response = await fetch("/api/users");
  return response.json();
};

// api.test.js
import { fetchUsers } from "./api.js";

jest.mock("node-fetch");

describe("API", () => {
  test("should fetch users", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [{ id: 1, name: "Alice" }]
    });

    const users = await fetchUsers();
    expect(users).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/users");
  });
});
```

### Example 5: Snapshot Testing
```javascript
describe("Components", () => {
  test("should render button correctly", () => {
    const button = { type: "button", text: "Click me", disabled: false };
    
    expect(button).toMatchSnapshot();
    // Snapshot save होता है, फिर changes को detect करता है
  });
});
```

### Example 6: Spy and Stub
```javascript
describe("Logger", () => {
  test("should call console.log", () => {
    const consoleSpy = jest.spyOn(console, "log");
    
    logger.info("test message");
    
    expect(consoleSpy).toHaveBeenCalledWith("test message");
    
    consoleSpy.mockRestore();
  });
});
```

### Example 7: Timers
```javascript
describe("Timer functions", () => {
  jest.useFakeTimers();

  test("should call callback after delay", () => {
    const callback = jest.fn();
    
    setTimeout(callback, 1000);
    
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
});
```

### Example 8: Parameterized Tests
```javascript
describe("Multiple test cases", () => {
  test.each([
    [1, 1, 2],
    [2, 2, 4],
    [3, 4, 7]
  ])("add(%i, %i) should return %i", (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });
});
```

---

# Lesson 4: Debugging Techniques

### Learning Outcomes
- [ ] Use browser DevTools effectively
- [ ] Debug async code
- [ ] Source maps
- [ ] Performance profiling
- [ ] Error tracking

---

## Debugging Examples

### Example 1: Console Methods
```javascript
// Different console methods
console.log("Log message");
console.warn("Warning message");
console.error("Error message");
console.table([{ name: "Alice", age: 30 }]);
console.assert(value > 0, "Value must be positive");
console.time("operation");
// ... code ...
console.timeEnd("operation");
```

### Example 2: Debugger Statement
```javascript
function complexFunction(data) {
  debugger; // DevTools pause करेगा यहाँ
  
  const result = data.map(item => item * 2);
  
  debugger; // फिर से pause करेगा
  
  return result;
}
```

### Example 3: Error Handling with Stack
```javascript
try {
  riskyOperation();
} catch (error) {
  console.error("Error:", error.message);
  console.error("Stack:", error.stack);
  // Stack trace से पता चल जाएगा कहाँ से error आया
}
```

### Example 4: Performance Monitoring
```javascript
const performanceMetrics = () => {
  const metrics = {
    dns: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
    tcp: performance.timing.connectEnd - performance.timing.connectStart,
    ttfb: performance.timing.responseStart - performance.timing.requestStart,
    download: performance.timing.responseEnd - performance.timing.responseStart,
    domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
    domComplete: performance.timing.domComplete - performance.timing.navigationStart
  };
  
  console.table(metrics);
};
```

### Example 5: Network Debugging
```javascript
// Network requests को intercept करो
const originalFetch = window.fetch;

window.fetch = async function(...args) {
  console.log("Request:", args[0]);
  
  const response = await originalFetch.apply(this, args);
  
  console.log("Response:", response.status);
  
  return response;
};
```

### Example 6: Memory Profiling
```javascript
// Memory usage को track करो
if (performance.memory) {
  const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
  const limit = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
  
  console.log(`Memory: ${used}MB / ${limit}MB`);
}

// Garbage collection को force करो (DevTools में)
if (window.gc) {
  gc();
}
```

---

## Key Debugging Tips

1. **Breakpoints use करो** - Specific lines पर pause करो
2. **Watch expressions** - Variables को monitor करो
3. **Console logging** - Strategic places पर logs रखो
4. **Network tab** - API calls को debug करो
5. **Performance tab** - Performance bottlenecks find करो
6. **Memory tab** - Memory leaks detect करो
7. **Source maps** - Minified code को readable बनाओ

---

---

# Module 3: Capstone Projects

## 3 Major Real-World Projects

---

# Capstone 1: Advanced Todo App with State Management

## Features
- Redux-like state management
- Persistent storage
- Advanced filtering
- Performance optimized
- Fully tested

## Key Learnings
- Design patterns
- State management
- Performance optimization
- Testing

---

# Capstone 2: Real-time Chat Application

## Features
- Event-based architecture
- Message history
- User presence
- Notifications
- Error handling

## Key Learnings
- Observer pattern
- Event handling
- Memory management
- Debugging

---

# Capstone 3: Data Dashboard with Charts

## Features
- Large data processing
- Chart library integration
- Real-time updates
- Responsive design
- Performance optimized

## Key Learnings
- Performance optimization
- Data visualization
- Algorithm optimization
- Testing practices

---

## Project Requirements (Detailed)

### Capstone 1: Todo App
```javascript
// Redux-like store
class Store {
  constructor(reducer) {
    this.reducer = reducer;
    this.state = reducer(undefined, { type: "@@INIT" });
    this.listeners = [];
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.state;
  }
}

// Usage
const todoReducer = (state = { todos: [] }, action) => {
  switch(action.type) {
    case "ADD_TODO":
      return { todos: [...state.todos, action.payload] };
    case "REMOVE_TODO":
      return { todos: state.todos.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};

const store = new Store(todoReducer);

store.subscribe(() => {
  console.log("State changed:", store.getState());
});

store.dispatch({ type: "ADD_TODO", payload: { id: 1, text: "Learn JS" } });
```

### Capstone 2: Chat App
```javascript
// Chat room management
class ChatRoom {
  constructor(name) {
    this.name = name;
    this.users = new Map();
    this.messages = [];
    this.eventEmitter = new EventEmitter();
  }

  addUser(userId, userName) {
    this.users.set(userId, { userName, joinedAt: new Date() });
    this.eventEmitter.emit("user:joined", { userId, userName });
  }

  addMessage(userId, text) {
    const message = { userId, text, timestamp: new Date() };
    this.messages.push(message);
    this.eventEmitter.emit("message:new", message);
  }

  getHistory(limit = 50) {
    return this.messages.slice(-limit);
  }
}
```

### Capstone 3: Dashboard
```javascript
// Data aggregation with performance
class DataAggregator {
  constructor(data) {
    this.data = data;
    this.cache = new Map();
  }

  aggregate(metric, period) {
    const cacheKey = `${metric}:${period}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Compute aggregation
    const result = this.computeAggregation(metric, period);
    this.cache.set(cacheKey, result);

    return result;
  }

  computeAggregation(metric, period) {
    // Complex calculation
    return this.data
      .filter(d => this.isInPeriod(d.date, period))
      .map(d => d[metric])
      .reduce((sum, val) => sum + val, 0);
  }

  isInPeriod(date, period) {
    // Date filtering logic
    return true;
  }
}
```

---

## Testing Requirements

```javascript
// Unit tests के लिए
describe("Capstone 1: Todo Store", () => {
  test("should add todo", () => {
    const store = new Store(todoReducer);
    store.dispatch({ type: "ADD_TODO", payload: { id: 1, text: "Test" } });
    expect(store.getState().todos).toHaveLength(1);
  });
});

// Integration tests
describe("Capstone 2: Chat Room", () => {
  test("should broadcast new message", () => {
    const room = new ChatRoom("General");
    const listener = jest.fn();

    room.eventEmitter.on("message:new", listener);
    room.addMessage("user1", "Hello");

    expect(listener).toHaveBeenCalled();
  });
});

// Performance tests
describe("Capstone 3: Data Aggregation", () => {
  test("should cache results", () => {
    const data = generateTestData(10000);
    const aggregator = new DataAggregator(data);

    console.time("first call");
    aggregator.aggregate("revenue", "monthly");
    console.timeEnd("first call");

    console.time("cached call");
    aggregator.aggregate("revenue", "monthly");
    console.timeEnd("cached call");

    // Cached call should be 10x faster
  });
});
```

---

## Module 3 Summary

✅ **Design Patterns** - 12+ patterns, real-world examples
✅ **Performance** - Optimization techniques, profiling
✅ **Testing** - Jest setup, unit tests, integration tests
✅ **Debugging** - DevTools, performance profiling
✅ **Capstone Projects** - 3 real-world applications

---

## Completion Status

### JavaScript Complete Course
- ✅ Module 1: Fundamentals (3 lessons + 5 projects)
- ✅ Module 2: Advanced (5 lessons + 5 projects)
- ✅ Module 3: Practical (4 lessons + 3 capstone)

### Total Content
- **12 Detailed Lessons**
- **200+ Code Examples**
- **13 Real-World Projects**
- **50+ Interview Questions**
- **Beginner to Advanced**

---

**Congratulations!** 🎉

You've completed:
- JavaScript Fundamentals
- Advanced JavaScript
- Practical Patterns
- Design Patterns
- Performance Optimization
- Testing & Debugging
- Real-World Projects

**You're now a JavaScript Expert!** 

Next steps:
1. React Course (Frontend)
2. Node.js Course (Backend)
3. Full-Stack Development

Keep learning! 🚀

