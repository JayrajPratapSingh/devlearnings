# JAVASCRIPT COMPLETE COURSE - MODULE 2: LESSON 2

## Lesson 2: Prototypes & Inheritance

### Learning Outcomes
- [ ] Understand prototype chain and how it works
- [ ] Learn constructor functions and `new` keyword
- [ ] Master ES6 classes
- [ ] Understand different inheritance patterns
- [ ] Use `Object.create()` effectively
- [ ] Implement proper inheritance

---

## Beginner Explanation (Simple Language)

JavaScript में सब कुछ **objects** से शुरू होता है। और हर object का एक **prototype** होता है - जैसे एक blueprint।

Imagine करो: Template पर एक डिज़ाइन है। अब नए design बनाते हो तो पहले template से copy लेते हो। JavaScript में भी हर object अपने prototype से properties inherit करता है।

**Prototype Chain** - जब property नहीं मिली तो parent prototype में ढूंढो, फिर उसके parent में।

**Inheritance** - बड़े object की properties छोटे objects में आती हैं।

**Constructor Functions** - Functions जो `new` keyword से objects बनाते हैं।

**ES6 Classes** - Modern syntax, लेकिन internally prototype chain ही काम करती है।

---

## Key Concepts

### 1. Prototype Basics
हर JavaScript object में `__proto__` property होती है जो prototype को point करती है।

### 2. Constructor Functions
```javascript
function Person(name) {
  this.name = name;
}
const person = new Person("Alice"); // Constructor call
```

### 3. Prototype Methods
```javascript
Person.prototype.greet = function() {
  return "Hello, " + this.name;
};
```

### 4. Inheritance Chain
```
Instance → Constructor.prototype → Object.prototype → null
```

### 5. ES6 Classes
```javascript
class Person {
  constructor(name) { this.name = name; }
  greet() { return "Hello, " + this.name; }
}
```

---

## Code Examples (Progressive)

### Example 1: Basic Prototype और Property Access

```javascript
// Object literals में prototype
const person = {
  name: "Alice",
  greet: function() {
    return "Hello, " + this.name;
  }
};

console.log(person.name); // Alice (own property)
console.log(person.toString); // [Function: toString] (inherited from Object.prototype)

// toString prototype se आया है!
console.log(person.toString()); // [object Object]
```

**Output:**
```
Alice
[Function: toString]
[object Object]
```

**Explanation:** Objects के properties दो types के होते हैं - own properties और inherited (prototype से)।

---

### Example 2: Constructor Function और `new` Keyword

```javascript
// Constructor function
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
  this.year = 2024;
}

// नई instance बनाओ 'new' से
const car1 = new Car("Toyota", "Camry");
const car2 = new Car("Honda", "Civic");

console.log(car1.brand); // Toyota
console.log(car2.brand); // Honda
console.log(car1.year); // 2024

// typeof check करो
console.log(typeof car1); // object
console.log(car1 instanceof Car); // true
```

**Output:**
```
Toyota
Honda
2024
object
true
```

**Explanation:** `new` keyword से:
1. नया empty object बनता है
2. `this` उस object को point करता है
3. Object constructor.prototype से inherit करता है
4. Object return होता है

---

### Example 3: Prototype Methods जोड़ो

```javascript
// Constructor
function Animal(name) {
  this.name = name;
}

// Methods prototype में जोड़ो
Animal.prototype.speak = function() {
  return this.name + " makes a sound";
};

Animal.prototype.sleep = function() {
  return this.name + " is sleeping";
};

const dog = new Animal("Dog");
const cat = new Animal("Cat");

console.log(dog.speak()); // Dog makes a sound
console.log(cat.speak()); // Cat makes a sound
console.log(dog.sleep()); // Dog is sleeping

// Methods सभी instances share करते हैं!
console.log(dog.speak === cat.speak); // true (same function)
```

**Output:**
```
Dog makes a sound
Cat makes a sound
Dog is sleeping
true
```

**Explanation:** Prototype methods सभी instances share करते हैं - memory efficient!

---

### Example 4: Prototype Chain - Lookup Order

```javascript
function Vehicle(type) {
  this.type = type;
}

Vehicle.prototype.getType = function() {
  return this.type;
};

// Check करो क्या हर level पर property है
const car = new Vehicle("Car");

console.log(car.hasOwnProperty('type')); // true (own property)
console.log(car.hasOwnProperty('getType')); // false (inherited)

// Lookup करो
console.log(car.type); // Car (own property)
console.log(car.getType()); // Car (from prototype)
console.log(car.toString()); // [object Object] (from Object.prototype)

// Prototype chain को देखो
console.log(car.__proto__ === Vehicle.prototype); // true
console.log(Vehicle.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null (chain का end)
```

**Output:**
```
true
false
Car
Car
[object Object]
true
true
null
```

**Explanation:** Property lookup - own → prototype → Object.prototype → null

---

### Example 5: Constructor Function Inheritance

```javascript
// Parent constructor
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return this.name + " makes a sound";
};

// Child constructor
function Dog(name, breed) {
  Animal.call(this, name); // Parent constructor को call करो
  this.breed = breed;
}

// Inheritance setup करो
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Child-specific methods
Dog.prototype.bark = function() {
  return this.name + " barks";
};

const dog = new Dog("Max", "Golden Retriever");
console.log(dog.name); // Max
console.log(dog.breed); // Golden Retriever
console.log(dog.speak()); // Max makes a sound
console.log(dog.bark()); // Max barks
```

**Output:**
```
Max
Golden Retriever
Max makes a sound
Max barks
```

**Explanation:** Inheritance के लिए parent को call करो, फिर `Object.create()` से prototype link करो।

---

### Example 6: ES6 Classes - Modern Syntax

```javascript
// ES6 class
class Person {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Instance method
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  // Static method (class पर)
  static createAnonymous() {
    return new Person("Anonymous", 0);
  }
  
  // Getter
  get details() {
    return `${this.name}, ${this.age} years old`;
  }
  
  // Setter
  set age(value) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  }
  
  get age() {
    return this._age;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet()); // Hello, I'm Alice
console.log(person.details); // Alice, 30 years old
console.log(Person.createAnonymous().name); // Anonymous
```

**Output:**
```
Hello, I'm Alice
Alice, 30 years old
Anonymous
```

**Explanation:** ES6 classes syntactic sugar हैं - internally prototype chain ही काम करती है।

---

### Example 7: Class Inheritance - extends

```javascript
// Parent class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return this.name + " makes a sound";
  }
}

// Child class
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Parent constructor को call करो
    this.breed = breed;
  }
  
  speak() {
    return this.name + " barks"; // Override
  }
  
  getInfo() {
    return `${this.name} is a ${this.breed}`;
  }
}

const dog = new Dog("Max", "Labrador");
console.log(dog.name); // Max
console.log(dog.speak()); // Max barks (overridden)
console.log(dog.getInfo()); // Max is a Labrador
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true (inheritance!)
```

**Output:**
```
Max
Max barks
Max is a Labrador
true
true
```

**Explanation:** `extends` से inheritance setup होता है। `super()` parent को call करता है।

---

### Example 8: Method Overriding और super

```javascript
class Vehicle {
  constructor(type) {
    this.type = type;
  }
  
  describe() {
    return `This is a ${this.type}`;
  }
}

class Car extends Vehicle {
  constructor(type, brand) {
    super(type);
    this.brand = brand;
  }
  
  describe() {
    // Parent method को call करो, फिर अपना data जोड़ो
    return super.describe() + ` made by ${this.brand}`;
  }
}

const car = new Car("Vehicle", "Toyota");
console.log(car.describe());
// Output: This is a Vehicle made by Toyota
```

**Output:**
```
This is a Vehicle made by Toyota
```

**Explanation:** `super` से parent methods को access कर सकते हो।

---

### Example 9: Object.create() - Prototype Link करना

```javascript
// Parent object
const animalProto = {
  speak() {
    return this.name + " speaks";
  }
};

// Child object - animalProto से inherit करेगा
const dogProto = Object.create(animalProto);
dogProto.bark = function() {
  return this.name + " barks";
};

// Instance बनाओ
const dog = Object.create(dogProto);
dog.name = "Max";

console.log(dog.bark()); // Max barks
console.log(dog.speak()); // Max speaks
console.log(dog.name); // Max

// Prototype chain को देखो
console.log(dog.__proto__ === dogProto); // true
console.log(dogProto.__proto__ === animalProto); // true
```

**Output:**
```
Max barks
Max speaks
Max
true
true
```

**Explanation:** `Object.create()` से explicit prototype linking कर सकते हो।

---

### Example 10: Prototype Pollution - Attention

```javascript
// ⚠️ WARNING - सब instances affected हो जाएंगे
function User(name) {
  this.name = name;
}

const user1 = new User("Alice");
const user2 = new User("Bob");

// Prototype modify करो
User.prototype.role = "admin";

console.log(user1.role); // admin
console.log(user2.role); // admin (दोनों को मिला!)

// Even worse - array में items add करना
User.prototype.items = [];
user1.items.push("item1");
console.log(user2.items); // ["item1"] - shared ho gaya!

// इसलिए constructor में initialize करो
function User2(name) {
  this.name = name;
  this.items = []; // Own property
}

const user3 = new User2("Charlie");
const user4 = new User2("David");
user3.items.push("item1");
console.log(user4.items); // [] - अलग है!
```

**Output:**
```
admin
admin
["item1"]
[]
```

**Explanation:** Prototype में mutable objects रखना risky है - सभी instances share करते हैं।

---

### Example 11: Mixins - Multiple Inheritance Pattern

```javascript
// Mixin objects
const canEat = {
  eat() { return this.name + " is eating"; }
};

const canWalk = {
  walk() { return this.name + " is walking"; }
};

const canTalk = {
  talk() { return this.name + " is talking"; }
};

// Mixin combine करो
function Person(name) {
  this.name = name;
}

// सभी mixins की properties copy करो
Object.assign(Person.prototype, canEat, canWalk, canTalk);

const person = new Person("Alice");
console.log(person.eat()); // Alice is eating
console.log(person.walk()); // Alice is walking
console.log(person.talk()); // Alice is talking
```

**Output:**
```
Alice is eating
Alice is walking
Alice is talking
```

**Explanation:** Mixins से multiple inheritance simulate कर सकते हो।

---

### Example 12: instanceof और typeof

```javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();
const obj = {};
const arr = [];

console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true
console.log(obj instanceof Dog); // false

console.log(typeof dog); // object
console.log(typeof Dog); // function (classes functions हैं!)
console.log(Array.isArray(arr)); // true

// Custom instanceof
console.log(Object.prototype.isPrototypeOf.call(Animal.prototype, dog)); // true
```

**Output:**
```
true
true
true
false
object
function
true
true
```

**Explanation:** `instanceof` prototype chain check करता है।

---

### Example 13: Property Descriptors और defineProperty

```javascript
// Property descriptor use करो
const obj = {};

Object.defineProperty(obj, 'temperature', {
  value: 37,
  writable: false, // Reassign नहीं कर सकते
  enumerable: true, // for...in में आएगा
  configurable: false // Delete नहीं कर सकते
});

console.log(obj.temperature); // 37

// Modify करने की कोशिश करो
obj.temperature = 40; // Silent fail या error
console.log(obj.temperature); // 37 (unchanged)

// Getter/Setter define करो
Object.defineProperty(obj, 'celsius', {
  get() { return (this.temperature - 32) * 5/9; },
  set(value) { this.temperature = (value * 9/5) + 32; }
});

console.log(obj.celsius); // 2.777...
```

**Output:**
```
37
37
2.777...
```

**Explanation:** Property descriptors से fine-grained control मिलता है।

---

## Real-World Use Cases

### 1. **Plugin System**
```javascript
class Plugin {
  constructor(name) { this.name = name; }
  execute() { throw new Error("Must implement execute()"); }
}

class ValidationPlugin extends Plugin {
  execute(data) { return typeof data === "object"; }
}

class LoggingPlugin extends Plugin {
  execute(data) { console.log("Data:", data); return true; }
}
```

### 2. **Model with Validation**
```javascript
class Model {
  constructor(data) {
    Object.assign(this, data);
  }
  
  validate() { throw new Error("Implement validate()"); }
  
  save() {
    if (this.validate()) {
      console.log("Saved:", this);
    }
  }
}
```

### 3. **Observable Pattern**
```javascript
class Observable {
  constructor(value) {
    this.value = value;
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  notify() {
    this.observers.forEach(obs => obs(this.value));
  }
  
  set value(val) {
    this._value = val;
    this.notify();
  }
  
  get value() { return this._value; }
}
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting `new` Keyword

```javascript
// WRONG
function Person(name) { this.name = name; }
const p = Person("Alice"); // 'this' = window!
console.log(window.name); // "Alice" (oops!)

// CORRECT
const p = new Person("Alice");
```

### ❌ Mistake 2: Prototype में Mutable Objects

```javascript
// WRONG
function User(name) { this.name = name; }
User.prototype.tags = []; // Shared!

const u1 = new User("A");
const u2 = new User("B");
u1.tags.push("tag1");
console.log(u2.tags); // ["tag1"] - oops!

// CORRECT
function User(name) { 
  this.name = name;
  this.tags = []; // Own property
}
```

### ❌ Mistake 3: super() Forget करना

```javascript
// WRONG
class Dog extends Animal {
  constructor(name, breed) {
    this.breed = breed;
    // super() नहीं किया - error!
  }
}

// CORRECT
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}
```

---

## Best Practices

1. **Modern Classes Use करो** - Constructor functions नहीं
2. **super() पहले call करो** - Child constructors में
3. **Prototype methods** - Shared functionality के लिए
4. **Own properties** - Constructor में initialize करो
5. **Composition over inheritance** - Complex cases में
6. **Static methods** - Utility functions के लिए
7. **Property descriptors** - Fine control के लिए

---

## Interview Q&A

### Q1: Prototype chain कैसे काम करता है?

**A:** जब property access करते हो तो:
1. Object की own property check करो
2. नहीं मिली? `__proto__` में देखो
3. फिर उसके `__proto__` में... आदि

```javascript
const person = new Person("Alice");
console.log(person.toString);
// Lookup: person → Person.prototype → Object.prototype → toString!
```

---

### Q2: `new` keyword क्या करता है?

**A:** चार चीजें:
1. नया empty object बनाता है
2. उस object का `__proto__` = constructor.prototype
3. constructor को call करता है, `this` = नया object
4. Object return करता है

```javascript
function Person(name) { this.name = name; }
const p = new Person("Alice");
// Step by step:
// 1. const p = {}
// 2. p.__proto__ = Person.prototype
// 3. Person.call(p, "Alice") → p.name = "Alice"
// 4. return p
```

---

### Q3: Constructor function vs ES6 class में क्या difference है?

**A:** Syntax अलग है, लेकिन internally same काम करते हैं।

```javascript
// Constructor function
function Person(name) { this.name = name; }
Person.prototype.greet = function() {};

// ES6 class (same चीज़!)
class Person {
  constructor(name) { this.name = name; }
  greet() {}
}
```

**Difference:**
- Classes hoisted नहीं होते (temporal dead zone)
- `super()` जरूरी है inheritance में
- Strict mode automatically

---

### Q4: Inheritance कैसे implement करते हो?

**A:** Constructor functions में `Object.create()` use करो, classes में `extends`।

```javascript
// Constructor functions
function Animal(name) { this.name = name; }
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);

// ES6 classes
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}
```

---

### Q5: Prototype pollution क्या है?

**A:** गलती से prototype modify करने से सभी instances affected हो जाते हैं।

```javascript
function User(name) { this.name = name; }
const u1 = new User("A");
const u2 = new User("B");

// ❌ WRONG
User.prototype.role = "admin"; // दोनों को मिल गया!

// ✅ RIGHT
function User(name) {
  this.name = name;
  this.role = "user"; // Own property
}
```

---

## Practice Exercises

### Exercise 1: Constructor Function
```javascript
function Book(title, author) {
  this.title = title;
  this.author = author;
}

Book.prototype.describe = function() {
  return `${this.title} by ${this.author}`;
};
```

### Exercise 2: Class Inheritance
```javascript
class Shape {
  constructor(color) { this.color = color; }
  describe() { return "A " + this.color + " shape"; }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
}
```

### Exercise 3: Mixins
```javascript
const canFly = {
  fly: function() { return this.name + " flies"; }
};

function Bird(name) { this.name = name; }
Object.assign(Bird.prototype, canFly);
```

### Exercise 4: Static Methods
```javascript
class Math2 {
  static add(a, b) { return a + b; }
  static subtract(a, b) { return a - b; }
}

console.log(Math2.add(5, 3)); // 8
```

### Exercise 5: Getters/Setters
```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  get fullName() { return this.firstName + " " + this.lastName; }
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(" ");
  }
}
```

---

## Key Takeaways

- **Prototype = Blueprint** - Objects से inherit करते हैं
- **Prototype Chain** - Property lookup order
- **Constructor Functions** - पुराना तरीका objects बनाने का
- **ES6 Classes** - Modern, readable syntax
- **Inheritance** - extends से child create करो
- **super()** - Parent को access करने के लिए
- **Mixins** - Multiple properties combine करने के लिए
- **Prototype pollution** - Mutable objects से बचो

---

## Next Steps

Ab aap Prototypes aur Inheritance complete kar gaye!

**Next Lesson:** Event Loop & Timing - जहाँ:
- JavaScript Event Loop
- Microtasks vs Macrotasks
- setTimeout, setInterval
- requestAnimationFrame
- Performance optimization

Padhai continue करो! 🚀

