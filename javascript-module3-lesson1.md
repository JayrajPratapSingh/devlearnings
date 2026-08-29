# JAVASCRIPT COMPLETE COURSE - MODULE 3: LESSON 1

## Lesson 1: Design Patterns (Days 9-11)

### Learning Outcomes
- [ ] Understand common design patterns
- [ ] Master Singleton, Factory, Observer patterns
- [ ] Learn Strategy, Decorator patterns
- [ ] Implement MVC/MVVM architectures
- [ ] Apply patterns to real-world problems

---

## Beginner Explanation (Simple Language)

**Design Patterns** - ये proven solutions हैं common programming problems के लिए। जैसे construction में blueprints होते हैं, programming में भी patterns होते हैं।

जब आप बार-बार same problem solve कर रहे हो, तो pattern use करो। ये code को:
- ✅ Organized रखते हैं
- ✅ Maintainable बनाते हैं
- ✅ Scalable बनाते हैं
- ✅ Team के साथ communication easy करते हैं

---

## Key Concepts

### 1. Creational Patterns
Objects को create करते हैं - Singleton, Factory, Builder

### 2. Structural Patterns
Objects को compose करते हैं - Adapter, Decorator, Facade

### 3. Behavioral Patterns
Objects के बीच communication - Observer, Strategy, Command

---

## Code Examples (Detailed)

### Example 1: Singleton Pattern

```javascript
// एक ही instance का guarantee
const Database = (() => {
  let instance = null;

  class DatabaseConnection {
    constructor() {
      this.connection = null;
      this.connect();
    }

    connect() {
      console.log("Connecting to database...");
      this.connection = { connected: true };
    }

    query(sql) {
      return `Executing: ${sql}`;
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = new DatabaseConnection();
      }
      return instance;
    }
  };
})();

// Use करो
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true - same instance!
console.log(db1.query("SELECT * FROM users"));
```

**Output:**
```
Connecting to database...
true
Executing: SELECT * FROM users
```

**Use Case:** Database connection, Logger, Cache, Configuration manager

---

### Example 2: Factory Pattern

```javascript
// Objects बनाने का factory
class UserFactory {
  static createUser(type, name, email) {
    switch(type) {
      case "admin":
        return new AdminUser(name, email);
      case "moderator":
        return new ModeratorUser(name, email);
      case "regular":
        return new RegularUser(name, email);
      default:
        throw new Error("Unknown user type");
    }
  }
}

class AdminUser {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.role = "admin";
    this.permissions = ["read", "write", "delete"];
  }
}

class ModeratorUser {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.role = "moderator";
    this.permissions = ["read", "write"];
  }
}

class RegularUser {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.role = "user";
    this.permissions = ["read"];
  }
}

// Use करो
const admin = UserFactory.createUser("admin", "admin@example.com", "admin@test.com");
const user = UserFactory.createUser("regular", "user@example.com", "user@test.com");

console.log(admin.role, admin.permissions);
// admin ["read", "write", "delete"]

console.log(user.role, user.permissions);
// user ["read"]
```

**Use Case:** UI components, API response handlers, Payment methods

---

### Example 3: Observer Pattern

```javascript
// सभी observers को notify करो
class EventEmitter {
  constructor() {
    this.observers = {};
  }

  subscribe(event, callback) {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(callback);
    
    // Unsubscribe function return करो
    return () => {
      this.observers[event] = this.observers[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.observers[event]) {
      this.observers[event].forEach(callback => callback(data));
    }
  }
}

// Use करो
const userEvents = new EventEmitter();

// Multiple observers
userEvents.subscribe("user:login", (user) => {
  console.log("Logger: User logged in -", user.name);
});

userEvents.subscribe("user:login", (user) => {
  console.log("Analytics: User login event tracked");
});

userEvents.subscribe("user:login", (user) => {
  console.log("Email: Sending welcome email to", user.email);
});

// Event emit करो
userEvents.emit("user:login", { name: "Alice", email: "alice@example.com" });
```

**Output:**
```
Logger: User logged in - Alice
Analytics: User login event tracked
Email: Sending welcome email to alice@example.com
```

**Use Case:** Event systems, MVC architecture, Reactive programming

---

### Example 4: Strategy Pattern

```javascript
// Different strategies को swap कर सकते हो runtime पर
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  process(amount) {
    return this.strategy.pay(amount);
  }
}

// Different strategies
class CreditCardStrategy {
  pay(amount) {
    console.log(`Processing ${amount} via Credit Card`);
    console.log("Charging credit card...");
    return { success: true, method: "Credit Card", amount };
  }
}

class PayPalStrategy {
  pay(amount) {
    console.log(`Processing ${amount} via PayPal`);
    console.log("Redirecting to PayPal...");
    return { success: true, method: "PayPal", amount };
  }
}

class CryptoStrategy {
  pay(amount) {
    console.log(`Processing ${amount} via Cryptocurrency`);
    console.log("Generating wallet address...");
    return { success: true, method: "Crypto", amount };
  }
}

// Use करो
const processor = new PaymentProcessor(new CreditCardStrategy());

processor.process(100); // Credit Card

processor.setStrategy(new PayPalStrategy());
processor.process(50); // PayPal

processor.setStrategy(new CryptoStrategy());
processor.process(25); // Crypto
```

**Use Case:** Payment processing, sorting algorithms, validation rules

---

### Example 5: Decorator Pattern

```javascript
// Functionality को add करो without modifying original class
class Logger {
  log(message) {
    console.log(message);
  }
}

// Decorators
class TimestampDecorator {
  constructor(logger) {
    this.logger = logger;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] ${message}`);
  }
}

class LevelDecorator {
  constructor(logger, level) {
    this.logger = logger;
    this.level = level;
  }

  log(message) {
    this.logger.log(`[${this.level}] ${message}`);
  }
}

// Use करो
let logger = new Logger();

// Add timestamp
logger = new TimestampDecorator(logger);

// Add level
logger = new LevelDecorator(logger, "INFO");

logger.log("Application started");
// [INFO] [2024-01-20T10:30:45.123Z] Application started
```

**Use Case:** I/O operations, Authentication, Compression, Encryption

---

### Example 6: Builder Pattern

```javascript
// Complex objects को step-by-step बनाओ
class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.columns = "*";
    this.whereConditions = [];
    this.orderByColumn = null;
    this.limitValue = null;
  }

  select(columns) {
    this.columns = Array.isArray(columns) ? columns.join(", ") : columns;
    return this;
  }

  where(condition) {
    this.whereConditions.push(condition);
    return this;
  }

  orderBy(column, direction = "ASC") {
    this.orderByColumn = `${column} ${direction}`;
    return this;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  build() {
    let query = `SELECT ${this.columns} FROM ${this.table}`;

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(" AND ")}`;
    }

    if (this.orderByColumn) {
      query += ` ORDER BY ${this.orderByColumn}`;
    }

    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }

    return query;
  }
}

// Use करो
const query = new QueryBuilder("users")
  .select(["id", "name", "email"])
  .where("age > 18")
  .where("status = 'active'")
  .orderBy("name")
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND status = 'active' ORDER BY name ASC LIMIT 10
```

**Use Case:** Database queries, HTML builders, API request builders

---

### Example 7: Adapter Pattern

```javascript
// Incompatible interfaces को compatible बनाओ
class OldPaymentGateway {
  charge(cardNumber, amount) {
    console.log(`Old gateway: Charging ${amount} on card ${cardNumber}`);
    return { transactionId: "OLD123", amount };
  }
}

class NewPaymentGateway {
  processPayment(paymentInfo) {
    console.log(`New gateway: Processing ${paymentInfo.amount} with token ${paymentInfo.token}`);
    return { id: "NEW456", status: "success" };
  }
}

// Adapter
class PaymentGatewayAdapter {
  constructor(oldGateway) {
    this.oldGateway = oldGateway;
  }

  processPayment(paymentInfo) {
    // Old interface को new interface में convert करो
    return this.oldGateway.charge(paymentInfo.cardNumber, paymentInfo.amount);
  }
}

// Use करो - दोनों interfaces को same तरीके से use करो
const oldGateway = new OldPaymentGateway();
const adapter = new PaymentGatewayAdapter(oldGateway);
const newGateway = new NewPaymentGateway();

const paymentInfo = { cardNumber: "4111111111111111", amount: 99.99, token: "token123" };

adapter.processPayment(paymentInfo); // Old gateway को new interface से
newGateway.processPayment(paymentInfo); // New gateway
```

**Use Case:** Legacy code integration, API compatibility, Third-party libraries

---

### Example 8: MVC Pattern

```javascript
// Model - Data
class TodoModel {
  constructor() {
    this.todos = [];
  }

  addTodo(title) {
    const todo = { id: Date.now(), title, completed: false };
    this.todos.push(todo);
    return todo;
  }

  getTodos() {
    return [...this.todos];
  }

  completeTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = true;
  }
}

// View - UI
class TodoView {
  constructor() {
    this.input = document.getElementById("todo-input");
    this.list = document.getElementById("todo-list");
  }

  render(todos) {
    this.list.innerHTML = "";
    todos.forEach(todo => {
      const li = document.createElement("li");
      li.textContent = todo.title;
      li.className = todo.completed ? "completed" : "";
      this.list.appendChild(li);
    });
  }

  getTodoInput() {
    return this.input.value;
  }

  clearInput() {
    this.input.value = "";
  }
}

// Controller - Logic
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  addTodo() {
    const title = this.view.getTodoInput();
    if (title.trim()) {
      this.model.addTodo(title);
      this.view.clearInput();
      this.updateView();
    }
  }

  updateView() {
    const todos = this.model.getTodos();
    this.view.render(todos);
  }

  init() {
    this.updateView();
    document.getElementById("add-btn").addEventListener("click", () => this.addTodo());
  }
}

// Use करो
const app = new TodoController(new TodoModel(), new TodoView());
app.init();
```

**Use Case:** Web applications, Desktop apps, Large-scale projects

---

### Example 9: Middleware Pattern

```javascript
// Express-like middleware pattern
class RequestProcessor {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  async process(request) {
    let index = -1;

    const dispatch = async (i) => {
      if (i <= index) return;
      index = i;

      const middleware = this.middlewares[i];
      if (!middleware) return;

      await middleware(request, () => dispatch(i + 1));
    };

    await dispatch(0);
    return request;
  }
}

// Use करो
const processor = new RequestProcessor();

processor
  .use(async (req, next) => {
    console.log("1. Auth middleware");
    req.user = { id: 1, name: "Alice" };
    await next();
  })
  .use(async (req, next) => {
    console.log("2. Logging middleware");
    console.log(`Request for: ${req.path}`);
    await next();
  })
  .use(async (req, next) => {
    console.log("3. Validation middleware");
    req.validated = true;
    await next();
  });

// Process करो
const request = { path: "/api/users", data: {} };
await processor.process(request);

console.log(request.user);
console.log(request.validated);
```

**Use Case:** Web frameworks, Request processing, Plugin systems

---

### Example 10: Command Pattern

```javascript
// Commands को objects में wrap करो
class TextEditor {
  constructor() {
    this.content = "";
  }

  write(text) {
    this.content += text;
  }

  clear() {
    this.content = "";
  }
}

// Commands
class WriteCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.write(this.text);
  }

  undo() {
    this.editor.content = this.editor.content.slice(0, -this.text.length);
  }
}

class ClearCommand {
  constructor(editor) {
    this.editor = editor;
    this.previousContent = "";
  }

  execute() {
    this.previousContent = this.editor.content;
    this.editor.clear();
  }

  undo() {
    this.editor.content = this.previousContent;
  }
}

// Command history
class CommandHistory {
  constructor() {
    this.history = [];
  }

  execute(command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

// Use करो
const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new WriteCommand(editor, "Hello "));
history.execute(new WriteCommand(editor, "World"));

console.log(editor.content); // Hello World

history.undo();
console.log(editor.content); // Hello 

history.undo();
console.log(editor.content); // (empty)
```

**Use Case:** Undo/redo systems, Task queues, Macro recording

---

### Example 11: Facade Pattern

```javascript
// Complex subsystem को simple interface देना
// Complex subsystem
class CPU {
  freeze() { console.log("Freezing CPU"); }
  jump(position) { console.log("Jumping to", position); }
  execute() { console.log("Executing"); }
}

class Memory {
  load(position, data) { console.log(`Loading data at ${position}`); }
}

class SSD {
  read(sector) { console.log(`Reading sector ${sector}`); }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.ssd = new SSD();
  }

  startComputer() {
    console.log("=== Starting Computer ===");
    this.cpu.freeze();
    this.memory.load(0, "BIOS");
    this.cpu.jump(0);
    this.cpu.execute();
    console.log("=== Computer Started ===");
  }

  shutdownComputer() {
    console.log("=== Shutting Down ===");
    // Complex operations abstracted
    console.log("=== Shutdown Complete ===");
  }
}

// Use करो - complex operations को simple calls से
const computer = new ComputerFacade();
computer.startComputer(); // सभी complexity छिप गई!
computer.shutdownComputer();
```

**Use Case:** Library APIs, System initialization, Complex workflows

---

### Example 12: State Pattern

```javascript
// State को manage करो properly
class TrafficLight {
  constructor() {
    this.state = new RedState(this);
  }

  setState(state) {
    this.state = state;
  }

  change() {
    this.state.change();
  }

  getLight() {
    return this.state.getLight();
  }
}

// States
class RedState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Red -> Yellow");
    this.light.setState(new YellowState(this.light));
  }

  getLight() {
    return "🔴 RED - STOP";
  }
}

class YellowState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Yellow -> Green");
    this.light.setState(new GreenState(this.light));
  }

  getLight() {
    return "🟡 YELLOW - WAIT";
  }
}

class GreenState {
  constructor(light) {
    this.light = light;
  }

  change() {
    console.log("Green -> Red");
    this.light.setState(new RedState(this.light));
  }

  getLight() {
    return "🟢 GREEN - GO";
  }
}

// Use करो
const light = new TrafficLight();
console.log(light.getLight()); // 🔴 RED - STOP
light.change();
console.log(light.getLight()); // 🟡 YELLOW - WAIT
light.change();
console.log(light.getLight()); // 🟢 GREEN - GO
```

**Use Case:** State machines, UI workflows, Game development

---

## Real-World Applications

```javascript
// 1. E-commerce की example - multiple patterns का combination
class ProductFactory {
  static create(type, data) {
    // Factory pattern
    switch(type) {
      case "digital": return new DigitalProduct(data);
      case "physical": return new PhysicalProduct(data);
    }
  }
}

class OrderManager {
  constructor() {
    this.strategy = null;
  }

  setShippingStrategy(strategy) {
    // Strategy pattern
    this.strategy = strategy;
  }

  calculateShipping(weight) {
    return this.strategy.calculate(weight);
  }
}

class Order extends EventEmitter {
  constructor(product) {
    super();
    this.product = product;
    this.state = new PendingState(this);
    // Observer pattern - emit events
  }

  updateState(newState) {
    this.state = newState;
    this.emit("stateChange", this.state);
  }
}
```

---

## Best Practices

1. **Don't over-pattern** - Simple solutions बेहतर हैं
2. **Pattern + problem context** - Problem solve करने के लिए pattern use करो
3. **Team consistency** - सभी एक ही pattern follow करें
4. **Documentation** - Pattern को document करो
5. **Refactor carefully** - Pattern add करते हुए tests चलाते रहो

---

## Interview Q&A

### Q1: Singleton vs Static Class?

**A:** 
- **Singleton:** Instance है, state रख सकता है
- **Static:** Stateless, सीधे methods हैं

```javascript
// Singleton - instance है
const db = Database.getInstance();

// Static - methods सीधे हैं
Database.query();
```

---

### Q2: कब Factory use करें?

**A:** जब:
- Object creation complex हो
- Multiple types के objects बनाने हों
- Creation logic बदलना हो

```javascript
// Without factory - repetitive
const admin = new AdminUser();
const mod = new ModeratorUser();

// With factory - clean
const admin = UserFactory.create("admin");
const mod = UserFactory.create("moderator");
```

---

### Q3: Observer vs Strategy?

**A:**
- **Observer:** Event-driven, loosely coupled
- **Strategy:** Algorithm selection, interchangeable

```javascript
// Observer - notification based
eventEmitter.on("user:login", callback);

// Strategy - behavior selection
processor.setStrategy(new PayPalStrategy());
```

---

## Practice Exercises

### Exercise 1: Singleton Logger
```javascript
const Logger = (() => {
  let instance;
  class Log {
    log(msg) { console.log(msg); }
  }
  return {
    getInstance: () => instance || (instance = new Log())
  };
})();
```

### Exercise 2: Factory + Builder
```javascript
class HTMLBuilder {
  // Builder pattern
  createElement(tag) { /* ... */ }
  addClass(className) { /* ... */ }
  build() { /* ... */ }
}

class ComponentFactory {
  // Factory pattern
  createButton() { /* ... */ }
  createForm() { /* ... */ }
}
```

### Exercise 3: State Machine
```javascript
// Implement order state machine
// pending → processing → shipped → delivered
```

---

## Key Takeaways

- **Pattern = Proven Solution** - Common problems का
- **Singleton** - एक ही instance guarantee
- **Factory** - Object creation को centralize करो
- **Observer** - Loosely coupled architecture
- **Strategy** - Algorithms को interchangeable बनाओ
- **Decorator** - Functionality add करो dynamically
- **Builder** - Complex objects step-by-step
- **MVC** - Separation of concerns

---

## Next Steps

Ab aap common patterns जान गए!

**Next Lesson:** Performance Optimization - जहाँ:
- Code optimization
- Memory management
- Rendering performance
- Bundle size reduction
- और बहुत कुछ!

Padhai continue करो! 🚀

