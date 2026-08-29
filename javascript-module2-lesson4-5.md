# JAVASCRIPT COMPLETE COURSE - MODULE 2: LESSON 4 & 5

---

# Lesson 4: Error Handling

### Learning Outcomes
- [ ] Understand Error types और hierarchy
- [ ] Master try/catch/finally
- [ ] Learn throwing custom errors
- [ ] Handle async errors properly
- [ ] Debug effectively

---

## Quick Overview

```javascript
// Basic structure
try {
  // Code जो error throw कर सकता है
  riskyOperation();
} catch (error) {
  // Error को handle करो
  console.log("Error:", error.message);
} finally {
  // Always execute - cleanup के लिए
  closeConnection();
}
```

---

## Code Examples

### Example 1: Basic Try/Catch
```javascript
try {
  const result = JSON.parse("invalid json");
} catch (error) {
  console.log("Caught error:", error.message);
  // Output: Caught error: Unexpected token i in JSON at position 0
}

console.log("Program continues"); // Execute होता है!
```

### Example 2: Error Types
```javascript
// ReferenceError
try {
  console.log(undefinedVar);
} catch (e) {
  console.log(e instanceof ReferenceError); // true
}

// TypeError
try {
  null.property;
} catch (e) {
  console.log(e instanceof TypeError); // true
}

// SyntaxError (compile time)
// const x = {invalid: }; // Cannot be caught

// RangeError
try {
  new Array(-1); // Negative length
} catch (e) {
  console.log(e instanceof RangeError); // true
}
```

### Example 3: Custom Errors
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  if (!email.includes("@")) {
    throw new ValidationError("Invalid email format");
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  }
}
```

### Example 4: Finally Block
```javascript
const file = openFile();

try {
  processFile(file);
} catch (error) {
  console.log("Error processing:", error);
} finally {
  file.close(); // हमेशा run होता है!
  console.log("Cleanup complete");
}
```

### Example 5: Async Error Handling
```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP Error: " + response.status);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch:", error.message);
    return null;
  }
}

// Promise chain में भी
fetch(url)
  .then(r => r.json())
  .catch(error => {
    console.error("Error:", error);
  });
```

### Example 6: Error Propagation
```javascript
function level3() {
  throw new Error("Something went wrong");
}

function level2() {
  try {
    level3();
  } catch (error) {
    throw new Error("Level2 error: " + error.message);
  }
}

function level1() {
  try {
    level2();
  } catch (error) {
    console.log("Final catch:", error.message);
    // Output: Final catch: Level2 error: Something went wrong
  }
}

level1();
```

### Example 7: Stack Trace
```javascript
try {
  function a() { b(); }
  function b() { c(); }
  function c() { throw new Error("Deep error"); }
  a();
} catch (error) {
  console.log(error.stack);
  // Error: Deep error
  //     at c (file.js:3)
  //     at b (file.js:2)
  //     at a (file.js:1)
}
```

### Example 8: Error in Promises
```javascript
Promise.resolve()
  .then(() => {
    throw new Error("Promise error");
  })
  .catch(error => {
    console.log("Caught:", error.message);
  })
  .then(() => {
    console.log("Continues after error");
  });
```

### Example 9: Unhandled Rejection
```javascript
// ❌ WRONG - unhandled rejection
Promise.reject(new Error("Unhandled error"));

// ✅ CORRECT - handle करो
Promise.reject(new Error("Handled error"))
  .catch(error => {
    console.log("Error handled:", error);
  });

// Global handler (last resort)
window.addEventListener("unhandledrejection", (event) => {
  console.log("Unhandled rejection:", event.reason);
});
```

### Example 10: Error Boundaries Pattern
```javascript
class ApiService {
  async request(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Log करो
      console.error("API Error:", error);
      
      // User-friendly message return करो
      throw {
        message: "Failed to fetch data",
        details: error.message
      };
    }
  }
}

// Use करो
const api = new ApiService();
try {
  const data = await api.request("/api/users");
} catch (error) {
  showErrorMessage(error.message);
}
```

---

## Best Practices

1. **Specific catch blocks** - Generic `catch` avoid करो
2. **Always throw meaningful errors** - Stack trace debugging को help करेगा
3. **Use custom error classes** - Better error handling
4. **Finally for cleanup** - Resources close करना
5. **Async/await prefer करो** - Promises से cleaner

---

## Interview Q&A

### Q1: Try/Catch/Finally execution order?

**A:**
1. Try block execute होता है
2. अगर error है तो catch run होता है
3. Finally हमेशा run होता है, अगले code से पहले

```javascript
try {
  console.log("1. Try");
  throw new Error("error");
} catch (e) {
  console.log("2. Catch");
} finally {
  console.log("3. Finally");
}
console.log("4. After");
// Output: 1, 2, 3, 4
```

---

---

# Lesson 5: Regular Expressions (Regex)

### Learning Outcomes
- [ ] Understand Regex patterns
- [ ] Master common patterns
- [ ] Use regex methods effectively
- [ ] Validate input
- [ ] Replace और extract

---

## Quick Overview

```javascript
// Create करने के तरीके
const regex1 = /pattern/flags;
const regex2 = new RegExp("pattern", "flags");

// Common flags
// g = global (सभी matches)
// i = case-insensitive
// m = multiline
```

---

## Code Examples

### Example 1: Basic Pattern Matching
```javascript
const regex = /hello/i; // Case-insensitive

console.log(regex.test("Hello World")); // true
console.log(regex.test("Hi there")); // false

// exec() matches return करता है
const match = regex.exec("Hello World");
console.log(match[0]); // "Hello"
```

### Example 2: Character Classes
```javascript
/[abc]/ // 'a' या 'b' या 'c'
/[0-9]/ // Any digit
/[a-z]/ // Any lowercase
/\d/ // Digit (same as [0-9])
/\w/ // Word character (letters, digits, _)
/\s/ // Whitespace

// Test करो
console.log(/[0-9]/.test("abc123")); // true
console.log(/[a-z]/.test("ABC")); // false
```

### Example 3: Quantifiers
```javascript
/a{3}/ // Exactly 3 'a's
/a{2,4}/ // 2 to 4 'a's
/a+/ // One or more 'a's
/a*/ // Zero or more 'a's
/a?/ // Zero or one 'a'

// Test करो
console.log(/a{3}/.test("aaa")); // true
console.log(/a+/.test("bbb")); // false
```

### Example 4: Anchors
```javascript
/^hello/ // Start with "hello"
/world$/ // End with "world"
/^hello world$/ // Exact match

console.log(/^hello/.test("hello world")); // true
console.log(/world$/.test("hello world")); // true
```

### Example 5: String Methods with Regex
```javascript
const text = "apple banana apple cherry apple";

// match() - सभी matches
const matches = text.match(/apple/g);
console.log(matches); // ["apple", "apple", "apple"]

// search() - पहला match का index
console.log(text.search("banana")); // 6

// replace() - replace करो
console.log(text.replace(/apple/g, "orange"));
// "orange banana orange cherry orange"

// split() - split करो
const words = "apple-banana-cherry".split("-");
console.log(words); // ["apple", "banana", "cherry"]
```

### Example 6: Groups और Capturing
```javascript
const email = /(\w+)@(\w+\.\w+)/;
const match = email.exec("user@example.com");

console.log(match[0]); // "user@example.com" (full match)
console.log(match[1]); // "user" (first group)
console.log(match[2]); // "example.com" (second group)

// replace में groups use करो
"John Doe".replace(/(\w+) (\w+)/, "$2, $1");
// "Doe, John"
```

### Example 7: Input Validation
```javascript
// Email validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone number (basic)
function validatePhone(phone) {
  const regex = /^\d{10}$/;
  return regex.test(phone);
}

// Password (at least 8 chars, uppercase, number)
function validatePassword(pwd) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pwd);
}
```

### Example 8: lookahead और lookbehind
```javascript
// Lookahead (?=pattern)
/foo(?=bar)/ // "foo" जो "bar" से पहले हो

// Negative lookahead (?!pattern)
/foo(?!bar)/ // "foo" जो "bar" से पहले न हो

// Lookbehind (?<=pattern)
/(?<=foo)bar/ // "bar" जो "foo" के बाद हो

// Test करो
console.log(/foo(?=bar)/.test("foobar")); // true
console.log(/foo(?!bar)/.test("foobaz")); // true
```

### Example 9: Extract Data
```javascript
const html = '<a href="https://example.com">Link</a>';

// URL extract करो
const urlRegex = /href="([^"]+)"/;
const match = html.match(urlRegex);
console.log(match[1]); // "https://example.com"

// Multiple matches
const text = "Price: $10, $20, $30";
const prices = text.match(/\$(\d+)/g);
console.log(prices); // ["$10", "$20", "$30"]
```

### Example 10: Replace Patterns
```javascript
// Template literals में replace करो
const template = "Hello {name}, you are {age}";
const data = { name: "Alice", age: 30 };

const result = template.replace(/{(\w+)}/g, (match, key) => {
  return data[key];
});

console.log(result); // "Hello Alice, you are 30"
```

---

## Common Patterns

```javascript
// Email
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// URL
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

// IP Address
/^(\d{1,3}\.){3}\d{1,3}$/

// Credit Card
/^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/

// Date (DD/MM/YYYY)
/^\d{2}\/\d{2}\/\d{4}$/

// Hex Color
/^#(?:[0-9a-f]{3}){1,2}$/i

// Slug (lowercase, hyphens)
/^[a-z0-9]+(?:-[a-z0-9]+)*$/
```

---

## Best Practices

1. **Simple regex रखो** - Complex regex unreadable हो जाता है
2. **Test करो** - Online regex testers use करो
3. **Escape special chars** - `.`, `*`, `?`, etc.
4. **Performance** - Complex patterns से bactracking हो सकता है
5. **Readable comments** - `/regex/ // purpose` लिखो

---

## Interview Q&A

### Q1: Regex के flags क्या हैं?

**A:**
- `g` = global (सभी matches)
- `i` = case-insensitive
- `m` = multiline (^ और $ per line)
- `s` = dotAll (. सब कुछ match करे, including newline)
- `u` = unicode
- `y` = sticky

```javascript
const text = "Apple apple APPLE";
console.log(text.match(/apple/)); // ["apple"] - first only
console.log(text.match(/apple/g)); // ["apple", "APPLE"] - global
console.log(text.match(/apple/gi)); // ["Apple", "apple", "APPLE"] - both
```

---

### Q2: Capturing groups vs Non-capturing groups?

**A:**
```javascript
// Capturing: (pattern)
const regex1 = /(\d+)-(\d+)/;
const match = "123-456".match(regex1);
console.log(match[1]); // "123" - accessible!

// Non-capturing: (?:pattern)
const regex2 = /(?:\d+)-(\d+)/;
const match2 = "123-456".match(regex2);
console.log(match2[1]); // "456" - first group skipped
```

---

---

## Practice Exercises (Lessons 4 & 5)

### Exercise 1: Error Handling
```javascript
async function safeCall(promise) {
  try {
    return await promise;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
```

### Exercise 2: Custom Error
```javascript
class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

### Exercise 3: Email Validation
```javascript
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Exercise 4: Extract Numbers
```javascript
const text = "Price: 100, Discount: 20, Total: 80";
const numbers = text.match(/\d+/g);
// ["100", "20", "80"]
```

### Exercise 5: URL Parsing
```javascript
const url = "https://example.com/path?key=value#anchor";
const regex = /^(https?):\/\/([^/?#]+)(\/[^?#]*)?\?([^#]*)#(.*)$/;
const parts = url.match(regex);
// [protocol, domain, path, query, anchor]
```

---

## Key Takeaways - Lessons 4 & 5

### Error Handling
- Try/catch/finally structure
- Custom error classes
- Async error handling
- Error propagation
- Cleanup in finally

### Regex
- Patterns और flags
- String methods (match, replace, split)
- Validation patterns
- Capturing groups
- Performance considerations

---

## Next Steps

Module 2 के अंतिम phase में हम **5 Advanced Projects** बनाएंगे!

Padhai continue करो! 🚀

