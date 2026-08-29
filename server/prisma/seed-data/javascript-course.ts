/**
 * JavaScript Complete Course - Interactive Seed Data
 * Bilingual (English + Hindi/Hinglish)
 * Structured for interactive learning platform
 */

import { SeedProblem, Diff, sample, hidden, starter, solution } from './shared';

// ============================================================================
// MODULE 1: FUNDAMENTALS - Variables, Functions, Async
// ============================================================================

export const jsModule1Problems: SeedProblem[] = [
  // Topic 1: Variables और Scope
  {
    slug: 'js-variables-basics',
    title: 'Basic Variables Declaration',
    category: 'JavaScript Fundamentals',
    difficulty: 'EASY' as Diff,
    description: `
      Create variables using const, let, and var. Understand the difference between them.

      **Concepts:**
      - const: Immutable, block-scoped
      - let: Mutable, block-scoped
      - var: Mutable, function-scoped (legacy)

      Your task: Declare variables and assign values correctly.
    `,
    descriptionHi: `
      const, let, और var का use करके variables बनाओ। उनके बीच का फर्क समझो।

      **Concepts:**
      - const: Unchangeable, block में ही accessible
      - let: Change कर सकते हो, block में ही accessible
      - var: Change कर सकते हो, पूरे function में accessible (पुराना तरीका)

      तुम्हारा काम: Variables को सही तरीके से declare और assign करना।
    `,
    examples: [
      {
        input: 'const greeting = "Hello";\nlet count = 0;\nvar legacy = true;',
        output: 'greeting = Hello\ncount = 0\nlegacy = true',
        explanation: 'Variables को अपनी type के साथ declare किया।'
      },
      {
        input: 'const PI = 3.14159;\nconsole.log(PI);',
        output: '3.14159',
        explanation: 'const से constant बनाया जो change नहीं हो सकता।'
      }
    ],
    constraints: [
      'Use const for immutable values',
      'Use let for block-scoped variables',
      'Avoid using var in modern code',
      'Variable names must be meaningful'
    ],
    hints: [
      'const is the default choice in modern JavaScript',
      'Use let when you need to reassign the variable',
      'var has function scope, not block scope - that\'s why we avoid it'
    ],
    approach: `
      1. Identify which values will change and which won't
      2. Use const by default
      3. Use let if you need to reassign
      4. Never use var (except in legacy code)
      5. Choose meaningful variable names
    `,
    approachHi: `
      1. Decide करो कि कौन से values change होंगे
      2. Default में const use करो
      3. अगर reassign करना हो तो let use करो
      4. var कभी use मत करो (सिवाय पुराने code के)
      5. समझदारी से names रखो
    `,
    timeComplexity: 'O(1) - Variable declaration is constant time',
    spaceComplexity: 'O(1) - Fixed memory usage',
    solutionExplanation: `
      The solution demonstrates:
      - Proper const declaration for constants
      - let for block-scoped variables
      - Understanding scope rules
      - Best practices in modern JavaScript
    `,
    solutionExplanationHi: `
      Solution दिखाता है:
      - const से constants को सही तरीके से declare करना
      - let का use block scope के साथ
      - Scope rules को समझना
      - Modern JavaScript में best practices
    `,
    starter: starter(
      `// TODO: Declare variables correctly
const temperature = 98.6;
let counter = 0;
var oldWay = 'avoid this';

console.log(temperature);
console.log(counter);
console.log(oldWay);`,
      `# TODO: Declare variables correctly
temperature = 98.6
counter = 0
old_way = 'avoid this'

print(temperature)
print(counter)
print(old_way)`
    ),
    solution: solution(
      `const temperature = 98.6;
let counter = 0;
var oldWay = 'avoid this';

console.log(temperature);
console.log(counter);
console.log(oldWay);`,
      `temperature = 98.6
counter = 0
old_way = 'avoid this'

print(temperature)
print(counter)
print(old_way)`
    ),
    testCases: [
      sample('const x = 5;\nconsole.log(x);', '5'),
      sample('let y = "JavaScript";\nconsole.log(y);', 'JavaScript'),
      hidden('const obj = {};\nobj.name = "test";\nconsole.log(obj.name);', 'test')
    ]
  },

  // Topic 2: Functions
  {
    slug: 'js-functions-intro',
    title: 'Function Declarations and Calls',
    category: 'JavaScript Fundamentals',
    difficulty: 'EASY' as Diff,
    description: `
      Learn to create and call functions. Understand function declarations, expressions, and arrow functions.

      **Concepts:**
      - Function declaration: function name() {}
      - Function expression: const fn = function() {}
      - Arrow functions: const fn = () => {}
      - Parameters and return values
    `,
    descriptionHi: `
      Functions बनाना और use करना सीखो। Declarations, expressions, और arrow functions समझो।

      **Concepts:**
      - Function declaration: function name() {}
      - Function expression: const fn = function() {}
      - Arrow functions: const fn = () => {}
      - Parameters और return values
    `,
    examples: [
      {
        input: 'function greet(name) {\n  return "Hello, " + name;\n}\nconsole.log(greet("Alice"));',
        output: 'Hello, Alice',
        explanation: 'Function declaration से greeting function बनाया।'
      },
      {
        input: 'const add = (a, b) => a + b;\nconsole.log(add(5, 3));',
        output: '8',
        explanation: 'Arrow function से addition करना सीखा।'
      }
    ],
    constraints: [
      'Function must have a name or be assigned to a variable',
      'Parameters must be clearly defined',
      'Function should return a value'
    ],
    hints: [
      'Arrow functions have implicit return for single expressions',
      'Regular functions need explicit return statement',
      'Function names should describe what they do'
    ],
    approach: `
      1. Define the function signature with parameters
      2. Add function body with logic
      3. Return the result
      4. Call the function with arguments
      5. Verify the output
    `,
    approachHi: `
      1. Function का signature बनाओ parameters के साथ
      2. Function body में logic add करो
      3. Result return करो
      4. Function को arguments के साथ call करो
      5. Output verify करो
    `,
    timeComplexity: 'O(1) - Function execution time varies by logic',
    spaceComplexity: 'O(1) - Fixed parameter storage',
    solutionExplanation: 'Three ways to write functions with proper syntax and semantics.',
    solutionExplanationHi: 'Functions को तीन तरीकों से लिखना, सही syntax के साथ।',
    starter: starter(
      `// TODO: Create and call functions
function multiply(a, b) {
  return a * b;
}

const divide = (a, b) => a / b;

console.log(multiply(6, 7));
console.log(divide(20, 4));`,
      `# TODO: Create and call functions
def multiply(a, b):
    return a * b

divide = lambda a, b: a / b

print(multiply(6, 7))
print(divide(20, 4))`
    ),
    solution: solution(
      `function multiply(a, b) {
  return a * b;
}

const divide = (a, b) => a / b;

console.log(multiply(6, 7));
console.log(divide(20, 4));`,
      `def multiply(a, b):
    return a * b

divide = lambda a, b: a / b

print(multiply(6, 7))
print(divide(20, 4))`
    ),
    testCases: [
      sample('function sum(a, b) {\n  return a + b;\n}\nconsole.log(sum(3, 4));', '7'),
      sample('const greet = name => "Hi " + name;\nconsole.log(greet("Bob"));', 'Hi Bob'),
      hidden('function factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n-1);\n}\nconsole.log(factorial(5));', '120')
    ]
  },

  // Topic 3: Async/Await
  {
    slug: 'js-async-await-basics',
    title: 'Async/Await Fundamentals',
    category: 'JavaScript Fundamentals',
    difficulty: 'MEDIUM' as Diff,
    description: `
      Understand asynchronous programming with async/await. Learn how to handle promises and manage timing.

      **Concepts:**
      - Promises: Pending, Fulfilled, Rejected states
      - async functions always return promises
      - await pauses execution until promise resolves
      - Error handling with try/catch
    `,
    descriptionHi: `
      Async programming को async/await से समझो। Promises को handle करना सीखो।

      **Concepts:**
      - Promises: Pending, Fulfilled, Rejected states
      - async functions हमेशा promise return करते हैं
      - await से execution रुकता है जब तक promise resolve न हो
      - Error handling try/catch से करो
    `,
    examples: [
      {
        input: `async function getData() {
  const data = await fetch('data');
  return data;
}`,
        output: 'Promise resolves with data',
        explanation: 'Async function से data fetch करना।'
      }
    ],
    constraints: [
      'async keyword required before function',
      'await only works inside async functions',
      'Always handle errors with try/catch'
    ],
    hints: [
      'async/await makes asynchronous code look synchronous',
      'await pauses the function until the promise settles',
      'Use try/catch for error handling in async functions'
    ],
    approach: `
      1. Define an async function
      2. Use await for promises
      3. Add try/catch for error handling
      4. Return the result
    `,
    approachHi: `
      1. Async function define करो
      2. await use करो promises के लिए
      3. Try/catch add करो error handling के लिए
      4. Result return करो
    `,
    timeComplexity: 'O(n) - Depends on async operations',
    spaceComplexity: 'O(1) - Constant memory for promises',
    solutionExplanation: 'Demonstrates proper async/await syntax with error handling.',
    solutionExplanationHi: 'Async/await को error handling के साथ सही तरीके से लिखना।',
    starter: starter(
      `// TODO: Use async/await
async function fetchData() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Data loaded';
  } catch (error) {
    return 'Error: ' + error.message;
  }
}

// Don't modify below
(async () => console.log(await fetchData()))();`,
      `# TODO: Use async/await
import asyncio

async def fetch_data():
    try:
        # Simulate API call
        await asyncio.sleep(1)
        return 'Data loaded'
    except Exception as e:
        return 'Error: ' + str(e)

# Run the async function
import asyncio
print(asyncio.run(fetch_data()))`
    ),
    solution: solution(
      `async function fetchData() {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Data loaded';
  } catch (error) {
    return 'Error: ' + error.message;
  }
}

(async () => console.log(await fetchData()))();`,
      `import asyncio

async def fetch_data():
    try:
        await asyncio.sleep(1)
        return 'Data loaded'
    except Exception as e:
        return 'Error: ' + str(e)

asyncio.run(fetch_data())`
    ),
    testCases: [
      sample(`async function test() {
  return 'success';
}
test().then(r => console.log(r));`, 'success'),
      sample(`async function wait() {
  await new Promise(r => setTimeout(r, 10));
  return 'done';
}
wait().then(r => console.log(r));`, 'done'),
      hidden(`async function error() {
  try {
    throw new Error('test');
  } catch (e) {
    return e.message;
  }
}
error().then(r => console.log(r));`, 'test')
    ]
  }
];

// ============================================================================
// MODULE 2: ADVANCED - Closures, Prototypes, Event Loop
// ============================================================================

export const jsModule2Problems: SeedProblem[] = [
  {
    slug: 'js-closures-intro',
    title: 'Understanding Closures',
    category: 'JavaScript Advanced',
    difficulty: 'MEDIUM' as Diff,
    description: `
      Learn about closures - functions that remember variables from their parent scope.

      **Key Concepts:**
      - Closure definition and creation
      - Lexical scoping
      - Data privacy with closures
      - Common use cases: counters, factories
    `,
    descriptionHi: `
      Closures सीखो - functions जो अपने parent scope के variables को याद रखते हैं।

      **Key Concepts:**
      - Closure क्या है और कैसे बनता है
      - Lexical scoping
      - Data privacy closures से
      - Use cases: counters, factories
    `,
    examples: [
      {
        input: `function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = createCounter();
console.log(counter());
console.log(counter());`,
        output: '1\n2',
        explanation: 'Closure से counter बनाया जो state याद रखता है।'
      }
    ],
    constraints: [
      'Function must return another function',
      'Inner function should access outer variables',
      'State should persist between calls'
    ],
    hints: [
      'A closure is formed when a function accesses variables from its outer scope',
      'The returned function can access the outer scope\'s variables',
      'This is useful for data privacy and maintaining state'
    ],
    approach: `
      1. Create outer function with variables
      2. Create inner function that accesses outer variables
      3. Return the inner function
      4. Each call creates a new closure with its own state
    `,
    approachHi: `
      1. Outer function बनाओ variables के साथ
      2. Inner function बनाओ जो outer variables access करे
      3. Inner function return करो
      4. हर call का अपना state होगा
    `,
    timeComplexity: 'O(1) - Closure access is constant time',
    spaceComplexity: 'O(n) - Stores n closures with their own state',
    solutionExplanation: 'Creating a closure that maintains private state across multiple calls.',
    solutionExplanationHi: 'Private state को closures में maintain करना।',
    starter: starter(
      `function createMultiplier(multiplier) {
  // TODO: Return a function that multiplies input by multiplier
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));
console.log(triple(5));`,
      `def create_multiplier(multiplier):
    # TODO: Return a function that multiplies
    return lambda number: number * multiplier

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))
print(triple(5))`
    ),
    solution: solution(
      `function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));
console.log(triple(5));`,
      `def create_multiplier(multiplier):
    return lambda number: number * multiplier

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))
print(triple(5))`
    ),
    testCases: [
      sample(`function outer() {
  let x = 10;
  return function() { return x; };
}
console.log(outer()());`, '10'),
      sample(`function makeAdder(a) {
  return function(b) { return a + b; };
}
console.log(makeAdder(5)(3));`, '8'),
      hidden(`function createCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const c = createCounter();
c.inc(); c.inc();
console.log(c.get());`, '2')
    ]
  }
];

// ============================================================================
// MODULE 3: PRACTICAL PATTERNS - Design Patterns, Performance, Testing
// ============================================================================

export const jsModule3Problems: SeedProblem[] = [
  {
    slug: 'js-singleton-pattern',
    title: 'Singleton Design Pattern',
    category: 'JavaScript Patterns',
    difficulty: 'HARD' as Diff,
    description: `
      Implement the Singleton pattern to ensure only one instance of a class exists.

      **Use Cases:**
      - Database connections
      - Logger instances
      - Cache managers
      - Configuration managers
    `,
    descriptionHi: `
      Singleton pattern implement करो - सिर्फ एक ही instance।

      **Use Cases:**
      - Database connections
      - Logger instances
      - Cache managers
      - Configuration managers
    `,
    examples: [
      {
        input: `const Database = (() => {
  let instance;
  return {
    getInstance: () => {
      if (!instance) instance = { connected: true };
      return instance;
    }
  };
})();`,
        output: 'Same instance returned every time',
        explanation: 'Singleton pattern बनाया जो एक ही instance देता है।'
      }
    ],
    constraints: [
      'Must use IIFE (Immediately Invoked Function Expression)',
      'Instance should be created only once',
      'getInstance should return the same instance'
    ],
    hints: [
      'Use an IIFE to create a closure',
      'Store the instance in the closure scope',
      'Return an object with getInstance method'
    ],
    approach: `
      1. Create an IIFE
      2. Declare private instance variable
      3. Create getInstance method
      4. Check if instance exists before creating
      5. Return the same instance
    `,
    approachHi: `
      1. IIFE बनाओ
      2. Private instance variable declare करो
      3. getInstance method बनाओ
      4. Check करो instance exist करता है या नहीं
      5. Same instance return करो
    `,
    timeComplexity: 'O(1) - getInstance lookup',
    spaceComplexity: 'O(1) - Single instance stored',
    solutionExplanation: 'Creating a singleton that guarantees a single instance.',
    solutionExplanationHi: 'Singleton जो एक ही instance guarantee करता है।',
    starter: starter(
      `const Logger = (() => {
  // TODO: Implement singleton logger
  let instance;

  return {
    getInstance: () => {
      if (!instance) {
        instance = {
          log: (msg) => console.log('[LOG]', msg)
        };
      }
      return instance;
    }
  };
})();

const log1 = Logger.getInstance();
const log2 = Logger.getInstance();

console.log(log1 === log2); // Should be true`,
      `class Logger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

log1 = Logger()
log2 = Logger()

print(log1 is log2)  # Should be True`
    ),
    solution: solution(
      `const Logger = (() => {
  let instance;

  return {
    getInstance: () => {
      if (!instance) {
        instance = {
          log: (msg) => console.log('[LOG]', msg)
        };
      }
      return instance;
    }
  };
})();

const log1 = Logger.getInstance();
const log2 = Logger.getInstance();

console.log(log1 === log2);`,
      `class Logger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

log1 = Logger()
log2 = Logger()

print(log1 is log2)`
    ),
    testCases: [
      sample(`const DB = (() => {
  let instance;
  return {
    getInstance: () => instance || (instance = {}),
    getId: () => instance
  };
})();
console.log(DB.getInstance() === DB.getId());`, 'true'),
      sample(`const Config = (() => {
  let instance;
  return {
    getInstance: () => {
      if (!instance) instance = { version: '1.0' };
      return instance;
    }
  };
})();
const c1 = Config.getInstance();
const c2 = Config.getInstance();
console.log(c1 === c2);`, 'true'),
      hidden(`const Counter = (() => {
  let instance;
  return {
    getInstance: () => {
      if (!instance) instance = { count: 0, inc: function() { this.count++; } };
      return instance;
    }
  };
})();
const c = Counter.getInstance();
c.inc(); c.inc();
console.log(c.count);`, '2')
    ]
  }
];

// ============================================================================
// Export all problems
// ============================================================================

export const allJavaScriptProblems = [
  ...jsModule1Problems,
  ...jsModule2Problems,
  ...jsModule3Problems
];

export const jsCourseMeta = {
  name: 'JavaScript Complete Course',
  description: 'Comprehensive JavaScript learning from fundamentals to advanced patterns',
  descriptionHi: 'Fundamentals से advanced patterns तक JavaScript',
  modules: [
    {
      id: 'js-module-1',
      name: 'Module 1: Fundamentals',
      nameHi: 'Module 1: Fundamentals',
      topics: ['Variables & Scope', 'Functions', 'Async/Await'],
      problemCount: jsModule1Problems.length,
      difficulty: 'EASY'
    },
    {
      id: 'js-module-2',
      name: 'Module 2: Advanced Concepts',
      nameHi: 'Module 2: Advanced',
      topics: ['Closures', 'Prototypes', 'Event Loop'],
      problemCount: jsModule2Problems.length,
      difficulty: 'MEDIUM'
    },
    {
      id: 'js-module-3',
      name: 'Module 3: Practical Patterns',
      nameHi: 'Module 3: Practical',
      topics: ['Design Patterns', 'Performance', 'Testing'],
      problemCount: jsModule3Problems.length,
      difficulty: 'HARD'
    }
  ],
  totalProblems: allJavaScriptProblems.length,
  estimatedHours: 150
};
