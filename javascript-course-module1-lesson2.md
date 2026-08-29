# JAVASCRIPT COMPLETE COURSE - MODULE 1: LESSON 2

## Lesson 2: Functions & Arrow Functions

### Learning Outcomes
- [ ] Master function declarations, expressions, and arrow functions
- [ ] Understand `this` binding in different function contexts
- [ ] Learn when to use arrow functions vs regular functions
- [ ] Master function parameters, default values, and rest parameters
- [ ] Use higher-order functions effectively

---

## Beginner Explanation (Simple Language)

**Functions** JavaScript ke reusable code blocks hain. Soche ki aap ek recipe likha do, phir babar babar banate ho - ek babar recipe likho, phir dubaara use karo. Functions mein bhi same concept hai.

**Arrow Functions** ek modern aur shorter syntax hain functions likhne ke liye. Puraane tarike se `function` keyword use karte the, lekin ab `=>` (arrow) se shorter likha ja sakta hai.

Samajho ki:
- Regular function = Traditional tarika
- Arrow function = Modern, concise tarika
- Dono kaam same hi karte hain lekin `this` binding mein difference hota hai

---

## Key Concepts

### 1. Function Declaration
```javascript
// Complete declaration
function greet(name) {
  return `Hello, ${name}!`;
}
// Hoisted, can be called before declaration
```

### 2. Function Expression
```javascript
// Expression - variable mein store
const greet = function(name) {
  return `Hello, ${name}!`;
};
// Not hoisted, must declare pehle
```

### 3. Arrow Functions
```javascript
// Modern syntax - short aur clean
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Even shorter - implicit return
const greet = (name) => `Hello, ${name}!`;
```

### 4. `this` Binding
- Regular functions: `this` call context pe depend karta hai
- Arrow functions: Parent scope se `this` inherit karte hain (lexical `this`)

### 5. Function Parameters
- Default parameters
- Rest parameters (`...`)
- Destructuring parameters
- Arguments object

---

## Code Examples (Progressive)

### Example 1: Basic Function Declaration

```javascript
// Simple declaration
function add(a, b) {
  return a + b;
}

console.log(add(5, 3)); // Output: 8
console.log(add(10, 20)); // Output: 30

// Explanation: Function declare karo, phir call karo
```

**Output:**
```
8
30
```

**Explanation:** Function declare karte ho `function` keyword se, parameters define karte ho parentheses mein, body likha jaata hai curly braces mein.

---

### Example 2: Function Expression

```javascript
// Function ko variable mein store
const multiply = function(a, b) {
  return a * b;
};

console.log(multiply(4, 5)); // Output: 20

// Named function expression - error handling ke liye
const divide = function divideFunc(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

console.log(divide(10, 2)); // Output: 5
console.log(typeof divideFunc); // undefined (sirf function ke andar accessible)
```

**Output:**
```
20
5
undefined
```

**Explanation:** Function expression mein function ko variable assign karte ho. Named function expression mein naam dete ho jo sirf function body ke andar use hota hai.

---

### Example 3: Arrow Functions - Basic

```javascript
// Arrow function - simple syntax
const square = (x) => {
  return x * x;
};

console.log(square(4)); // Output: 16

// Parentheses optional agar ek parameter ho
const cube = x => {
  return x * x * x;
};

console.log(cube(3)); // Output: 27

// No parameters - parentheses necessary
const greet = () => {
  return "Hello!";
};

console.log(greet()); // Output: Hello!
```

**Output:**
```
16
27
Hello!
```

**Explanation:** Arrow function modern syntax hai. Isme `=>` use hota hai. Ek parameter ho toh parentheses optional hain.

---

### Example 4: Arrow Functions - Implicit Return

```javascript
// Implicit return - curly braces nahi, sirf arrow ke baad value
const add = (a, b) => a + b;
console.log(add(5, 3)); // Output: 8

const greet = name => `Hello, ${name}!`;
console.log(greet("Alice")); // Output: Hello, Alice!

// Multiple statements - curly braces zaroor hain
const subtract = (a, b) => {
  const result = a - b;
  return result;
};
console.log(subtract(10, 3)); // Output: 7

// Object return - parentheses se wrap karo
const createUser = (name, age) => ({ name, age });
console.log(createUser("Bob", 25)); // Output: { name: "Bob", age: 25 }
```

**Output:**
```
8
Hello, Alice!
7
{ name: "Bob", age: 25 }
```

**Explanation:** Implicit return se code shorter hota hai. Ek statement ho toh curly braces aur `return` keyword skip kar sakte ho.

---

### Example 5: Default Parameters

```javascript
// Default parameter values
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

greet(); // Output: Hello, Guest!
greet("Alice"); // Output: Hello, Alice!

// Arrow function with defaults
const discount = (price, percentage = 10) => {
  return price * (1 - percentage / 100);
};

console.log(discount(100)); // Output: 90 (10% default discount)
console.log(discount(100, 20)); // Output: 80 (20% discount)

// Default from expression
const getCurrentUser = (user = getCurrentUser) => user;
// Note: Pehle parameters execute hote hain
```

**Output:**
```
Hello, Guest!
Hello, Alice!
90
80
```

**Explanation:** Default parameters use karo toh argument pass nahi karo toh wo value use hoti hai.

---

### Example 6: Rest Parameters

```javascript
// Rest parameters - multiple arguments collect karna
function sum(...numbers) {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}

console.log(sum(1, 2, 3)); // Output: 6
console.log(sum(1, 2, 3, 4, 5)); // Output: 15

// Arrow function with rest
const concatenate = (...strings) => strings.join(" ");
console.log(concatenate("Hello", "World")); // Output: Hello World
console.log(concatenate("I", "am", "learning", "JavaScript")); // Output: I am learning JavaScript

// Rest ke saath regular parameters
function createUser(firstName, lastName, ...hobbies) {
  return {
    firstName,
    lastName,
    hobbies
  };
}

console.log(createUser("John", "Doe", "coding", "gaming", "reading"));
// Output: { firstName: "John", lastName: "Doe", hobbies: ["coding", "gaming", "reading"] }
```

**Output:**
```
6
15
Hello World
I am learning JavaScript
{ firstName: "John", lastName: "Doe", hobbies: ["coding", "gaming", "reading"] }
```

**Explanation:** Rest parameters `...` se multiple arguments ek array mein collect kar sakte ho. Last parameter se pehle hi rest parameter use kar sakte ho.

---

### Example 7: Higher-Order Functions (Functions as Arguments)

```javascript
// Function as parameter
function apply(operation, a, b) {
  return operation(a, b);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log(apply(add, 5, 3)); // Output: 8
console.log(apply(multiply, 5, 3)); // Output: 15

// Array methods - built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];

// map - transform karo
const doubled = numbers.map(num => num * 2);
console.log(doubled); // Output: [2, 4, 6, 8, 10]

// filter - sieve karo
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // Output: [2, 4]

// reduce - combine karo
const total = numbers.reduce((sum, num) => sum + num, 0);
console.log(total); // Output: 15
```

**Output:**
```
8
15
[2, 4, 6, 8, 10]
[2, 4]
15
```

**Explanation:** Higher-order functions aise functions hain jo doosre functions accept karte hain ya return karte hain. Array methods jaise `map`, `filter`, `reduce` sab higher-order functions hain.

---

### Example 8: Functions Returning Functions

```javascript
// Function returning function - closure
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // Output: 10
console.log(triple(5)); // Output: 15

// Arrow function version
const power = (exponent) => (base) => {
  let result = 1;
  for (let i = 0; i < exponent; i++) {
    result *= base;
  }
  return result;
};

const square = power(2);
const cube = power(3);

console.log(square(4)); // Output: 16
console.log(cube(2)); // Output: 8
```

**Output:**
```
10
15
16
8
```

**Explanation:** Higher-order functions doosre functions return kar sakte hain. Iska use currying ke liye hota hai.

---

### Example 9: Destructuring Parameters

```javascript
// Destructuring - object parameters ko directly access
function displayUser({ name, age, city }) {
  console.log(`${name} is ${age} years old, lives in ${city}`);
}

displayUser({ name: "Alice", age: 30, city: "Mumbai" });
// Output: Alice is 30 years old, lives in Mumbai

// Array destructuring parameters
function processCoordinates([x, y]) {
  return Math.sqrt(x * x + y * y);
}

console.log(processCoordinates([3, 4])); // Output: 5

// Default values in destructuring
function getConfig({ theme = "light", language = "en" } = {}) {
  return { theme, language };
}

console.log(getConfig()); // Output: { theme: "light", language: "en" }
console.log(getConfig({ theme: "dark" })); // Output: { theme: "dark", language: "en" }
```

**Output:**
```
Alice is 30 years old, lives in Mumbai
5
{ theme: "light", language: "en" }
{ theme: "dark", language: "en" }
```

**Explanation:** Destructuring parameters mein object ya array ko directly unpack kar sakte ho, readable code likha jaata hai.

---

### Example 10: `this` Binding - Regular vs Arrow

```javascript
// Regular function - this call context se milta hai
const user = {
  name: "Alice",
  age: 30,
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet(); // Output: Hello, I'm Alice
// "this" = user object

// Problem with callbacks
const user2 = {
  name: "Bob",
  friends: ["Charlie", "David"],
  listFriends: function() {
    this.friends.forEach(function(friend) {
      console.log(`${this.name}'s friend: ${friend}`); // "this" undefined hoga!
    });
  }
};

// user2.listFriends(); // Error: Cannot read property 'name' of undefined

// Solution 1: Arrow function use karo
const user3 = {
  name: "Charlie",
  friends: ["Diana", "Eve"],
  listFriends: function() {
    this.friends.forEach(friend => {
      console.log(`${this.name}'s friend: ${friend}`);
    });
  }
};

user3.listFriends();
// Output:
// Charlie's friend: Diana
// Charlie's friend: Eve

// Arrow functions inherit parent "this"
const person = {
  name: "David",
  greet: () => {
    // Arrow function - "this" parent scope se (global/module scope)
    console.log(`Hello, I'm ${this.name}`);
  }
};

// person.greet(); // "this" undefined (arrow mein "this" lexical)
```

**Output:**
```
Hello, I'm Alice
Charlie's friend: Diana
Charlie's friend: Eve
```

**Explanation:** Regular functions mein `this` call-time pe decide hota hai. Arrow functions mein `this` parent scope se inherit hota hai. Callbacks mein arrow functions better hain.

---

### Example 11: Function Composition

```javascript
// Chained operations
const numbers = [1, 2, 3, 4, 5];

const result = numbers
  .filter(num => num > 2) // [3, 4, 5]
  .map(num => num * 2)     // [6, 8, 10]
  .reduce((sum, num) => sum + num, 0); // 24

console.log(result); // Output: 24

// Reusable functions
const isEven = (num) => num % 2 === 0;
const double = (num) => num * 2;
const add = (a, b) => a + b;

const numbers2 = [1, 2, 3, 4, 5];
const evenTotal = numbers2
  .filter(isEven)
  .map(double)
  .reduce(add, 0);

console.log(evenTotal); // Output: 12 (2*2 + 4*2 = 12)
```

**Output:**
```
24
12
```

**Explanation:** Functions ko chain karte ho readable aur composable code likhte hain.

---

### Example 12: Function vs Arrow - Complete Comparison

```javascript
// Regular Function
function regularAdd(a, b) {
  console.log("Regular:", this);
  return a + b;
}

// Arrow Function
const arrowAdd = (a, b) => {
  console.log("Arrow:", this);
  return a + b;
};

// As object method
const calc = {
  name: "Calculator",
  regularAdd: regularAdd,
  arrowAdd: arrowAdd,
  testBoth: function() {
    console.log("Regular function:");
    this.regularAdd(5, 3);
    
    console.log("Arrow function:");
    this.arrowAdd(5, 3);
  }
};

calc.testBoth();

// Output:
// Regular function:
// Regular: { name: "Calculator", ... } (this = calc)
// Arrow function:
// Arrow: Window {} (this = parent scope)
```

**Output:**
```
Regular: { name: "Calculator", ... }
Arrow: Window {}
```

**Explanation:** Regular function context-sensitive hota hai, arrow function parent se `this` inherit karta hai.

---

### Example 13: IIFE (Immediately Invoked Function Expression)

```javascript
// IIFE - function turant execute hota hai declare karte hi
(function() {
  console.log("This runs immediately!");
})();
// Output: This runs immediately!

// IIFE with parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})("Alice");
// Output: Hello, Alice!

// IIFE with arrow function
(() => {
  const temp = "I'm temporary";
  console.log(temp);
})();
// Output: I'm temporary
// temp variable bahar accessible nahi

// IIFE pattern - var pollution avoid karte the (ab const/let ke saath zaroor nahi)
const result = (function() {
  const privateVar = "Secret";
  return {
    getSecret: () => privateVar
  };
})();

console.log(result.getSecret()); // Output: Secret
```

**Output:**
```
This runs immediately!
Hello, Alice!
I'm temporary
Secret
```

**Explanation:** IIFE pattern se immediately execute kar sakte ho aur scope isolation bana sakte ho.

---

## Real-World Use Cases

### 1. **Callback Functions - Event Handling**
```javascript
const button = document.getElementById("myButton");
button.addEventListener("click", () => {
  console.log("Button clicked!");
  // Arrow function se "this" properly bind hota hai
});
```

### 2. **Higher-Order Functions - Data Processing**
```javascript
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 }
];

// Filter adults
const adults = users.filter(user => user.age >= 30);
// Map to names only
const names = adults.map(user => user.name);
console.log(names); // ["Alice", "Charlie"]
```

### 3. **Function Composition - Pipelines**
```javascript
const pipe = (...functions) => (value) => 
  functions.reduce((acc, fn) => fn(acc), value);

const addTax = (price) => price * 1.18;
const roundDown = (price) => Math.floor(price);
const formatCurrency = (price) => `$${price}`;

const priceCalculator = pipe(addTax, roundDown, formatCurrency);
console.log(priceCalculator(100)); // $118
```

### 4. **Currying - Partial Application**
```javascript
const multiply = (a) => (b) => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## Common Mistakes

### ❌ Mistake 1: Using Arrow Function as Object Method
```javascript
// WRONG - "this" undefined
const obj = {
  value: 42,
  getValue: () => this.value // "this" global/undefined
};
console.log(obj.getValue()); // undefined

// CORRECT
const obj = {
  value: 42,
  getValue: function() { // Regular function
    return this.value;
  }
};
console.log(obj.getValue()); // 42
```

### ❌ Mistake 2: Forgetting Parentheses in Arrow Functions
```javascript
// WRONG - returns function, not value
const add = (a, b) => a + b; // Correct
const wrong = a, b => a + b; // Syntax error!

// CORRECT
const add = (a, b) => a + b;
```

### ❌ Mistake 3: Object Return in Arrow Function
```javascript
// WRONG - curly braces mein object likho toh return statement zaroor
const createUser = (name) => { name }; // Returns undefined

// CORRECT - Parentheses mein wrap karo
const createUser = (name) => ({ name });
console.log(createUser("Alice")); // { name: "Alice" }
```

### ❌ Mistake 4: Using `arguments` in Arrow Function
```javascript
// WRONG - arrow functions mein arguments nahi hota
const arrow = () => {
  console.log(arguments); // undefined
};

// CORRECT - rest parameters use karo
const arrow = (...args) => {
  console.log(args);
};
arrow(1, 2, 3); // [1, 2, 3]
```

### ❌ Mistake 5: Not Understanding Hoisting
```javascript
// WRONG - function expression hoisted nahi hota
console.log(add(5, 3)); // TypeError: add is not a function
const add = (a, b) => a + b;

// CORRECT - function declaration hoisted hota hai
console.log(add(5, 3)); // 8
function add(a, b) { return a + b; }
```

---

## Best Practices

1. **Default to Arrow Functions** - Modern, concise, closure-friendly
2. **Use Regular Functions for Methods** - `this` binding ke liye
3. **Prefer Implicit Return** - Simple functions ke liye readable
4. **Use Destructuring** - Parameters ko clean rakho
5. **Avoid `arguments`** - Rest parameters use karo
6. **Compose Functions** - Reusable, testable code
7. **Use Default Parameters** - Undefined checks avoid karo
8. **One Function = One Job** - Single responsibility principle

---

## Interview Q&A

### Q1: What's the difference between Function Declaration, Expression, and Arrow Function?

**A:** Teen main differences:

| Type | Syntax | Hoisting | `this` | Use Case |
|------|--------|----------|--------|----------|
| Declaration | `function name() {}` | Full hoisting | Dynamic | General code |
| Expression | `const f = function() {}` | Not hoisted | Dynamic | Callbacks, assignments |
| Arrow | `const f = () => {}` | Not hoisted | Lexical | Modern, callbacks |

**Code Example:**
```javascript
// Declaration - hoisted
console.log(decl()); // Works!
function decl() { return "declaration"; }

// Expression - not hoisted
// console.log(expr()); // Error!
const expr = function() { return "expression"; };

// Arrow - not hoisted, shorter syntax
const arrow = () => "arrow";
```

**Follow-up:** "Arrow function modern JavaScript mein preferred hai callbacks ke liye."

---

### Q2: Explain `this` binding in Arrow Functions vs Regular Functions.

**A:** `this` binding mein fundamental difference:

**Regular Functions:** `this` call-time pe decide hota hai (dynamic binding)
```javascript
const obj = {
  value: 42,
  test: function() {
    console.log(this.value); // obj.value = 42
  }
};
obj.test(); // "this" = obj
```

**Arrow Functions:** `this` lexical scope se inherit hota hai (static binding)
```javascript
const obj = {
  value: 42,
  test: () => {
    console.log(this.value); // parent "this", usually undefined
  }
};
obj.test(); // "this" = parent scope, not obj
```

**Practical Example:**
```javascript
const user = {
  name: "Alice",
  hobbies: ["coding", "gaming"],
  showHobbies: function() {
    // Regular function - "this" = user object
    this.hobbies.forEach(function(hobby) {
      // Regular nested - "this" = undefined
      // console.log(`${this.name}'s hobby: ${hobby}`); // Error!
    });
    
    this.hobbies.forEach(hobby => {
      // Arrow - "this" parent se (user object)
      console.log(`${this.name}'s hobby: ${hobby}`); // Works!
    });
  }
};

user.showHobbies();
// Output:
// Alice's hobby: coding
// Alice's hobby: gaming
```

**Follow-up:** "Callbacks mein arrow function use karo, methods mein regular function."

---

### Q3: What are Higher-Order Functions?

**A:** Higher-order functions aise functions hain jo:
1. Doosre functions accept karte hain (parameters mein)
2. Ya functions return karte hain

**Code Example:**
```javascript
// Function as parameter
function applyOperation(a, b, operation) {
  return operation(a, b);
}

applyOperation(5, 3, (x, y) => x + y); // 8
applyOperation(5, 3, (x, y) => x * y); // 15

// Array methods - built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];

numbers.map(x => x * 2);     // Transform
numbers.filter(x => x > 2);  // Filter
numbers.reduce((a, b) => a + b, 0); // Combine

// Function returning function
function createMultiplier(factor) {
  return (number) => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
```

**Follow-up:** "Higher-order functions code ko reusable aur flexible banate hain."

---

### Q4: Explain Currying with an Example.

**A:** Currying ek technique hai jisme multi-parameter function ko single-parameter functions ke chain mein convert karte hain.

**Code Example:**
```javascript
// Normal function
const add = (a, b, c) => a + b + c;
console.log(add(1, 2, 3)); // 6

// Curried version
const curriedAdd = (a) => (b) => (c) => a + b + c;
console.log(curriedAdd(1)(2)(3)); // 6

// Partial application
const add1 = curriedAdd(1);
const add1and2 = add1(2);
const result = add1and2(3); // 6

// Practical - Event handler with state
const handleClick = (userId) => (event) => {
  console.log(`User ${userId} clicked`);
};

const handleAliceClick = handleClick("Alice");
// Later, attach to button
button.addEventListener("click", handleAliceClick);
```

**Follow-up:** "Currying se partial application possible hota hai, useful libraries mein."

---

### Q5: What are Default Parameters and Rest Parameters?

**A:** Dono different purposes serve karte hain:

**Default Parameters:** Function call mein argument nahi diya toh use hone waali value

**Rest Parameters:** Multiple arguments ko array mein collect karna

**Code Example:**
```javascript
// Default parameters
function greet(name = "Guest", greeting = "Hello") {
  console.log(`${greeting}, ${name}!`);
}

greet(); // Hello, Guest!
greet("Alice"); // Hello, Alice!
greet("Bob", "Hi"); // Hi, Bob!

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3); // 6
sum(1, 2, 3, 4, 5); // 15

// Combined
function createUser(firstName, lastName, ...tags) {
  return { firstName, lastName, tags };
}

createUser("John", "Doe", "admin", "moderator");
// { firstName: "John", lastName: "Doe", tags: ["admin", "moderator"] }
```

**Follow-up:** "Rest parameters sirf last position mein use ho sakte hain."

---

## Practice Exercises

### Exercise 1: Arrow Function Conversion
```javascript
// Convert to arrow function
function multiply(a, b) {
  return a * b;
}

// Answer:
const multiply = (a, b) => a * b;
```

### Exercise 2: Default Parameters
```javascript
// Add default parameters
function createPost(title, content, author) {
  return { title, content, author };
}

// Should work as:
// createPost("Hello") => { title: "Hello", content: "Default content", author: "Anonymous" }

// Answer:
const createPost = (title, content = "Default content", author = "Anonymous") => 
  ({ title, content, author });
```

### Exercise 3: Rest Parameters
```javascript
// Create function that accepts variable arguments
function logAll(first, ...rest) {
  console.log("First:", first);
  console.log("Rest:", rest);
}

logAll("a", "b", "c", "d");
// Output:
// First: a
// Rest: ["b", "c", "d"]
```

### Exercise 4: This Binding
```javascript
// Fix "this" binding issue
const user = {
  name: "Alice",
  friends: ["Bob", "Charlie"],
  displayFriends: function() {
    this.friends.forEach(friend => {
      // Use arrow function for proper "this"
      console.log(`${this.name}'s friend: ${friend}`);
    });
  }
};

user.displayFriends();
```

### Exercise 5: Higher-Order Function
```javascript
// Create a function that returns another function
function createGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

const sayHello = createGreeter("Hello");
console.log(sayHello("Alice")); // Hello, Alice!
```

---

## Key Takeaways

- **Arrow Functions > Regular Functions** - Modern projects mein preferred
- **`this` Matters** - Object methods mein regular function, callbacks mein arrow
- **Higher-Order Functions Powerful** - Code reuse aur composition
- **Default Parameters** - Undefined checks avoid karo
- **Rest Parameters** - Flexible function signatures
- **Function Composition** - Readable, testable code
- **Destructuring Parameters** - Clean function interfaces
- **Implicit Return** - Arrow functions ko shorter rakhta hai

---

## Next Steps

Ab aap Functions aur Arrow Functions complete samajh gaye!

**Next Lesson:** Callbacks, Promises, Async/Await - jisme:
- Callback functions aur callback hell
- Promises - then, catch, finally
- Async/Await syntax aur error handling
- Promise.all, Promise.race patterns

Padhai continue rakho! 🚀

