# JAVASCRIPT COMPLETE COURSE - MODULE 1: LESSON 3

## Lesson 3: Callbacks, Promises, and Async/Await

### Learning Outcomes
- [ ] Understand callback functions and callback hell
- [ ] Master Promises - creation, then, catch, finally
- [ ] Learn Async/Await syntax aur advantage
- [ ] Handle errors properly in async code
- [ ] Use Promise combinators - all, race, allSettled

---

## Beginner Explanation (Simple Language)

JavaScript ek thread language hai - ek time mein ek hi kaam kar sakta hai. Lekin real-world mein database se data fetch karna, API call karna, file read karna - yeh sab time-consuming hote hain. 

Iska solution **Asynchronous Programming** hai - jisme code parallel mein chalta hai. Imagine karo ki aap paani bol rahe ho toh check nahi karte ki paani poora ho gya ki nahi, kuch aur kaam kar rahe ho, aur jab paani puri tarah se bharega toh notification mil jaata hai.

**Callbacks** - puraane tarike mein functions pass karte the execution ke baad call karte the.
**Promises** - modern, better readable.
**Async/Await** - sabse clean aur synchronous jaisa dikta hai.

---

## Key Concepts

### 1. Callbacks
Function ko doosre function mein pass karte ho, later call karte ho.
```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("Data loaded");
  }, 1000);
}
```

### 2. Promises
Three states: Pending → Resolved OR Rejected
```javascript
const promise = new Promise((resolve, reject) => {
  if (success) resolve(value);
  else reject(error);
});
```

### 3. Async/Await
Promises ko synchronous-like syntax se use karna
```javascript
async function fetchData() {
  const data = await somePromise();
  return data;
}
```

### 4. Error Handling
Try-catch, .catch(), error propagation

### 5. Promise Combinators
Promise.all(), Promise.race(), Promise.allSettled()

---

## Code Examples (Progressive)

### Example 1: Basic Callback

```javascript
// Simple callback function
function greet(name, callback) {
  console.log(`Hello, ${name}`);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Alice", sayGoodbye);
```

**Output:**
```
Hello, Alice
Goodbye!
```

**Explanation:** Function ko parameter mein pass karte ho, phir function ke andar call karte ho.

---

### Example 2: Callback with Delay (Simulating API Call)

```javascript
// Simulate API call ke saath callback
function fetchUserData(userId, callback) {
  console.log("Fetching user data...");
  
  setTimeout(() => {
    const user = { id: userId, name: "Alice", email: "alice@example.com" };
    callback(null, user); // Error-first callback pattern
  }, 2000);
}

fetchUserData(1, (error, user) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("User:", user);
  }
});

console.log("Request sent, waiting for response...");
```

**Output:**
```
Fetching user data...
Request sent, waiting for response...
User: { id: 1, name: "Alice", email: "alice@example.com" }
```

**Explanation:** Error-first pattern - callback pehle error parameter leta hai, phir data. Yeh Node.js convention hai.

---

### Example 3: Callback Hell

```javascript
// Callback hell - deeply nested callbacks (avoid karo!)
function fetchUser(userId, callback) {
  setTimeout(() => {
    callback(null, { id: userId, name: "Alice" });
  }, 500);
}

function fetchPosts(userId, callback) {
  setTimeout(() => {
    callback(null, [{ id: 1, title: "First Post" }]);
  }, 500);
}

function fetchComments(postId, callback) {
  setTimeout(() => {
    callback(null, [{ id: 1, text: "Nice post!" }]);
  }, 500);
}

// Callback hell - "Pyramid of Doom"
fetchUser(1, (err, user) => {
  if (err) console.log(err);
  else {
    fetchPosts(user.id, (err, posts) => {
      if (err) console.log(err);
      else {
        fetchComments(posts[0].id, (err, comments) => {
          if (err) console.log(err);
          else {
            console.log("User:", user);
            console.log("Posts:", posts);
            console.log("Comments:", comments);
          }
        });
      }
    });
  }
});
```

**Output:**
```
User: { id: 1, name: "Alice" }
Posts: [{ id: 1, title: "First Post" }]
Comments: [{ id: 1, text: "Nice post!" }]
```

**Explanation:** Callbacks nested hone se code pyramid jaisa dikhta hai - unreadable aur maintain karna hard. Isko Callback Hell bolte hain.

---

### Example 4: Creating a Promise

```javascript
// Promise creation
const promise = new Promise((resolve, reject) => {
  console.log("Promise started");
  
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Success! Data loaded");
    } else {
      reject("Error! Something went wrong");
    }
  }, 1000);
});

// Promise ko handle karna
promise
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

console.log("Promise created, waiting...");
```

**Output:**
```
Promise started
Promise created, waiting...
Result: Success! Data loaded
```

**Explanation:** Promise creation mein executor function two parameters leta hai - resolve (success) aur reject (failure).

---

### Example 5: Promise Chain - Multiple then()

```javascript
// Promise chaining
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "Alice" });
    }, 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, title: "First Post" }]);
    }, 500);
  });
}

// Promise chaining - readable aur clean
fetchData()
  .then((user) => {
    console.log("User:", user);
    return fetchPosts(user.id); // Return next promise
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return posts.length;
  })
  .then((count) => {
    console.log("Total posts:", count);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

console.log("Requests initiated...");
```

**Output:**
```
Requests initiated...
User: { id: 1, name: "Alice" }
Posts: [{ id: 1, title: "First Post" }]
Total posts: 1
```

**Explanation:** Promise chaining se code linear dikhta hai - much better than callbacks!

---

### Example 6: Error Handling in Promises

```javascript
// Error handling with .catch()
function fetchWithError(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Request failed"));
      } else {
        resolve("Data loaded");
      }
    }, 500);
  });
}

// Successful case
fetchWithError(false)
  .then((result) => {
    console.log("Success:", result);
    return result;
  })
  .catch((error) => {
    console.log("Caught error:", error.message);
  });

// Failed case
fetchWithError(true)
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.log("Caught error:", error.message);
  });
```

**Output:**
```
Success: Data loaded
Caught error: Request failed
```

**Explanation:** .catch() promise chain mein error handle karta hai, chain mein kisi bhi point par error aaye wo catch ho jata hai.

---

### Example 7: finally() - Always Execute

```javascript
// finally() - success ya failure, always run hota hai
function loadData(shouldFail = false) {
  return new Promise((resolve, reject) => {
    console.log("Loading...");
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Failed"));
      } else {
        resolve("Data loaded");
      }
    }, 500);
  });
}

loadData(false)
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((error) => {
    console.log("Error:", error.message);
  })
  .finally(() => {
    console.log("Loading complete (cleanup/close connection)");
  });

console.log("Request sent...");
```

**Output:**
```
Loading...
Request sent...
Result: Data loaded
Loading complete (cleanup/close connection)
```

**Explanation:** finally() harmesha execute hota hai - database connection close karna, loading spinner hide karna, etc ke liye.

---

### Example 8: Async Function - Basic

```javascript
// Async function - automatically returns Promise
async function fetchUserData(userId) {
  return { id: userId, name: "Alice" };
}

// Call async function
fetchUserData(1)
  .then((user) => {
    console.log("User:", user);
  });

console.log("Request sent...");
```

**Output:**
```
Request sent...
User: { id: 1, name: "Alice" }
```

**Explanation:** Async function automatically Promise return karta hai. Return value Promise resolve karta hai.

---

### Example 9: Await - Synchronous-like Code

```javascript
// Simulating API calls
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 500);
  });
}

function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, title: "Post 1" }]);
    }, 500);
  });
}

// Async/Await - looks like synchronous code!
async function loadUserData() {
  console.log("Starting to load...");
  
  try {
    const user = await getUser(1);
    console.log("User loaded:", user);
    
    const posts = await getPosts(user.id);
    console.log("Posts loaded:", posts);
    
    console.log("All data loaded!");
  } catch (error) {
    console.log("Error:", error);
  }
}

loadUserData();
console.log("Function called...");
```

**Output:**
```
Starting to load...
Function called...
User loaded: { id: 1, name: "Alice" }
Posts loaded: [{ id: 1, title: "Post 1" }]
All data loaded!
```

**Explanation:** Await से code synchronous jaisa dikhta hai lekin actually asynchronous hai. Promise resolve hone tak wait karta hai.

---

### Example 10: Error Handling with Async/Await

```javascript
// Error handling - try/catch
async function fetchDataWithError(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Network error"));
      } else {
        resolve("Data loaded");
      }
    }, 500);
  });
}

async function handleRequest(shouldFail) {
  try {
    const result = await fetchDataWithError(shouldFail);
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.log("Caught error:", error.message);
    // Optionally return default value
    return null;
  } finally {
    console.log("Request complete");
  }
}

// Successful call
handleRequest(false);

// Failed call
handleRequest(true);
```

**Output:**
```
Success: Data loaded
Request complete
Caught error: Network error
Request complete
```

**Explanation:** Try-catch se synchronous error handling jaisa likhte hain - much cleaner!

---

### Example 11: Promise.all() - Wait for All

```javascript
// Promise.all() - sabse wait karo, ek failure toh sab fail
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 500);
});
const promise3 = fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((res) => res.json());

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log("All resolved:", results);
  })
  .catch((error) => {
    console.log("One failed:", error);
  });

// If one fails
const p1 = Promise.resolve("success");
const p2 = Promise.reject("error");
const p3 = Promise.resolve("also success");

Promise.all([p1, p2, p3])
  .then((results) => {
    console.log("Results:", results);
  })
  .catch((error) => {
    console.log("Error caught:", error); // "error"
  });
```

**Output:**
```
All resolved: [1, 2, {...todo data...}]
Error caught: error
```

**Explanation:** Promise.all() sabse parallel mein wait karta hai. Ek fail hue toh immediately catch call hota hai. Parallel API calls ke liye perfect!

---

### Example 12: Promise.race() - First One Wins

```javascript
// Promise.race() - first resolved/rejected woh answer deta hai
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject("Timeout!"), 2000)
);

const fetchData = new Promise((resolve) =>
  setTimeout(() => resolve("Data fetched"), 500)
);

Promise.race([timeout, fetchData])
  .then((result) => {
    console.log("First to complete:", result);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

// Another example
const p1 = new Promise((resolve) =>
  setTimeout(() => resolve("Slow request"), 2000)
);

const p2 = new Promise((resolve) =>
  setTimeout(() => resolve("Fast request"), 500)
);

Promise.race([p1, p2])
  .then((result) => {
    console.log("Winner:", result); // Fast request
  });
```

**Output:**
```
First to complete: Data fetched
Winner: Fast request
```

**Explanation:** Race() jo sabse pehle resolve/reject hota hai, wo answer deta hai. Timeout implementation ke liye use hota hai.

---

### Example 13: Promise.allSettled() - Wait for All (Even Failures)

```javascript
// Promise.allSettled() - sabse wait karo, success ya failure dono
const p1 = Promise.resolve("Success 1");
const p2 = Promise.reject("Error 1");
const p3 = Promise.resolve("Success 2");
const p4 = Promise.reject("Error 2");

Promise.allSettled([p1, p2, p3, p4])
  .then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        console.log("✅ Success:", result.value);
      } else {
        console.log("❌ Failed:", result.reason);
      }
    });
  });
```

**Output:**
```
✅ Success: Success 1
❌ Failed: Error 1
✅ Success: Success 2
❌ Failed: Error 2
```

**Explanation:** allSettled() sabse wait karta hai, failures ko skip nahi karta. Partial failures handle karna ho toh iska use karo.

---

### Example 14: Async/Await with Promise.all()

```javascript
// Async/Await + Promise.all() - powerful combination
async function fetchAllData() {
  try {
    const userPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ id: 1, name: "Alice" }), 500)
    );
    
    const postsPromise = new Promise((resolve) =>
      setTimeout(() => resolve([{ id: 1, title: "Post 1" }]), 500)
    );
    
    // Load parallel - wait for all
    const [user, posts] = await Promise.all([userPromise, postsPromise]);
    
    console.log("User:", user);
    console.log("Posts:", posts);
    console.log("Total time: ~500ms (not 1000ms!)");
    
  } catch (error) {
    console.log("Error:", error);
  }
}

fetchAllData();
```

**Output:**
```
User: { id: 1, name: "Alice" }
Posts: [{ id: 1, title: "Post 1" }]
Total time: ~500ms (not 1000ms!)
```

**Explanation:** Parallel execution से total time kam hota hai. Sequential (await, await) करो तो 1000ms, parallel (Promise.all) करो तो 500ms!

---

## Real-World Use Cases

### 1. **API Calls - Fetch Data**
```javascript
async function loadUserProfile(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("User not found");
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}
```

### 2. **Multiple Parallel Requests**
```javascript
async function loadDashboard() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch("/api/users").then(r => r.json()),
      fetch("/api/posts").then(r => r.json()),
      fetch("/api/comments").then(r => r.json())
    ]);
    
    displayDashboard(users, posts, comments);
  } catch (error) {
    showError("Failed to load dashboard");
  }
}
```

### 3. **Timeout Implementation**
```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}
```

### 4. **Retry Logic**
```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting await

```javascript
// WRONG - returns Promise, not value
async function getUser() {
  const user = fetch("/api/user").json(); // Returns Promise!
  return user;
}

// CORRECT
async function getUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}
```

### ❌ Mistake 2: Callback Hell

```javascript
// WRONG
fetchUser((user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});

// CORRECT
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  console.log(comments);
}
```

### ❌ Mistake 3: Not Handling Errors

```javascript
// WRONG - no error handling
async function loadData() {
  const data = await fetch("/api/data").then(r => r.json());
  console.log(data);
}

// CORRECT
async function loadData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}
```

### ❌ Mistake 4: Sequential When Should Be Parallel

```javascript
// WRONG - sequential (1000ms)
async function loadData() {
  const user = await fetch("/api/user").then(r => r.json()); // 500ms
  const posts = await fetch("/api/posts").then(r => r.json()); // 500ms
  return { user, posts }; // Total: 1000ms
}

// CORRECT - parallel (500ms)
async function loadData() {
  const [user, posts] = await Promise.all([
    fetch("/api/user").then(r => r.json()),
    fetch("/api/posts").then(r => r.json())
  ]);
  return { user, posts }; // Total: 500ms
}
```

### ❌ Mistake 5: async/await मे return का use

```javascript
// WRONG - async automatically Promise return karta hai
async function getData() {
  return "data"; // Already wrapped in Promise
}

const result = getData(); // This is a Promise
// console.log(result); // Promise { "data" }

// CORRECT
async function getData() {
  return "data";
}

const result = await getData(); // Unwrap Promise
console.log(result); // "data"
```

---

## Best Practices

1. **Default to Async/Await** - Modern, readable, synchronous-like
2. **Use Promise.all() for Parallel** - Sequential मत करो unless necessary
3. **Always Handle Errors** - Try-catch या .catch()
4. **Avoid Mixing Callbacks** - Choose Promises या Async/Await
5. **Use finally() for Cleanup** - Connections close करना
6. **Check Response Status** - HTTP errors handle करना
7. **Implement Timeout** - Hung requests से बचना
8. **Use AbortController** - Request cancel करने के लिए

---

## Interview Q&A

### Q1: Explain the difference between Callbacks, Promises, and Async/Await.

**A:** तीनों asynchronous code handle करते हैं, लेकिन readability में अलग हैं:

| Feature | Callbacks | Promises | Async/Await |
|---------|-----------|----------|------------|
| Readability | Hard | Better | Best |
| Error Handling | Callback param | .catch() | try/catch |
| Chaining | Nesting | .then() chain | Sequential |
| Debugging | Hard | Medium | Easy |

**Code Example:**
```javascript
// Callback - nested, hard to read
getData((err, data) => {
  if (err) console.log(err);
  else processData((err, result) => {
    // Nested again!
  });
});

// Promise - chained, better
getData()
  .then(data => processData())
  .then(result => console.log(result))
  .catch(err => console.log(err));

// Async/Await - looks synchronous
async function process() {
  try {
    const data = await getData();
    const result = await processData();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
```

**Follow-up:** "Modern JavaScript में Async/Await recommend है, Callbacks से बचो."

---

### Q2: What are Promises and their states?

**A:** Promise एक object है जो एक eventual result represent करता है (success या failure).

**तीन states:**
1. **Pending** - Initial state, operation चल रहा है
2. **Fulfilled (Resolved)** - Operation successful, resolve() called
3. **Rejected** - Operation failed, reject() called

**Code Example:**
```javascript
const promise = new Promise((resolve, reject) => {
  // Pending state
  
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Operation successful"); // Fulfilled state
    } else {
      reject("Operation failed"); // Rejected state
    }
  }, 1000);
});

promise
  .then(result => console.log("Success:", result))
  .catch(error => console.log("Error:", error));
```

**Follow-up:** "Once state change हो जाए (resolve या reject), फिर change नहीं हो सकता - immutable है!"

---

### Q3: Explain Promise.all() vs Promise.race() vs Promise.allSettled().

**A:** तीनों multiple promises handle करते हैं, लेकिन behavior अलग है:

**Promise.all()** - सभी की wait करो, एक fail हो तो सब fail
```javascript
Promise.all([p1, p2, p3])
  .then(results => console.log(results)); // [v1, v2, v3]
  .catch(error => console.log(error)); // First error
```

**Promise.race()** - सबसे पहला (resolved/rejected) जीता
```javascript
Promise.race([p1, p2, p3])
  .then(result => console.log(result)); // First to complete
```

**Promise.allSettled()** - सभी की wait करो, results में status
```javascript
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(r => {
      if (r.status === "fulfilled") console.log(r.value);
      else console.log(r.reason);
    });
  });
```

**Follow-up:** "Performance के लिए Promise.all() use करो parallel requests के लिए."

---

### Q4: Explain Async/Await with error handling.

**A:** Async/Await से asynchronous code synchronous जैसा लिखा जा सकता है।

**Code Example:**
```javascript
// Async function - automatically Promise return करता है
async function fetchUserData(userId) {
  try {
    // await से Promise resolve होने तक wait करो
    const response = await fetch(`/api/users/${userId}`);
    
    // Status check करो
    if (!response.ok) throw new Error("User not found");
    
    // JSON parse करो
    const user = await response.json();
    
    console.log("User loaded:", user);
    return user;
    
  } catch (error) {
    // try block में कहीं भी error आए, यहाँ catch होता है
    console.error("Error:", error.message);
    return null;
    
  } finally {
    // Success या failure, always run होता है
    console.log("Request complete");
  }
}

// Call करो
fetchUserData(1);
```

**Follow-up:** "Await साथ try/catch जरूरी है, नहीं तो unhandled promise rejection होता है!"

---

### Q5: What's the difference between await and .then()?

**A:** दोनों Promise resolve handle करते हैं, लेकिन syntax अलग है:

**await** - more readable, synchronous-like
```javascript
async function process() {
  const data = await fetchData(); // Wait for resolve
  console.log(data);
}
```

**then()** - functional approach
```javascript
fetchData()
  .then(data => {
    console.log(data);
  });
```

**Performance difference:**
```javascript
// Sequential (slow) - दोनों tasks के लिए 1000ms
async function sequential() {
  const a = await task1(); // 500ms
  const b = await task2(); // 500ms
  return [a, b]; // Total: 1000ms
}

// Parallel (fast) - दोनों साथ-साथ, 500ms
async function parallel() {
  const [a, b] = await Promise.all([task1(), task2()]);
  return [a, b]; // Total: 500ms
}
```

**Follow-up:** "Performance के लिए parallel execution use करो जहाँ dependency न हो!"

---

## Practice Exercises

### Exercise 1: Convert Callback to Promise
```javascript
// Callback version
function readFile(filename, callback) {
  // Read file logic
  callback(null, "file content");
}

// Convert to Promise
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    // Read file logic
    resolve("file content");
  });
}
```

### Exercise 2: Convert to Async/Await
```javascript
// Promise chain
fetch("/api/user")
  .then(r => r.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(r => r.json())
  .then(posts => console.log(posts));

// Convert to async/await
async function loadUserPosts() {
  const user = await fetch("/api/user").then(r => r.json());
  const posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
  console.log(posts);
}
```

### Exercise 3: Error Handling
```javascript
// Add error handling
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
```

### Exercise 4: Parallel Requests
```javascript
// Load 3 resources in parallel
async function loadDashboard() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/comments").then(r => r.json())
  ]);
  return { users, posts, comments };
}
```

### Exercise 5: Retry Logic
```javascript
// Retry failed requests 3 times
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

---

## Key Takeaways

- **Callbacks ❌** - Hard to read, nesting issues
- **Promises ✅** - Better, chainable, then/catch/finally
- **Async/Await ✅✅** - Best, synchronous-like, clean
- **Error Handling** - हमेशा try/catch या .catch() use करो
- **Parallel > Sequential** - Promise.all() से performance बढ़ता है
- **await = wait करो** - Promise resolve होने तक
- **finally() = cleanup** - Connections close करना, spinners hide करना
- **Status check** - fetch response.ok check करो हमेशा

---

## Next Steps

Ab aap Callbacks, Promises, aur Async/Await master kar gaye! 🎉

**Ab Module 1 ke 5 Beginner Projects start करेंगे:**
1. Calculator App
2. Todo List with localStorage
3. Weather API Fetcher
4. Chat Application (WebSocket concept)
5. File Manager

Padhai continue करो! 🚀

