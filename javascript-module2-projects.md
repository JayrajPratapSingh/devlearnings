# JAVASCRIPT COMPLETE COURSE - MODULE 2: PROJECTS

## Module 2: Advanced Concepts - 5 Advanced Projects

---

# Project 1: Image Gallery with Lazy Loading

## Learning Goals
- ✅ Intersection Observer API
- ✅ Event delegation
- ✅ Image optimization
- ✅ Performance optimization
- ✅ State management

## Duration: 3-4 hours
## Difficulty: ⭐⭐ Advanced

---

## Requirements

### Features
1. **Grid Display** - Images को responsive grid में दिखाना
2. **Lazy Loading** - Images को load करो जब visible हों
3. **Load Indicator** - Loading state दिखाना
4. **Lightbox** - Click पर full-size image दिखाना
5. **Keyboard Navigation** - Arrow keys से navigate करना
6. **Error Handling** - Failed images को handle करना

---

## Implementation Guide

```javascript
class ImageGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.images = [];
    this.currentLightboxIndex = null;
    
    this.initializeObserver();
    this.attachEventListeners();
  }

  initializeObserver() {
    // TODO: Intersection Observer बनाओ
    // - image element दिखे तो load करो
    // - loading class add करो
    // - image loaded हो तो loaded class add करो
  }

  loadImage(imgElement) {
    // TODO: Implement
    // - data-src से src में move करो
    // - Error handling जोड़ो
    // - Loading indicator दिखाओ
  }

  openLightbox(index) {
    // TODO: Implement
    // - Lightbox modal खोलो
    // - Full-size image दिखाओ
    // - Navigation buttons जोड़ो
  }

  // Keyboard navigation
  handleKeyboard(event) {
    // TODO: Implement
    // - ArrowLeft/Right से navigate करो
    // - Escape से close करो
  }
}
```

### HTML Structure
```html
<div class="gallery" id="gallery">
  <div class="gallery-item">
    <img data-src="image1.jpg" alt="Image 1" class="lazy-image">
    <div class="loading-skeleton"></div>
  </div>
  <!-- More items -->
</div>

<div id="lightbox" class="lightbox hidden">
  <img id="lightbox-image" src="" alt="">
  <button class="lightbox-prev">←</button>
  <button class="lightbox-next">→</button>
  <button class="lightbox-close">×</button>
</div>
```

---

# Project 2: Search with Debounce

## Learning Goals
- ✅ Debounce implementation
- ✅ API integration
- ✅ Real-time search
- ✅ Result filtering और highlighting
- ✅ Keyboard navigation

## Duration: 3 hours
## Difficulty: ⭐⭐ Advanced

---

## Requirements

### Features
1. **Live Search** - जैसे-जैसे type करो, search करो
2. **Debouncing** - Unnecessary API calls avoid करो
3. **Results Display** - Matching results दिखाओ
4. **Highlighting** - Search term को highlight करो
5. **Keyboard Navigation** - Arrow keys से select करो
6. **Cache Results** - Recent searches cache करो

---

## Implementation Guide

```javascript
class SearchEngine {
  constructor(inputId, resultsId) {
    this.input = document.getElementById(inputId);
    this.resultsContainer = document.getElementById(resultsId);
    this.cache = {};
    this.debounceDelay = 300;
    
    this.attachEventListeners();
  }

  debounce(func, delay) {
    // TODO: Implement debounce
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  async search(query) {
    // TODO: Implement
    // - Cache check करो
    // - API call करो
    // - Results display करो
    // - Cache में store करो
  }

  highlightMatch(text, query) {
    // TODO: Implement
    // - Query को bold करो
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  handleKeyboard(event) {
    // TODO: Implement
    // - ArrowDown/Up से navigate करो
    // - Enter से select करो
  }
}
```

---

# Project 3: Data Validation Library

## Learning Goals
- ✅ Regular expressions
- ✅ Custom error handling
- ✅ Validation patterns
- ✅ Async validation
- ✅ Composable validators

## Duration: 4 hours
## Difficulty: ⭐⭐⭐ Advanced+

---

## Requirements

### Features
1. **Multiple Validators** - Email, phone, password, custom
2. **Async Validation** - Check username availability (fake API)
3. **Custom Rules** - User-defined validation rules
4. **Error Messages** - Meaningful error messages
5. **Form Integration** - Forms के साथ use करो
6. **Chainable API** - validator.email().required().validate()

---

## Validator Class Structure

```javascript
class Validator {
  constructor(value) {
    this.value = value;
    this.rules = [];
    this.errors = [];
  }

  // Fluent API
  required() {
    this.rules.push((val) => val && val.trim().length > 0 || "Required field");
    return this;
  }

  email() {
    this.rules.push((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Invalid email");
    return this;
  }

  minLength(length) {
    this.rules.push((val) => val.length >= length || `Minimum ${length} characters`);
    return this;
  }

  custom(func) {
    this.rules.push(func);
    return this;
  }

  async validate() {
    // TODO: Implement
    // - सभी rules को apply करो
    // - Errors collect करो
    // - Return validation result
  }
}

// Usage
const v = new Validator("user@example.com");
const result = await v.required().email().minLength(5).validate();
```

---

# Project 4: Custom Events System

## Learning Goals
- ✅ Observer pattern implementation
- ✅ Custom events
- ✅ Event bubbling
- ✅ Advanced closures
- ✅ Decoupled architecture

## Duration: 3-4 hours
## Difficulty: ⭐⭐ Advanced

---

## Requirements

### Features
1. **Event Emitter** - Events emit और listen करना
2. **Multiple Listeners** - Same event पर multiple listeners
3. **Wildcard Events** - सभी events को listen करना
4. **Event Namespacing** - app:user:login जैसे events
5. **Once Method** - Event को एक बार listen करो
6. **Memory Management** - Listeners को properly clean करो

---

## EventEmitter Implementation

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    // TODO: Implement
    // - Events object में listener add करो
    // - Multiple listeners support करो
  }

  once(eventName, callback) {
    // TODO: Implement
    // - Callback को wrapper में wrap करो
    // - First call पर callback + listener remove करो
  }

  emit(eventName, data) {
    // TODO: Implement
    // - सभी listeners को call करो
    // - Data pass करो
    // - Wildcard listeners को भी call करो
  }

  off(eventName, callback) {
    // TODO: Implement
    // - Specific listener को remove करो
  }

  clear() {
    // TODO: Implement
    // - सभी listeners को remove करो
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on("user:login", (user) => {
  console.log("User logged in:", user.name);
});

emitter.emit("user:login", { name: "Alice", id: 1 });
```

---

# Project 5: Module Pattern Implementation

## Learning Goals
- ✅ Advanced closures
- ✅ Private/public methods
- ✅ Singleton pattern
- ✅ Module dependencies
- ✅ Encapsulation best practices

## Duration: 4 hours
## Difficulty: ⭐⭐⭐ Advanced+

---

## Requirements

### Features
1. **Private Variables** - Module के अंदर ही accessible
2. **Public Methods** - बाहर से accessible
3. **Dependency Injection** - Modules के बीच dependencies
4. **Singleton Pattern** - Module का एक ही instance
5. **Module Registry** - Modules को track करना
6. **Namespace** - Global namespace pollution avoid करना

---

## Module System Architecture

```javascript
const ModuleRegistry = (() => {
  const modules = {};
  const depends = {};

  return {
    define: (name, dependencies, factory) => {
      // TODO: Implement
      // - Module को register करो
      // - Dependencies को store करो
    },

    require: (dependencies) => {
      // TODO: Implement
      // - Dependencies को load करो
      // - Circular dependency check करो
      // - instances return करो
    },

    get: (name) => {
      // TODO: Implement
      // - Module को get करो
      // - Lazy loading करो
    }
  };
})();

// Usage
ModuleRegistry.define("auth", [], function() {
  return {
    login: (user) => { /* login logic */ },
    logout: () => { /* logout logic */ }
  };
});

ModuleRegistry.define("api", ["auth"], function(auth) {
  return {
    fetchUsers: async () => {
      // auth use करो
    }
  };
});

const api = ModuleRegistry.require(["api"]);
```

---

## Complex Module Pattern Example

```javascript
// App core module
const App = (() => {
  // Private variables
  const config = {};
  const modules = {};

  // Private methods
  function initializeModules() {
    // Modules ko initialize करो
  }

  function validateConfig() {
    // Config को validate करो
  }

  // Public API
  return {
    init: (cfg) => {
      Object.assign(config, cfg);
      validateConfig();
      initializeModules();
    },

    registerModule: (name, module) => {
      modules[name] = module;
    },

    getModule: (name) => {
      return modules[name];
    },

    getConfig: () => {
      return { ...config }; // Copy return करो
    }
  };
})();

// Usage
App.init({
  apiUrl: "https://api.example.com",
  debug: true
});

App.registerModule("user", {
  getProfile: () => { /* ... */ }
});
```

---

## Testing Setup

सभी projects के लिए testing setup:

```html
<!-- Test Runner -->
<div id="test-results"></div>

<script>
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, fn) {
    try {
      fn();
      this.passed++;
      console.log("✅", description);
    } catch (error) {
      this.failed++;
      console.error("❌", description, error.message);
    }
  }

  assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `${actual} !== ${expected}`);
    }
  }

  run() {
    console.log(`\nResults: ${this.passed} passed, ${this.failed} failed`);
  }
}
</script>
```

---

## Common Challenges & Solutions

### Challenge 1: Handling Async in Validation
```javascript
// Solution: Promise.all या async/await
async function validateForm(formData) {
  const promises = Object.entries(formData).map(([key, value]) => {
    return new Validator(value).required().validate();
  });
  
  const results = await Promise.all(promises);
  return results.every(r => !r.errors);
}
```

### Challenge 2: Memory Leaks in Event System
```javascript
// Solution: Proper cleanup
class Component {
  constructor() {
    this.emitter = new EventEmitter();
    this.onDataChanged = this.handleChange.bind(this);
  }

  mount() {
    this.emitter.on("data:change", this.onDataChanged);
  }

  unmount() {
    this.emitter.off("data:change", this.onDataChanged);
  }

  handleChange(data) {
    // Handle change
  }
}
```

### Challenge 3: Circular Dependencies in Modules
```javascript
// Solution: Lazy loading या dependency reordering
ModuleRegistry.define("module-a", [], function() {
  return {
    method: () => {
      // Module B को lazy load करो
      const moduleB = ModuleRegistry.get("module-b");
      return moduleB.method();
    }
  };
});
```

---

## Performance Tips

1. **Debounce Heavy Operations** - Search, resize events
2. **Lazy Load Resources** - Intersection Observer use करो
3. **Cache Results** - Expensive computations को cache करो
4. **Minimize Event Listeners** - Event delegation use करो
5. **Clean Up Properly** - Memory leaks avoid करो

---

## Debugging Techniques

```javascript
// Module pattern में debugging
const createDebugger = (moduleName) => {
  const isDev = true; // Config से लो
  
  return {
    log: (...args) => {
      if (isDev) console.log(`[${moduleName}]`, ...args);
    },
    error: (...args) => {
      console.error(`[${moduleName}]`, ...args);
    }
  };
};

// Use करो
const debug = createDebugger("SearchEngine");
debug.log("Search initialized");
debug.error("Search failed");
```

---

## Testing Strategies

### Unit Testing Pattern
```javascript
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Test Validator
assert(new Validator("test@example.com").email().isValid, "Email should be valid");
assert(!new Validator("invalid").email().isValid, "Invalid email should fail");

// Test Debounce
const debounceTest = async () => {
  let callCount = 0;
  const fn = () => callCount++;
  const debounced = debounce(fn, 100);
  
  debounced();
  debounced();
  debounced();
  
  await new Promise(r => setTimeout(r, 150));
  assert(callCount === 1, "Debounce should call once");
};
```

---

## Learning Path Completion

### Module 2 Summary

✅ **Lesson 1:** Closures & Scope Chain
- Complex closures
- Data privacy
- Memory management

✅ **Lesson 2:** Prototypes & Inheritance
- Constructor functions
- ES6 classes
- Inheritance patterns

✅ **Lesson 3:** Event Loop & Timing
- Microtask vs callback queue
- requestAnimationFrame
- Performance optimization

✅ **Lesson 4:** Error Handling
- Custom errors
- Try/catch patterns
- Async error handling

✅ **Lesson 5:** Regular Expressions
- Pattern matching
- Validation
- String manipulation

✅ **Projects:** 5 Advanced Real-World Projects
- Image gallery with lazy loading
- Search with debounce
- Data validation library
- Event system
- Module pattern

---

## Next Steps

अब आप Module 2 complete कर चुके हो! 🎉

### Ready for Module 3: Practical Patterns?

**Module 3 में सीखेंगे:**
- Design Patterns
- Performance Optimization
- Testing with Jest
- Debugging Techniques
- Capstone Projects

### या अगर ready हो तो React Course शुरू करो!

**React Module:**
- React fundamentals
- Hooks (useState, useEffect, etc.)
- Component patterns
- State management
- Routing
- और 16+ projects!

Aap ab एक advanced JavaScript developer बन गए हो! 

Next step decide करो:
1. Module 3: JavaScript Patterns (Advanced techniques)
2. React Course (Frontend framework)
3. Node.js Course (Backend development)

All the best! 🚀💪

