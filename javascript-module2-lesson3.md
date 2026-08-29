# JAVASCRIPT COMPLETE COURSE - MODULE 2: LESSON 3

## Lesson 3: Event Loop & Timing

### Learning Outcomes
- [ ] Understand JavaScript Event Loop
- [ ] Master Call Stack, Event Queue, Microtask Queue
- [ ] Learn setTimeout, setInterval behavior
- [ ] Understand requestAnimationFrame
- [ ] Optimize performance with timing
- [ ] Debug timing issues

---

## Beginner Explanation (Simple Language)

JavaScript **single-threaded** है - एक बार में एक ही task कर सकता है। लेकिन **Event Loop** के कारण ऐसा लगता है कि multiple tasks हो रहे हैं।

Imagine करो: Restaurant में एक chef है। वह:
1. Current order को complete करता है (Call Stack)
2. Urgent orders check करता है (Microtask Queue)
3. Regular orders को देखता है (Macrotask Queue)

**Event Loop** यही cycle repeat करता है - हमेशा checking कि अगला काम क्या करना है।

**Call Stack** - currently execute हो रहा code
**Event Queue** - जो tasks wait कर रहे हैं
**Microtask Queue** - high priority tasks (promises, etc.)

---

## Key Concepts

### 1. Call Stack
Functions को stack की तरह add/remove करना।

### 2. Web APIs
setTimeout, fetch, DOM events - browser provide करता है।

### 3. Callback Queue
setTimeout callbacks यहाँ आते हैं।

### 4. Microtask Queue
Promise callbacks को higher priority।

### 5. Event Loop
Check करता है कि stack empty है? फिर microtask, फिर callback queue।

---

## Code Examples (Progressive)

### Example 1: Simple Call Stack

```javascript
function third() {
  console.log("3. Third");
}

function second() {
  console.log("2. Second");
  third();
}

function first() {
  console.log("1. First");
  second();
}

first();
```

**Output:**
```
1. First
2. Second
3. Third
```

**Explanation:**
```
Call Stack:
first() → second() → third() 
         ↓          ↓
      (output)   (output)
         ↓          ↓
      second()   third() executes
```

---

### Example 2: setTimeout और Event Loop

```javascript
console.log("1. Start");

setTimeout(() => {
  console.log("2. setTimeout - Callback");
}, 0); // Even 0ms को भी queue में जाता है!

console.log("3. End");

// Output order:
// 1. Start
// 3. End
// 2. setTimeout - Callback
```

**Output:**
```
1. Start
3. End
2. setTimeout - Callback
```

**Explanation:**
```
Call Stack में code synchronously execute होता है।
setTimeout callback Web API को जाता है।
जब stack empty हो, तब callback queue से callback आता है।
```

---

### Example 3: setTimeout का Real Delay

```javascript
// setTimeout minimum delay guarantee नहीं करता
console.time("test");
setTimeout(() => {
  console.timeEnd("test");
}, 0);

// Long-running task
for (let i = 0; i < 1000000000; i++) {
  // Busy loop
}

// Output: test: 1000+ms (0ms नहीं!)
```

**Output:**
```
test: 1000+ms
```

**Explanation:** setTimeout 0ms दिया लेकिन actual delay ज्यादा है क्योंकि call stack busy था।

---

### Example 4: Microtask Queue - Promises

```javascript
console.log("1. Start");

Promise.resolve()
  .then(() => {
    console.log("2. Promise - Microtask");
  });

setTimeout(() => {
  console.log("3. setTimeout - Macrotask");
}, 0);

console.log("4. End");

// Output order:
// 1. Start
// 4. End
// 2. Promise - Microtask (पहले!)
// 3. setTimeout - Macrotask (बाद में)
```

**Output:**
```
1. Start
4. End
2. Promise - Microtask
3. setTimeout - Macrotask
```

**Explanation:** Promises microtask queue में जाते हैं जिसका priority setTimeout से ज्यादा है।

---

### Example 5: Complex Event Loop - Full Picture

```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout 1");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    setTimeout(() => {
      console.log("setTimeout inside Promise");
    }, 0);
  })
  .then(() => {
    console.log("Promise 2");
  });

setTimeout(() => {
  console.log("setTimeout 2");
}, 0);

console.log("End");

// Execution order को predict करो!
```

**Output:**
```
Start
End
Promise 1
Promise 2
setTimeout 1
setTimeout inside Promise
setTimeout 2
```

**Explanation:**
```
1. Call Stack: "Start", "End"
2. Microtask Queue: Promise 1, Promise 2 (एक के बाद एक)
3. Callback Queue: setTimeout 1, setTimeout 2, setTimeout inside Promise
```

---

### Example 6: setInterval - Repeated Execution

```javascript
let count = 0;

const intervalId = setInterval(() => {
  console.log("Count:", ++count);
  
  if (count >= 3) {
    clearInterval(intervalId); // Stop करो
  }
}, 1000);

console.log("Interval started");

// Output:
// Interval started
// (1 second wait)
// Count: 1
// (1 second wait)
// Count: 2
// (1 second wait)
// Count: 3
```

**Output:**
```
Interval started
Count: 1
Count: 2
Count: 3
```

**Explanation:** `setInterval` हर delay के बाद callback call करता है। `clearInterval` से stop कर सकते हो।

---

### Example 7: requestAnimationFrame - Smooth Animation

```javascript
let position = 0;

function animate() {
  position += 1;
  console.log("Position:", position);
  
  if (position < 5) {
    requestAnimationFrame(animate); // 60 FPS पर call होगा
  }
}

requestAnimationFrame(animate);

// Output (60 FPS पर):
// Position: 1
// Position: 2
// Position: 3
// Position: 4
// Position: 5
```

**Output:**
```
Position: 1
Position: 2
Position: 3
Position: 4
Position: 5
```

**Explanation:** `requestAnimationFrame` (rAF) browser के repaint cycle से sync करता है। Smooth animations के लिए best है।

---

### Example 8: setTimeout vs requestAnimationFrame

```javascript
// setTimeout - CPU intensive, not synced to refresh
let count1 = 0;
function withSetTimeout() {
  count1++;
  console.log("setTimeout:", count1);
  if (count1 < 3) setTimeout(withSetTimeout, 16); // ~60fps simulation
}

// requestAnimationFrame - GPU optimized, synced
let count2 = 0;
function withRAF() {
  count2++;
  console.log("RAF:", count2);
  if (count2 < 3) requestAnimationFrame(withRAF);
}

// RAF is better for animations!
requestAnimationFrame(withRAF);
setTimeout(withSetTimeout, 0);
```

**Output:**
```
setTimeout: 1
RAF: 1
(16ms)
RAF: 2
setTimeout: 2
(16ms)
RAF: 3
setTimeout: 3
```

**Explanation:** RAF browser के repaint से sync है, setTimeout arbitrary है।

---

### Example 9: queueMicrotask - Manual Microtask

```javascript
console.log("1. Start");

queueMicrotask(() => {
  console.log("2. Microtask 1");
});

Promise.resolve().then(() => {
  console.log("3. Promise");
});

queueMicrotask(() => {
  console.log("4. Microtask 2");
});

setTimeout(() => {
  console.log("5. setTimeout");
}, 0);

console.log("6. End");

// Microtasks एक के बाद एक, फिर setTimeout
```

**Output:**
```
1. Start
6. End
2. Microtask 1
3. Promise
4. Microtask 2
5. setTimeout
```

**Explanation:** `queueMicrotask()` से manually microtask queue में add कर सकते हो।

---

### Example 10: setTimeout Chain और Performance

```javascript
// ❌ INEFFICIENT - setTimeout को chain करना
function inefficientLoop() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 10);
  }
}
// 100 separate timers! Bad for performance.

// ✅ EFFICIENT - single timer, control करो
function efficientLoop() {
  let i = 0;
  
  function processNext() {
    if (i < 100) {
      console.log(i);
      i++;
      setTimeout(processNext, 10);
    }
  }
  
  processNext();
}

// Or use batching
function batchedLoop() {
  const batchSize = 10;
  for (let batch = 0; batch < 10; batch++) {
    setTimeout(() => {
      for (let i = batch * batchSize; i < (batch + 1) * batchSize; i++) {
        console.log(i);
      }
    }, batch * 100);
  }
}
```

**Explanation:** Many timers से performance degrade होती है।

---

### Example 11: Cancelling Timers

```javascript
// setTimeout cancel करना
const timeoutId = setTimeout(() => {
  console.log("This won't run");
}, 1000);

clearTimeout(timeoutId); // Cancel कर दिया

// setInterval cancel करना
let count = 0;
const intervalId = setInterval(() => {
  console.log("Tick:", ++count);
  
  if (count === 3) {
    clearInterval(intervalId); // Stop कर दिया
  }
}, 100);

// setTimeout का दूसरा तरीका - AbortController
const controller = new AbortController();

setTimeout(() => {
  console.log("Running with AbortController");
}, 1000, { signal: controller.signal });

// Cancel करो
controller.abort();
```

**Explanation:** Timer को cancel करने के तरीके - clearTimeout, clearInterval, AbortController।

---

### Example 12: Debounce Implementation

```javascript
// Input event पर expensive operation को debounce करो
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId); // पिछला timeout cancel करो
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Use करो
const search = debounce((query) => {
  console.log("Searching:", query);
}, 300);

search("J");
search("Ja");
search("Jav");
search("Java");
// 300ms के बाद सिर्फ "Java" search होगा!

// Real example - input
const input = document.querySelector("input");
input.addEventListener("input", debounce((e) => {
  console.log("Value:", e.target.value);
}, 500));
```

**Explanation:** Debounce से redundant function calls को prevent करता है।

---

### Example 13: Throttle Implementation

```javascript
// Scroll पर expensive operation को throttle करो
function throttle(func, interval) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}

// Use करो
const handleScroll = throttle(() => {
  console.log("Scroll event - only every 100ms");
}, 100);

window.addEventListener("scroll", handleScroll);
// Multiple scroll events भी हों तो 100ms में सिर्फ एक बार call होगा
```

**Explanation:** Throttle - fixed intervals पर function call करता है।

---

## Real-World Use Cases

### 1. **Progress Bar Animation**
```javascript
let progress = 0;
function updateProgress() {
  progress += 1;
  console.log(`Progress: ${progress}%`);
  
  if (progress < 100) {
    requestAnimationFrame(updateProgress);
  }
}

requestAnimationFrame(updateProgress);
```

### 2. **Debounced Search**
```javascript
const searchInput = document.querySelector("#search");
const debounceSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(results => displayResults(results));
}, 500);

searchInput.addEventListener("input", (e) => {
  debounceSearch(e.target.value);
});
```

### 3. **Throttled Scroll Listener**
```javascript
window.addEventListener("scroll", throttle(() => {
  const scrollPosition = window.scrollY;
  console.log(`Scrolled to: ${scrollPosition}px`);
}, 200));
```

---

## Common Mistakes

### ❌ Mistake 1: Expecting setTimeout 0 को Immediate

```javascript
// WRONG - सोचते हो tuरंत होगा
setTimeout(() => {
  console.log("Immediate"); // नहीं! Queue में जाता है
}, 0);

// CORRECT - अगर urgent है तो Promise use करो
Promise.resolve().then(() => {
  console.log("Microtask - runs before setTimeout");
});
```

### ❌ Mistake 2: Loop में setTimeout

```javascript
// WRONG - सभी timeout में 'i' का same value होगा
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// सब 3 print होंगे

// CORRECT - closure बनाओ
for (let i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000);
  })(i);
}
```

### ❌ Mistake 3: Heavy Computation in Event Handler

```javascript
// WRONG - UI freeze होगा
document.addEventListener("scroll", () => {
  complexCalculation(); // Blocks! UI freezes
});

// CORRECT - requestAnimationFrame use करो
let shouldProcess = true;
document.addEventListener("scroll", () => {
  shouldProcess = true;
});

requestAnimationFrame(() => {
  if (shouldProcess) {
    complexCalculation();
    shouldProcess = false;
  }
});
```

---

## Best Practices

1. **Animations के लिए requestAnimationFrame** - Smooth, synced
2. **User input debounce करो** - Performance improve करने के लिए
3. **Heavy tasks को break करो** - setTimeout से chunks में
4. **Microtasks को understand करो** - Promise पहले execute होते हैं
5. **Cancel करो जब needed** - Memory leaks से बचने के लिए
6. **Event loop को visualize करो** - Debugging के लिए
7. **Performance monitor करो** - DevTools से

---

## Interview Q&A

### Q1: Event Loop क्या है?

**A:** JavaScript engine continuously check करता है:
1. Call Stack empty है?
2. Microtask Queue में tasks हैं?
3. Callback Queue में tasks हैं?

```
┌─ Call Stack (executing code)
├─ Microtask Queue (Promises, queueMicrotask)
├─ Callback Queue (setTimeout, setInterval)
└─ Event Loop (check करता रहता है)
```

---

### Q2: setTimeout 0 का actual delay क्या है?

**A:** Minimum 1ms, लेकिन call stack busy है तो ज्यादा हो सकता है।

```javascript
console.time("delay");
setTimeout(() => {
  console.timeEnd("delay");
}, 0);

// "delay: 1ms" या ज्यादा
```

---

### Q3: Promises setTimeout से पहले क्यों run होते हैं?

**A:** Promises microtask queue में जाते हैं, setTimeout callback queue में। Microtask queue की priority ज्यादा है।

```
Execution Order:
1. Call Stack (synchronous code)
2. Microtask Queue (Promises, queueMicrotask)
3. Callback Queue (setTimeout, setInterval)
```

---

### Q4: Debounce vs Throttle में क्या difference है?

**A:**
- **Debounce** - अंतिम call के delay के बाद execute
- **Throttle** - fixed intervals पर execute

```javascript
// Debounce - last event के 300ms बाद
debounce(() => save(), 300);

// Throttle - हर 1 second में एक बार
throttle(() => save(), 1000);
```

---

### Q5: requestAnimationFrame कब use करते हो?

**A:** Animations के लिए जहाँ smooth motion चाहिए।

```javascript
// Good for animations
requestAnimationFrame(() => {
  element.style.left = position + "px";
});

// Not good for setTimeout
setTimeout(() => {
  element.style.left = position + "px";
}, 16); // Variable timing
```

---

## Practice Exercises

### Exercise 1: Event Loop Tracing
```javascript
// Predict output
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// Answer: 1, 4, 3, 2
```

### Exercise 2: Debounce Function
```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

### Exercise 3: Throttle Function
```javascript
function throttle(func, interval) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}
```

### Exercise 4: Animation Loop
```javascript
let frame = 0;
function animate() {
  frame++;
  console.log("Frame:", frame);
  if (frame < 60) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

### Exercise 5: Microtask vs Callback
```javascript
// Predict order
Promise.resolve().then(() => console.log("1"));
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
setTimeout(() => console.log("4"), 0);

// Answer: 1, 3, 2, 4
```

---

## Key Takeaways

- **Call Stack** - Synchronous code
- **Microtask Queue** - Promises (high priority)
- **Callback Queue** - setTimeout, setInterval
- **Event Loop** - हमेशा check करता रहता है
- **requestAnimationFrame** - Animations के लिए best
- **Debounce** - अंतिम event के बाद
- **Throttle** - Fixed intervals पर
- **setTimeout 0** - Queue में जाता है, immediate नहीं

---

## Next Steps

Ab aap Event Loop aur Timing master kar gaye!

**Next Lesson:** Error Handling - जहाँ:
- Try/catch blocks
- Finally clause
- Error types
- Custom errors
- Error propagation
- और भी बहुत कुछ!

Padhai continue करो! 🚀

