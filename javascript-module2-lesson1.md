# JAVASCRIPT COMPLETE COURSE - MODULE 2: LESSON 1

## Lesson 1: Closures, Scope Chain, and Context (this)

### Learning Outcomes
- [ ] Understand closures और उनके practical use cases
- [ ] Master scope chain और variable lookup mechanism
- [ ] Learn different ways of binding `this`
- [ ] Understand execution context
- [ ] Use closures for data privacy और encapsulation

---

## Beginner Explanation (Simple Language)

**Closures** JavaScript की सबसे powerful concept है। जब एक function अपने parent function के variables को "याद रखता है" तो उसे closure कहते हैं।

Imagine करो: तुम एक room बनाते हो, उसमें कुछ चीजें रखते हो, फिर room को close कर देते हो। लेकिन जो function उस room में बनाया गया था, वह अब भी उन चीजों को access कर सकता है - भले ही room बंद हो!

**Scope Chain** - JavaScript engine variables को ढूंढने के लिए एक order follow करता है:
1. Local scope (अपने function में)
2. Parent function scope
3. Global scope

**`this`** - हर function के अपने context होता है। `this` उस context को point करता है।

---

## Key Concepts

### 1. Closure Definition
Function जो अपने parent के variables को access करता है - closure बन जाता है.

### 2. Scope Chain
```
Local Scope → Enclosing Function Scope → Global Scope
```

### 3. Execution Context
हर function execution के समय एक context बनता है जिसमें:
- Variable environment
- Lexical environment
- `this` binding

### 4. `this` Binding Rules
- Regular function: call site से decide होता है
- Arrow function: lexical `this` (parent से inherit)
- Method: object को point करता है
- Constructor: new instance को point करता है

---

## Code Examples (Progressive)

### Example 1: Basic Closure

```javascript
// Simple closure
function outer() {
  const message = "Hello from outer!";
  
  function inner() {
    console.log(message); // Inner outer के variable को access कर सकता है
  }
  
  return inner;
}

const closureFunc = outer();
closureFunc(); // Output: Hello from outer!

// Explanation: 
// outer() execute हो गया, लेकिन inner() अभी भी message को याद रखता है
// यह closure है!
```

**Output:**
```
Hello from outer!
```

**Explanation:** Inner function अपने parent के variables को "remember" करता है, भले ही parent function का execution complete हो गया हो।

---

### Example 2: Closure - Counter Pattern

```javascript
// Counter बनाने के लिए closure का use
function createCounter() {
  let count = 0; // Private variable - सिर्फ closure से accessible
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1

// यहाँ count variable सिर्फ closure methods से accessible है
// Direct access नहीं कर सकते: counter.count // undefined
```

**Output:**
```
1
2
1
1
```

**Explanation:** Closure से data privacy create हो गई। `count` variable सिर्फ methods से accessible है, बाहर से नहीं।

---

### Example 3: Scope Chain - Variable Lookup

```javascript
const global = "Global";

function outer() {
  const outerVar = "Outer";
  
  function middle() {
    const middleVar = "Middle";
    
    function inner() {
      const localVar = "Local";
      
      console.log(localVar); // Local scope
      console.log(middleVar); // Parent scope
      console.log(outerVar); // Grandparent scope
      console.log(global); // Global scope
    }
    
    return inner;
  }
  
  return middle;
}

const fn = outer()();
fn();
```

**Output:**
```
Local
Middle
Outer
Global
```

**Explanation:** JavaScript scope chain follow करता है - जहाँ variable नहीं मिला, parent में ढूंढता है, फिर global में।

---

### Example 4: Closure with Loops (Common Mistake!)

```javascript
// ❌ WRONG - var का problem
function createFunctions() {
  var functions = [];
  
  for (var i = 0; i < 3; i++) {
    functions.push(function() {
      return i;
    });
  }
  
  return functions;
}

const funcs = createFunctions();
console.log(funcs[0]()); // Output: 3 (not 0!)
console.log(funcs[1]()); // Output: 3 (not 1!)
console.log(funcs[2]()); // Output: 3 (not 2!)

// सब 3 return कर रहे हैं क्योंकि var function-scoped है
// सभी functions एक ही i को share करते हैं

// ✅ CORRECT - let use करो
function createFunctionsCorrect() {
  var functions = [];
  
  for (let i = 0; i < 3; i++) {
    functions.push(function() {
      return i;
    });
  }
  
  return functions;
}

const funcsCorrect = createFunctionsCorrect();
console.log(funcsCorrect[0]()); // Output: 0
console.log(funcsCorrect[1]()); // Output: 1
console.log(funcsCorrect[2]()); // Output: 2

// let block-scoped है, हर iteration का अपना i है
```

**Output:**
```
3
3
3
0
1
2
```

**Explanation:** `var` से सभी functions एक ही variable share करते हैं। `let` से हर iteration का अपना variable होता है।

---

### Example 5: Practical Closure - Function Factory

```javascript
// Function factory - reusable functions बनाने के लिए
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5)); // 10
console.log(triple(5)); // 15
console.log(quadruple(5)); // 20

// Closure से हर function अपना multiplier याद रखता है
```

**Output:**
```
10
15
20
```

**Explanation:** Factory pattern से reusable functions बना सकते हो, हर एक का अपना data।

---

### Example 6: `this` Context - Different Scenarios

```javascript
// 1. Regular function call - "this" is window/undefined
function regularFunc() {
  console.log("Regular function this:", this);
}
regularFunc(); // Window {} या undefined (strict mode में)

// 2. Method call - "this" is the object
const obj = {
  name: "Alice",
  greet: function() {
    console.log("Hello, I'm", this.name);
  }
};
obj.greet(); // Output: Hello, I'm Alice

// 3. Constructor call - "this" is the new object
function Person(name) {
  this.name = name;
}
const person = new Person("Bob");
console.log(person.name); // Output: Bob

// 4. Arrow function - "this" is lexical
const obj2 = {
  name: "Charlie",
  greet: () => {
    console.log("Hello, I'm", this.name); // 'this' parent scope से
  }
};
obj2.greet(); // Output: Hello, I'm undefined (arrow में 'this' नहीं बदलता)
```

**Output:**
```
Regular function this: Window {}
Hello, I'm Alice
Bob
Hello, I'm undefined
```

**Explanation:** `this` का value उपर depend करता है कि function कहाँ से call हुआ।

---

### Example 7: Explicit `this` Binding - call(), apply(), bind()

```javascript
function introduce(greeting, punctuation) {
  return greeting + ", I'm " + this.name + punctuation;
}

const person = { name: "Alice" };

// 1. call() - तुरंत call करो, arguments pass करो
console.log(introduce.call(person, "Hi", "!")); 
// Output: Hi, I'm Alice!

// 2. apply() - तुरंत call करो, array में arguments
console.log(introduce.apply(person, ["Hello", "?"]));
// Output: Hello, I'm Alice?

// 3. bind() - नया function return करो, later call के लिए
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce("Hey", "."));
// Output: Hey, I'm Alice.

// bind के साथ partial application
const boundWithGreeting = introduce.bind(person, "Namaste");
console.log(boundWithGreeting("!")); 
// Output: Namaste, I'm Alice!
```

**Output:**
```
Hi, I'm Alice!
Hello, I'm Alice?
Hey, I'm Alice.
Namaste, I'm Alice!
```

**Explanation:** call, apply, bind से explicitly `this` को set कर सकते हो।

---

### Example 8: Closure में Private Methods

```javascript
// Module pattern - private और public methods
const calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private function
  function log(message) {
    console.log("[Calculator]", message);
  }
  
  // Public methods (return object में)
  return {
    add: function(x) {
      result += x;
      log("Added " + x);
      return this;
    },
    multiply: function(x) {
      result *= x;
      log("Multiplied by " + x);
      return this;
    },
    getResult: function() {
      log("Result: " + result);
      return result;
    }
  };
})();

// Use करो
calculator.add(5).multiply(2).add(3).getResult();
// Output: 
// [Calculator] Added 5
// [Calculator] Multiplied by 2
// [Calculator] Added 3
// [Calculator] Result: 13
```

**Output:**
```
[Calculator] Added 5
[Calculator] Multiplied by 2
[Calculator] Added 3
[Calculator] Result: 13
```

**Explanation:** IIFE + closure = private variables। यह module pattern है - encapsulation का best तरीका।

---

### Example 9: `this` in Arrow Functions vs Regular Functions

```javascript
const user = {
  name: "Alice",
  age: 30,
  
  // Regular function method
  regularMethod: function() {
    console.log("Regular - this.name:", this.name);
    
    const arrow = () => {
      console.log("Arrow inside regular - this.name:", this.name);
    };
    
    arrow();
  },
  
  // Arrow function method
  arrowMethod: () => {
    console.log("Arrow method - this.name:", this.name); // undefined!
  }
};

user.regularMethod();
// Output:
// Regular - this.name: Alice
// Arrow inside regular - this.name: Alice

user.arrowMethod();
// Output: Arrow method - this.name: undefined
```

**Output:**
```
Regular - this.name: Alice
Arrow inside regular - this.name: Alice
Arrow method - this.name: undefined
```

**Explanation:** Arrow function में `this` parent scope से आता है, method के object से नहीं।

---

### Example 10: Execution Context और Variable Shadowing

```javascript
const global = "Global";

function test() {
  const local = "Local";
  
  // Shadowing - parent का variable override हो गया
  if (true) {
    const global = "Block scoped global";
    console.log(global); // "Block scoped global"
  }
  
  console.log(global); // "Global" (block का scope बाहर है)
  
  // Inner function
  function inner() {
    const local = "Inner local"; // Shadowing
    console.log(local); // "Inner local"
  }
  
  inner();
  console.log(local); // "Local" (function का scope बाहर है)
}

test();
```

**Output:**
```
Block scoped global
Global
Inner local
Local
```

**Explanation:** Scope chain में nearest variable use होता है - यह shadowing कहलाता है।

---

### Example 11: Closure Memory और Memory Leaks

```javascript
// Closure unexpectedly variables को memory में रखता है
function heavyProcessor() {
  const largeData = new Array(1000000).fill("Large data"); // बहुत बड़ा
  
  return function() {
    console.log(largeData[0]); // largeData अभी भी memory में है!
  };
}

const processor = heavyProcessor();
// largeData अभी भी memory में है, भले ही हम use न कर रहे हों

// Better approach
function heavyProcessorOptimized() {
  let largeData = new Array(1000000).fill("Large data");
  
  return function() {
    console.log(largeData[0]);
    largeData = null; // Cleanup
  };
}
```

**Explanation:** Closures variables को memory में रखते हैं - memory leaks का कारण बन सकता है।

---

### Example 12: Closure with Async Operations

```javascript
// API calls के साथ closure
function fetchUserData(userId) {
  const startTime = Date.now(); // Capture करो
  
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(data => {
      const duration = Date.now() - startTime; // Closure! startTime याद है
      console.log(`User ${data.name} loaded in ${duration}ms`);
      return data;
    });
}

fetchUserData(1);
```

**Explanation:** Async operations में भी closure काम करता है - timing track कर सकते हो।

---

### Example 13: Context Binding in Event Handlers

```javascript
class ButtonHandler {
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    this.clickCount = 0;
    
    // ❌ WRONG - this undefined होगा
    // this.button.addEventListener('click', this.handleClick);
    
    // ✅ CORRECT - arrow function से this bind रहेगा
    this.button.addEventListener('click', () => {
      this.handleClick();
    });
    
    // OR bind use करो
    // this.button.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick() {
    this.clickCount++;
    console.log(`Button clicked ${this.clickCount} times`);
  }
}
```

**Explanation:** Event handlers में regular function से `this` problem आता है - arrow या bind use करो।

---

## Real-World Use Cases

### 1. **Data Privacy - Encapsulation**
```javascript
const app = (function() {
  const privateUsers = []; // Only closure से accessible
  
  return {
    addUser: (name) => privateUsers.push({ name, id: Date.now() }),
    getUsers: () => [...privateUsers], // Copy return करो, original nहीं
    getUserCount: () => privateUsers.length
  };
})();

app.addUser("Alice");
app.addUser("Bob");
console.log(app.getUserCount()); // 2
// app.privateUsers // undefined - नहीं access कर सकते!
```

### 2. **Debounce/Throttle Patterns**
```javascript
function debounce(func, delay) {
  let timeoutId; // Closure में store
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const search = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

search("JavaScript");
search("Java"); // पहला cancel हो गया
```

### 3. **Memoization - Performance**
```javascript
function memoize(func) {
  const cache = {}; // Closure में cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("From cache");
      return cache[key];
    }
    
    const result = func(...args);
    cache[key] = result;
    return result;
  };
}
```

---

## Common Mistakes

### ❌ Mistake 1: Closure में Unintended Data Retention

```javascript
// WRONG - user object references close हो जाएंगे
const users = [
  { id: 1, name: "Alice", data: new Array(1000000) }
];

const getUser = (id) => users.find(u => u.id === id);

// User object अभी भी memory में है, large data के साथ

// CORRECT
const getUser = (id) => {
  const user = users.find(u => u.id === id);
  return { id: user.id, name: user.name }; // Sirf जरूरी data
};
```

### ❌ Mistake 2: Loop में Closure का गलत use

```javascript
// WRONG
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // सब 3 print करेंगे
}

// CORRECT
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 print होंगे
}
```

### ❌ Mistake 3: Arrow Function में `this`

```javascript
// WRONG - 'this' का problem
const obj = {
  value: 42,
  getValue: () => this.value // 'this' parent scope में
};

// CORRECT
const obj = {
  value: 42,
  getValue: function() { return this.value; }
};
```

---

## Best Practices

1. **Data Privacy के लिए Closures** - Encapsulation करो
2. **let/const use करो** - var से scope confusion
3. **`this` को explicitly bind करो** - Callbacks में
4. **Arrow functions callbacks में** - Data privacy के लिए
5. **Regular functions methods में** - `this` binding के लिए
6. **Memory leaks से बचो** - Cleanup करो
7. **call/apply/bind समझो** - Advanced control के लिए

---

## Interview Q&A

### Q1: Closure क्या है और real-world example दो।

**A:** Closure एक function है जो अपने parent scope के variables को access करता है, भले ही parent execute हो चुका हो।

**Code Example:**
```javascript
function createGreeter(greeting) {
  return function(name) {
    return greeting + ", " + name + "!";
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Alice")); // Hello, Alice!
console.log(sayHi("Bob")); // Hi, Bob!
```

**Real-world:** Debounce, throttle, caching, module patterns सभी closures use करते हैं।

---

### Q2: `this` context को कैसे control करते हो?

**A:** तीन तरीके हैं:
1. **call()** - तुरंत call करो
2. **apply()** - arguments array में
3. **bind()** - नया function return करो

```javascript
function greet(greeting) {
  return greeting + ", " + this.name;
}

const person = { name: "Alice" };

// call - तुरंत
greet.call(person, "Hello");

// apply - array में
greet.apply(person, ["Hi"]);

// bind - later use
const boundGreet = greet.bind(person);
boundGreet("Hey");
```

---

### Q3: Scope Chain कैसे काम करता है?

**A:** JavaScript variables को ढूंढते समय लिखे गए scope से start करता है, फिर parent scopes में जाता है।

```javascript
const global = "Global";

function outer() {
  const outerVar = "Outer";
  
  function inner() {
    const localVar = "Local";
    // Lookup order: local → outer → global
  }
}
```

---

### Q4: Arrow function और regular function में `this` में क्या difference है?

**A:** 
- **Regular:** `this` call time पर decide होता है
- **Arrow:** `this` lexical scope से inherit होता है

```javascript
const obj = {
  value: 42,
  regular: function() { return this.value; },
  arrow: () => this.value
};

obj.regular(); // 42
obj.arrow(); // undefined (parent का 'this')
```

---

### Q5: Closure से memory leaks कैसे avoid करते हो?

**A:** Closure में सिर्फ जरूरी data रखो, बड़े objects को null assign करो।

```javascript
function process() {
  const largeData = getData(); // Big!
  
  setTimeout(() => {
    doSomething(largeData);
    largeData = null; // Cleanup!
  }, 1000);
}
```

---

## Practice Exercises

### Exercise 1: Counter बनाओ
```javascript
// Create a counter that can only be incremented/decremented internally
function createCounter(initial = 0) {
  let count = initial;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}
```

### Exercise 2: Function Factory
```javascript
// Create a power calculator
function createPowerCalculator(base) {
  return (exponent) => Math.pow(base, exponent);
}

const square = createPowerCalculator(2);
console.log(square(3)); // 8
```

### Exercise 3: Memoized Function
```javascript
// Cache results of expensive function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoize करो
const memoFib = memoize(fibonacci);
```

### Exercise 4: `this` Binding
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() { console.log("Hello, " + this.name); }
}

const person = new Person("Alice");
const greetFn = person.greet;
// greetFn(); // 'this' undefined होगा

// Fix करो bind से
const boundGreet = greetFn.bind(person);
```

### Exercise 5: Scope Chain Practice
```javascript
// Predict output
const x = "global";

function outer() {
  const x = "outer";
  
  function inner() {
    const x = "inner";
    console.log(x); // ?
  }
  
  console.log(x); // ?
  inner();
}

outer();
console.log(x); // ?

// Answer: "outer", "inner", "global"
```

---

## Key Takeaways

- **Closure = Memory रखना** - Parent scope याद रहता है
- **Scope Chain = Lookup order** - Local → Parent → Global
- **`this` = Context** - Call site से decide होता है
- **Arrow vs Regular** - Arrow में `this` fixed, regular में dynamic
- **call/apply/bind** - Explicitly `this` को control करो
- **Module Pattern** - Closures से encapsulation
- **Memory Leaks** - बड़े objects को cleanup करो

---

## Next Steps

Ab aap Closures, Scope Chain, aur `this` context master kar gaye! 

**Next Lesson:** Prototypes & Inheritance - जहाँ:
- Prototype chain
- Constructor functions
- ES6 classes
- Inheritance patterns
- और भी advanced concepts!

Padhai continue करो! 🚀

