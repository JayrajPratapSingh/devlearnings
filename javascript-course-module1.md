# JAVASCRIPT COMPLETE COURSE - MODULE 1: FUNDAMENTALS

## Module 1: Fundamentals (Days 1-4)

---

## Lesson 1: Variables, Scope, and Hoisting

### Learning Outcomes
- [ ] Understand different variable declaration methods (var, let, const)
- [ ] Master variable scope (global, function, block scope)
- [ ] Learn JavaScript hoisting mechanism
- [ ] Avoid common scope and hoisting pitfalls
- [ ] Write cleaner, more predictable JavaScript code

---

## Beginner Explanation (Simple Language)

Variables JavaScript ke containers hain jo values ko store karte hain. Imagine karo ki ek cupboard hai jisme aap apne belongings rakhte ho - variables bhi waisa hi kaam karte hain.

**Scope** matlab yeh nikalne ki zaroorat hai ki variable kahan accessible hai. Agar aapne kisi room mein kuch rakha hai, toh wo sirf us room mein mil jayega, ghar ke baaki rooms mein nahi. JavaScript mein bhi same concept hai.

**Hoisting** JavaScript ka ek interesting behavior hai jisme declarations ko function/script ke top par move kiya jaata hai. Imagine karo ki aap kisi test mein likha hua answer submit karte ho, lekin teacher pehle se sabke forms scan karke rakh leta hai - declarations ka concept almost waisa hi hai!

---

## Key Concepts

### 1. Variable Declaration Methods
- **`var`**: Puraana tarika, function-scoped, re-declarable. Avoid karo agar modern JavaScript likho.
- **`let`**: ES6 mein aaya, block-scoped, temporally dead zone hai. Safe aur predictable.
- **`const`**: Default choice, block-scoped, reassign nahi kar sakte. Object/array modify ho sakta hai lekin reference nahi badal sakte.

### 2. Scope Types
- **Global Scope**: Code ke kahim se bhi accessible
- **Function Scope**: Function ke andar hi accessible (especially `var` ke liye)
- **Block Scope**: `{}` ke andar hi accessible (`let`, `const`)
- **Lexical Scope**: Inner function outer function ke variables access kar sakta hai

### 3. Hoisting Mechanism
JavaScript code execute hone se pehle parsing phase hota hai. Is phase mein:
- Function declarations puri tarah se hoist hote hain
- Variable declarations hoist hote hain lekin initialization nahi
- `let` aur `const` ke liye Temporal Dead Zone (TDZ) hota hai

---

## Code Examples (Progressive - Beginner to Advanced)

### Example 1: Basic Variable Declaration

```javascript
// Puraana tarika - var
var name = "Raj";
console.log(name); // Output: Raj

// Modern tarika - let
let age = 25;
console.log(age); // Output: 25

// Constant - recommended
const city = "Mumbai";
console.log(city); // Output: Mumbai

// Yeh error ayega - const reassign nahi ho sakta
// city = "Delhi"; // ❌ TypeError: Assignment to constant variable
```

**Output:** 
```
Raj
25
Mumbai
```

**Explanation:** Teen tarike hain variables declare karne ka. `const` sab se safe hai kyunki isme reassignment nahi kar sakte. `let` bhi good hai. `var` se avoid karo.

---

### Example 2: Global Scope - Variables Anywhere Accessible

```javascript
// Global scope mein declare
const globalVar = "I'm global";

function checkGlobal() {
  console.log(globalVar); // Global variable access ho gaya
  return globalVar;
}

console.log(checkGlobal()); // Output: I'm global
console.log(globalVar); // Output: I'm global (function ke bahar bhi accessible)
```

**Output:**
```
I'm global
I'm global
```

**Explanation:** Global scope mein jo bhi declare ho, woh pura program mein accessible hota hai.

---

### Example 3: Function Scope with `var`

```javascript
// Function scope concept
function testFunctionScope() {
  var functionScoped = "Inside function";
  console.log(functionScoped); // Output: Inside function
}

testFunctionScope();

// Yeh error ayega - var function scope mein bounded hai
// console.log(functionScoped); // ❌ ReferenceError: functionScoped is not defined
```

**Output:**
```
Inside function
ReferenceError: functionScoped is not defined
```

**Explanation:** `var` function ke andar declare kiya toh woh function ke bahar accessible nahi. Yeh function scope hai.

---

### Example 4: Block Scope with `let` and `const`

```javascript
// Block scope - if statement, for loop, etc.
if (true) {
  let blockScopedLet = "I'm block scoped";
  const blockScopedConst = "Me too!";
  console.log(blockScopedLet); // Output: I'm block scoped
  console.log(blockScopedConst); // Output: Me too!
}

// if block ke bahar access nahi hoga
// console.log(blockScopedLet); // ❌ ReferenceError
// console.log(blockScopedConst); // ❌ ReferenceError

// For loop example
for (let i = 0; i < 3; i++) {
  console.log("Loop iteration:", i);
}
// Loop ke bahar i access nahi hoga
// console.log(i); // ❌ ReferenceError: i is not defined
```

**Output:**
```
I'm block scoped
Me too!
Loop iteration: 0
Loop iteration: 1
Loop iteration: 2
ReferenceError: i is not defined
```

**Explanation:** `let` aur `const` block-scoped hain. `{}` ke andar declare karo toh bahar access nahi milega.

---

### Example 5: Hoisting - Function Declarations

```javascript
// Yeh code kaam karega! Function declaration hoist hota hai
console.log(add(5, 3)); // Output: 8

function add(a, b) {
  return a + b;
}

// JavaScript is code ko aise interpret karta hai:
// 1. Function declaration ko top par move karta hai
// 2. Phir baaki code execute karta hai
```

**Output:**
```
8
```

**Explanation:** Function declarations puri tarah hoist hote hain toh inhe declaration se pehle call kar sakte ho.

---

### Example 6: Hoisting - Variable Declarations with `var`

```javascript
console.log(x); // Output: undefined (hoisted but not initialized)
var x = 10;
console.log(x); // Output: 10

// JavaScript is code ko aise interpret karta hai:
// var x;           // Declaration hoist
// console.log(x);  // undefined (declared but not initialized)
// x = 10;          // Initialization
// console.log(x);  // 10
```

**Output:**
```
undefined
10
```

**Explanation:** `var` declaration hoist hota hai lekin initialization nahi. Issiliye `undefined` milta hai.

---

### Example 7: Temporal Dead Zone (TDZ) with `let`

```javascript
// Temporal Dead Zone
console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 20;

// let bhi hoist hota hai lekin TDZ mein hota hai
// TDZ se declaration line tak access nahi kar sakte
```

**Output:**
```
ReferenceError: Cannot access 'y' before initialization
```

**Explanation:** `let` aur `const` bhi hoist hote hain lekin initialization se pehle access karo toh reference error ayega. Iska fayda hai - accidental bugs se bachata hai.

---

### Example 8: Lexical Scope (Closures)

```javascript
const outer = "I'm outer";

function outerFunction() {
  const outerVar = "Outer variable";
  
  function innerFunction() {
    const innerVar = "Inner variable";
    console.log(innerVar);    // Inner scope ka variable
    console.log(outerVar);    // Outer function scope ka variable
    console.log(outer);       // Global scope ka variable
  }
  
  innerFunction();
}

outerFunction();
```

**Output:**
```
Inner variable
Outer variable
I'm outer
```

**Explanation:** Inner function apne parent functions ke variables access kar sakta hai. Isme JavaScript lexical scope follow karta hai - jo variables define kab code likha tha ussi ke basis par access hota hai, execution order se nahi.

---

### Example 9: Variable Shadowing

```javascript
const name = "Global Name";

function showName() {
  const name = "Function Name"; // Same name declare, shadowing
  console.log(name); // Output: Function Name (nearest scope ka)
  
  if (true) {
    const name = "Block Name"; // Again shadowing
    console.log(name); // Output: Block Name (nearest scope)
  }
  
  console.log(name); // Output: Function Name (phir se function scope)
}

showName();
console.log(name); // Output: Global Name
```

**Output:**
```
Function Name
Block Name
Function Name
Global Name
```

**Explanation:** Same name ko different scopes mein declare kar sakte ho. JavaScript hmesha nearest scope se value leta hai. Isse bug aa sakte hain, isliye meaningful names dena chahiye.

---

### Example 10: Re-declaration with `var` vs `let`/`const`

```javascript
// var ko re-declare kar sakte ho
var x = 1;
var x = 2; // No error
console.log(x); // Output: 2

// let aur const ko re-declare nahi kar sakte
let y = 1;
// let y = 2; // ❌ SyntaxError: Identifier 'y' has already been declared

const z = 1;
// const z = 2; // ❌ SyntaxError: Identifier 'z' has already been declared
```

**Output:**
```
2
SyntaxError
```

**Explanation:** `var` ko re-declare kar sakte ho jo confusing bug la sakta hai. `let` aur `const` dono re-declaration allow nahi karte - yeh safer hai.

---

### Example 11: `const` with Objects and Arrays

```javascript
const user = {
  name: "Alice",
  age: 30
};

// const reference change nahi kar sakte
// user = {}; // ❌ TypeError

// Lekin object ke properties modify kar sakte ho
user.name = "Bob";
user.age = 31;
console.log(user); // Output: { name: "Bob", age: 31 }

// Array elements bhi change kar sakte ho
const colors = ["red", "blue"];
colors[0] = "green";
colors.push("yellow");
console.log(colors); // Output: ["green", "blue", "yellow"]
```

**Output:**
```
{ name: "Bob", age: 31 }
["green", "blue", "yellow"]
```

**Explanation:** `const` reference ko protect karta hai lekin internal values change kar sakte ho. Iska matlab properties aur array elements modify ho sakte hain.

---

### Example 12: Hoisting with `let` in Loop (Important!)

```javascript
// ❌ WRONG - var se loop problem aata hai
var funcVar = [];
for (var i = 0; i < 3; i++) {
  funcVar.push(function() {
    return i;
  });
}

console.log(funcVar[0]()); // Output: 3 (not 0!)
console.log(funcVar[1]()); // Output: 3 (not 1!)
console.log(funcVar[2]()); // Output: 3 (not 2!)

// ✅ CORRECT - let use karo
var funcLet = [];
for (let j = 0; j < 3; j++) {
  funcLet.push(function() {
    return j;
  });
}

console.log(funcLet[0]()); // Output: 0
console.log(funcLet[1]()); // Output: 1
console.log(funcLet[2]()); // Output: 2
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

**Explanation:** `var` loop mein global/function scope create karta hai isliye `i` lastIteration waali value ke saath store hota hai. `let` block scope create karta hai, har iteration ka apna `i` hota hai.

---

### Example 13: Const with Reassignment Attempt

```javascript
const PI = 3.14159;
console.log(PI); // Output: 3.14159

// Reassign karne ki koshish
try {
  PI = 3.14; // ❌ TypeError
} catch (error) {
  console.log("Error:", error.message); // Output: Error: Assignment to constant variable
}

// Initialization ke bina const
// const empty; // ❌ SyntaxError: Missing initializer in const declaration
```

**Output:**
```
3.14159
Error: Assignment to constant variable
SyntaxError: Missing initializer in const declaration
```

**Explanation:** `const` ko initialize zaroor karna padta hai aur reassign nahi kar sakte.

---

## Real-World Use Cases

### 1. **Global Configuration**
```javascript
// Global scope se access karte hain
const API_URL = "https://api.example.com";
const DATABASE_HOST = "localhost";

function fetchData() {
  // Anywhere se access kar sakte ho
  return fetch(API_URL);
}
```

### 2. **Function Scope with Temporary Variables**
```javascript
function processOrder(order) {
  const total = order.price * order.quantity; // Function scope
  const tax = total * 0.1; // Only isme zarurat hai
  return total + tax; // Processing ke baad result return
}
// total aur tax function ke bahar inaccessible - memory efficient
```

### 3. **Block Scope in Conditional Logic**
```javascript
if (userLoggedIn) {
  const userPrivileges = fetchPrivileges(); // Sirf if block mein zarurat
  displayUserMenu(userPrivileges);
}
// userPrivileges yahan accessible nahi - data isolation
```

### 4. **Closures in Event Handlers**
```javascript
function setupButtons() {
  for (let i = 0; i < 3; i++) {
    const button = document.getElementById(`btn-${i}`);
    const value = i; // Block scoped
    button.addEventListener('click', () => {
      console.log(`Button ${value} clicked`);
    });
  }
}
// Har button ka apna value closure mein rakhta hai
```

---

## Common Mistakes

### ❌ Mistake 1: Using `var` in Loops
```javascript
// WRONG
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints: 3, 3, 3
}

// CORRECT
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints: 0, 1, 2
}
```

### ❌ Mistake 2: Accessing Variable Before Initialization with `let`
```javascript
// WRONG
console.log(x); // ❌ ReferenceError
let x = 10;

// CORRECT
let x = 10;
console.log(x); // ✅ 10
```

### ❌ Mistake 3: Reassigning `const`
```javascript
// WRONG
const user = { name: "Alice" };
user = { name: "Bob" }; // ❌ TypeError

// CORRECT
const user = { name: "Alice" };
user.name = "Bob"; // ✅ Properties modify kar sakte ho
```

### ❌ Mistake 4: Re-declaring with `let`
```javascript
// WRONG
let x = 1;
let x = 2; // ❌ SyntaxError

// CORRECT
let x = 1;
x = 2; // ✅ Reassign karo, re-declare nahi
```

### ❌ Mistake 5: Ignoring Shadowing Issues
```javascript
// WRONG - Confusing code
let count = 0;
{
  let count = 5; // Same name, different value
  console.log(count); // 5
}
console.log(count); // 0 - Unexpected!

// CORRECT
let totalCount = 0;
{
  let localCount = 5;
  totalCount += localCount;
}
console.log(totalCount); // 5 - Clear intention
```

---

## Best Practices

1. **Default to `const`** - Isme reassignment nahi hogi, accidents se bachega
2. **Use `let` for Variables** - Jab change karna ho toh `let` use karo
3. **Avoid `var`** - Puraana tarika, confusing scope rules
4. **Meaningful Names** - Shadowing issues se bachne ke liye clear names rakho
5. **Initialize Always** - Declare aur initialize together karo
6. **Scope Minimize** - Variable ko tightest scope mein declare karo
7. **No Global Pollution** - Unnecessary global variables mat banao
8. **Block Scope Advantage** - `let`/`const` se block scope use karo

---

## Interview Q&A

### Q1: What's the difference between `var`, `let`, and `const`?

**A:** Teen main differences hain:

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Re-declaration | Yes | No | No |
| Re-assignment | Yes | Yes | No |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Temporal Dead Zone | No | Yes | Yes |

**Code Example:**
```javascript
// var - function scoped, re-declarable
function test1() {
  var x = 1;
  var x = 2; // OK
  console.log(x); // 2
}

// let - block scoped, not re-declarable
{
  let y = 1;
  // let y = 2; // Error!
  y = 2; // OK - reassign
  console.log(y); // 2
}

// const - block scoped, not re-assignable
{
  const z = 1;
  // z = 2; // Error!
  console.log(z); // 1
}
```

**Follow-up:** "Toh default mein `const` use karo, jab change karna ho toh `let`, aur `var` kabhi nahi."

---

### Q2: What is Hoisting in JavaScript?

**A:** Hoisting matlab JavaScript engine code execute karne se pehle ek parsing phase mein function declarations aur variable declarations ko scope ke top par move karta hai.

**Code Example:**
```javascript
// This works - hoisting ke wajah se
console.log(add(5, 3)); // 8

function add(a, b) {
  return a + b;
}

// JavaScript isko aise interpret karta hai:
function add(a, b) {
  return a + b;
}
console.log(add(5, 3)); // 8

// Variable hoisting
console.log(name); // undefined (not error!)
var name = "Alice";
console.log(name); // Alice

// let/const hoisting (Temporal Dead Zone)
// console.log(age); // ReferenceError!
let age = 25;
```

**Follow-up:** "Hoisting ke wajah se function ko call karte ho declaration se pehle bhi, lekin var ke saath careful rehna chahiye."

---

### Q3: What is Scope and Why is it Important?

**A:** Scope matlab define karna ki variable kahan accessible hai. JavaScript mein 4 types ke scope hain:

1. **Global Scope** - Pura code mein accessible
2. **Function Scope** - Sirf function ke andar accessible
3. **Block Scope** - Sirf `{}` ke andar accessible
4. **Lexical Scope** - Parent scope ka access

**Code Example:**
```javascript
const global = "I'm global";

function outer() {
  const outerVar = "Outer";
  
  function inner() {
    const innerVar = "Inner";
    
    console.log(innerVar); // Inner - Own scope
    console.log(outerVar); // Outer - Parent scope (lexical)
    console.log(global); // I'm global - Global scope
  }
  
  inner();
  // console.log(innerVar); // Error - inner scope se bahar
}

outer();

// Scope ka fayda:
// 1. Memory efficient - variables garbage collect ho jaate hain
// 2. Data privacy - hidden variables
// 3. Naming conflicts avoid hote hain
```

**Follow-up:** "Block scope ka benefit hai variable ko apne exact scope mein rakhna, memory efficient hota hai."

---

### Q4: Explain Closures in JavaScript with an Example.

**A:** Closure ek function hota hai jo apne parent function ke variables ko "remember" karta hai. Iska matlab function execute hone ke baad bhi variables memory mein rehte hain.

**Code Example:**
```javascript
function outer(x) {
  // Inner function outer ke x ko remember karta hai
  function inner() {
    console.log(x);
  }
  return inner;
}

const closure1 = outer(10);
const closure2 = outer(20);

closure1(); // 10 - apna x remember karta hai
closure2(); // 20 - apna x remember karta hai

// Practical example - Counter
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
// count variable sirf methods se accessible hai - encapsulation!
```

**Follow-up:** "Closures se data privacy aur encapsulation implement kar sakte ho, ek tarah se private variables ban jaate hain."

---

### Q5: What is Temporal Dead Zone (TDZ)?

**A:** Temporal Dead Zone woh time period hota hai declaration line se pehle jab `let` aur `const` variables accessible nahi hote, bhale hoot hoisting bhi hote ho.

**Code Example:**
```javascript
// TDZ starts here
// console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization

let x = 10; // TDZ ends here

console.log(x); // ✅ 10

// var ke saath aise nahi hota
console.log(y); // undefined (initialization ke bina)
var y = 20;
console.log(y); // 20

// Practical problem:
function test() {
  console.log(typeof z); // ❌ ReferenceError (not undefined!)
  let z = 30;
}
test();

// typeof normally safe hota hai, lekin let/const ke TDZ mein error ayega!
```

**Follow-up:** "TDZ ka benefit hai - accidental access se bachata hai aur code ko predictable banata hai."

---

## Practice Exercises

### Exercise 1: Scope Analysis
```javascript
// Predict output
let a = "global";

function func1() {
  let a = "func1";
  console.log(a); // Output: ?
}

{
  let a = "block";
  console.log(a); // Output: ?
}

console.log(a); // Output: ?
func1();

// Answer: "block", "func1", "global"
```

### Exercise 2: Hoisting Order
```javascript
// Predict output order
console.log(typeof x); // ?
console.log(typeof func); // ?

var x = 10;

function func() {
  return "I'm a function";
}

// Answer: "undefined", "function"
```

### Exercise 3: Closure Challenge
```javascript
// Fix this code - har button apna number print kare
const buttons = document.querySelectorAll('button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    console.log(i); // Hmesha last value print hoga
  });
}

// Fix: let use karo ya IIFE
```

### Exercise 4: `const` Behavior
```javascript
// Kya error ayega?
const obj = { name: "Alice" };
obj.name = "Bob"; // Line 1
obj.age = 30; // Line 2
obj = {}; // Line 3

// Answer: Line 3 par error ayega, Line 1-2 OK hain
```

### Exercise 5: TDZ Detection
```javascript
// Kaunsa error ayega?
try {
  console.log(x);
  let x = 5;
} catch (e) {
  console.log(e.message);
}

// Answer: "Cannot access 'x' before initialization"
```

---

## Key Takeaways

- **Choose Wisely:** Default to `const`, need change toh `let`, `var` kabhi nahi
- **Understand Scope:** Variables ko nearest scope mein declare karo
- **Hoisting Matters:** Functions hoist hote hain lekin variables ka initialization nahi
- **Closures Powerful:** Lexical scope se data privacy aur encapsulation possible hai
- **TDZ Protection:** `let`/`const` accidental access se bachate hain
- **Avoid Shadowing:** Clear naming conventions rakho confusion avoid karne ke liye
- **Memory Efficient:** Smaller scope variables ko faster garbage collect kiya jaata hai
- **Best Practice:** Modern JavaScript mein `const` + `let` use karo, `var` se avoid karo

---

## Next Steps

Ab aap Variables, Scope, aur Hoisting samajh gaye! 

**Next Lesson:** Functions & Arrow Functions - jisme:
- Function declarations vs expressions
- Arrow functions aur unke benefits
- Callback functions
- Function parameters aur arguments

Padhai continue rakho! 🚀

