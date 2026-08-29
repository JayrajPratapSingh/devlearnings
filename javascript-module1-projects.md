# JAVASCRIPT COMPLETE COURSE - MODULE 1: PROJECTS

## Module 1: Fundamentals - 5 Beginner Projects

---

# Project 1: Calculator App

## Learning Goals
- ✅ DOM manipulation
- ✅ Event handling
- ✅ String to number conversion
- ✅ Conditional logic
- ✅ Function composition

## Duration
**2-3 hours**

## Difficulty
⭐ Beginner

## Requirements

### Features to Implement
1. **Display Screen** - Current input/result दिखाना
2. **Number Buttons** - 0-9 और decimal point
3. **Operations** - +, -, *, /
4. **Equals Button** - Calculate result
5. **Clear Button** - सब reset करना
6. **Delete Button** - Last digit remove करना

### Specifications
- Maximum 12 digits display
- Show pending operation
- Handle decimal numbers
- Prevent multiple decimal points
- Show error for invalid operations (like division by 0)

---

## Project Structure

```
calculator-app/
├── index.html
├── styles.css
└── script.js
```

---

## Starter Code - HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="calculator">
        <div class="display">
            <input type="text" id="display" readonly>
        </div>
        <div class="buttons">
            <!-- Yahan buttons add करना है -->
            <!-- Row 1: C, DEL, /, * -->
            <!-- Row 2: 7, 8, 9, - -->
            <!-- Row 3: 4, 5, 6, + -->
            <!-- Row 4: 1, 2, 3, = -->
            <!-- Row 5: 0, . -->
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Starter Code - CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.calculator {
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    padding: 20px;
    width: 320px;
}

.display {
    margin-bottom: 20px;
}

#display {
    width: 100%;
    padding: 15px;
    font-size: 28px;
    text-align: right;
    border: 2px solid #ddd;
    border-radius: 5px;
    background: #f0f0f0;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button {
    padding: 15px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
}

button:hover {
    transform: scale(1.05);
}

button:active {
    transform: scale(0.95);
}

/* Number buttons */
.number {
    background: #f0f0f0;
    color: #333;
}

.number:hover {
    background: #e0e0e0;
}

/* Operation buttons */
.operation {
    background: #667eea;
    color: white;
}

.operation:hover {
    background: #5568d3;
}

/* Equals button */
.equals {
    background: #48bb78;
    color: white;
    grid-column: span 2;
}

.equals:hover {
    background: #38a169;
}

/* Clear button */
.clear {
    background: #f56565;
    color: white;
    grid-column: span 2;
}

.clear:hover {
    background: #e53e3e;
}

/* Delete button */
.delete {
    background: #ed8936;
    color: white;
}

.delete:hover {
    background: #dd6b20;
}
```

---

## Starter Code - JavaScript

```javascript
// Calculator class बनाओ
class Calculator {
    constructor(displayId) {
        this.display = document.getElementById(displayId);
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    // Number append करो
    appendNumber(num) {
        // TODO: Implement
        // - If currentValue is '0', replace it
        // - Prevent multiple decimal points
        // - Update display
    }

    // Operation set करो
    setOperation(op) {
        // TODO: Implement
        // - If operation already set, calculate first
        // - Store current value
        // - Set new operation
    }

    // Calculate करो
    calculate() {
        // TODO: Implement
        // - Perform operation
        // - Show result
        // - Reset values
    }

    // Clear करो
    clear() {
        // TODO: Implement
        // - Reset all values
        // - Display '0'
    }

    // Last digit delete करो
    deleteLastDigit() {
        // TODO: Implement
        // - Remove last character
        // - If empty, show '0'
    }

    // Display update करो
    updateDisplay() {
        this.display.value = this.currentValue;
    }
}

// Initialize करो
const calculator = new Calculator('display');

// Button event listeners attach करो
// TODO: Add click events to all buttons
```

---

## Hints

1. **Calculator Class Use करो** - Organized code के लिए
2. **String vs Number** - parseFloat() से convert करो
3. **Decimal Point** - Check करो पहले से है या नहीं
4. **Zero Display** - Initially '0' दिखाओ
5. **Operation Pending** - Previous operation calculate करो new operation set करने से पहले

---

## Testing Checklist

- [ ] 5 + 3 = 8
- [ ] 10 - 4 = 6
- [ ] 6 * 7 = 42
- [ ] 20 / 4 = 5
- [ ] 10 / 0 shows error
- [ ] Decimal numbers work (3.14 * 2 = 6.28)
- [ ] Clear button resets everything
- [ ] Delete button removes last digit
- [ ] Multiple operations chain (5 + 3 + 2 = 10)
- [ ] Display shows pending operation

---

## Solution Hints (Don't peek unless stuck!)

<details>
<summary>appendNumber Implementation</summary>

```javascript
appendNumber(num) {
    if (this.shouldResetDisplay) {
        this.currentValue = num;
        this.shouldResetDisplay = false;
    } else {
        if (this.currentValue === '0' && num !== '.') {
            this.currentValue = num;
        } else if (num === '.' && this.currentValue.includes('.')) {
            return; // Prevent multiple decimals
        } else {
            this.currentValue += num;
        }
    }
    this.updateDisplay();
}
```

</details>

---

---

# Project 2: Todo List with localStorage

## Learning Goals
- ✅ DOM manipulation (create/remove elements)
- ✅ Array methods (push, filter, map)
- ✅ localStorage API
- ✅ Event delegation
- ✅ Todo state management

## Duration
**2-3 hours**

## Difficulty
⭐ Beginner

## Requirements

### Features
1. **Add Todo** - Input से नया todo add करना
2. **Display Todos** - List में दिखाना
3. **Mark Complete** - Checkbox से mark करना
4. **Delete Todo** - Individual todo delete करना
5. **Clear Completed** - सब completed todos delete करना
6. **Persist Data** - localStorage में save करना
7. **Filter View** - All, Active, Completed दिखाना

---

## Project Structure

```
todo-app/
├── index.html
├── styles.css
└── script.js
```

---

## Starter Code - HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>My Todos</h1>
        
        <div class="input-container">
            <input 
                type="text" 
                id="todoInput" 
                placeholder="Add a new todo..."
                autocomplete="off"
            >
            <button id="addBtn">Add</button>
        </div>

        <div class="filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>

        <ul id="todoList" class="todo-list">
            <!-- Todos यहाँ आएंगे -->
        </ul>

        <div class="actions">
            <span id="todoCount">0 items left</span>
            <button id="clearCompleted">Clear Completed</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Starter Code - CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
}

.input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#todoInput {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

#todoInput:focus {
    outline: none;
    border-color: #667eea;
}

#addBtn {
    padding: 12px 30px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background 0.3s;
}

#addBtn:hover {
    background: #5568d3;
}

.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.filter-btn {
    padding: 8px 16px;
    border: 2px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
}

.filter-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.todo-list {
    list-style: none;
    margin-bottom: 20px;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 10px;
    gap: 10px;
    transition: all 0.3s;
}

.todo-item.completed {
    opacity: 0.6;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #999;
}

.todo-item:hover {
    background: #f9f9f9;
}

.todo-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.todo-text {
    flex: 1;
}

.delete-btn {
    background: #f56565;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
}

.delete-btn:hover {
    background: #e53e3e;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

#clearCompleted {
    background: #ed8936;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
}

#clearCompleted:hover {
    background: #dd6b20;
}
```

---

## Starter Code - JavaScript

```javascript
// Todo class बनाओ
class TodoApp {
    constructor(storageKey = 'todos') {
        this.storageKey = storageKey;
        this.todos = this.loadFromStorage();
        this.currentFilter = 'all';
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.addBtn = document.getElementById('addBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.todoCount = document.getElementById('todoCount');
        this.clearCompleted = document.getElementById('clearCompleted');
    }

    attachEventListeners() {
        // TODO: Add button click
        // TODO: Input enter key
        // TODO: Filter buttons click
        // TODO: Clear completed click
        // TODO: Event delegation for todo items
    }

    // Todos add करो
    addTodo(text) {
        // TODO: Implement
        // - Create todo object
        // - Add to todos array
        // - Save to storage
        // - Render
    }

    // Todo complete करो
    toggleTodo(id) {
        // TODO: Implement
        // - Find todo by id
        // - Toggle completed status
        // - Save and render
    }

    // Todo delete करो
    deleteTodo(id) {
        // TODO: Implement
        // - Filter out todo
        // - Save and render
    }

    // Completed todos clear करो
    clearCompletedTodos() {
        // TODO: Implement
        // - Filter completed todos
        // - Update todos array
        // - Save and render
    }

    // Filter apply करो
    filterTodos() {
        // TODO: Implement
        // - Based on currentFilter
        // - Return filtered todos
    }

    // Storage में save करो
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    // Storage से load करो
    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Render करो
    render() {
        // TODO: Implement
        // - Clear todo list
        // - Get filtered todos
        // - Create elements for each
        // - Update counter
    }
}

// Initialize करो
const app = new TodoApp();
```

---

## Hints

1. **Todo Object Structure** - `{ id, text, completed, createdAt }`
2. **Event Delegation** - Parent element पर listener attach करो
3. **localStorage** - JSON stringify/parse करो
4. **Filter** - Array filter() method use करो
5. **Unique ID** - Date.now() या crypto.getRandomValues() से generate करो

---

## Testing Checklist

- [ ] Add todo works
- [ ] Display shows all todos
- [ ] Checkbox marks complete
- [ ] Completed todos show strikethrough
- [ ] Delete button removes todo
- [ ] Clear Completed works
- [ ] Filters (All, Active, Completed) work
- [ ] Data persists after refresh
- [ ] Empty input validation
- [ ] Counter updates correctly

---

---

# Project 3: Weather API Fetcher

## Learning Goals
- ✅ Fetch API usage
- ✅ Async/Await
- ✅ Error handling
- ✅ DOM manipulation
- ✅ API integration

## Duration
**2-3 hours**

## Difficulty
⭐ Beginner

## Requirements

### Features
1. **Search City** - City name से weather search करना
2. **Display Weather** - Temperature, condition, humidity, wind
3. **Current Location** - Geolocation से current weather
4. **Error Handling** - Invalid city, network errors
5. **Loading State** - While fetching show loader
6. **Save Favorites** - Recent searches रखना

---

## API Information

```
OpenWeatherMap API
Endpoint: https://api.openweathermap.org/data/2.5/weather
Free API Key: Get from https://openweathermap.org/api

Example:
https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=YOUR_API_KEY&units=metric
```

---

## Project Structure

```
weather-app/
├── index.html
├── styles.css
└── script.js
```

---

## Starter Code - HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Weather Finder</h1>
        
        <div class="search-container">
            <input 
                type="text" 
                id="cityInput" 
                placeholder="Enter city name..."
                autocomplete="off"
            >
            <button id="searchBtn">Search</button>
            <button id="locationBtn" title="Use current location">📍</button>
        </div>

        <div id="error" class="error"></div>

        <div id="loader" class="loader hidden">
            <div class="spinner"></div>
            Loading weather data...
        </div>

        <div id="weatherInfo" class="weather-info hidden">
            <div class="city-info">
                <h2 id="cityName"></h2>
                <p id="date"></p>
            </div>

            <div class="current-weather">
                <div class="temperature">
                    <span id="temp"></span>
                    <span class="unit">°C</span>
                </div>
                <div class="condition">
                    <img id="weatherIcon" src="" alt="weather icon">
                    <p id="description"></p>
                </div>
            </div>

            <div class="details">
                <div class="detail">
                    <span class="label">Feels Like</span>
                    <span id="feelsLike"></span>
                </div>
                <div class="detail">
                    <span class="label">Humidity</span>
                    <span id="humidity"></span>
                </div>
                <div class="detail">
                    <span class="label">Wind Speed</span>
                    <span id="windSpeed"></span>
                </div>
                <div class="detail">
                    <span class="label">Pressure</span>
                    <span id="pressure"></span>
                </div>
            </div>
        </div>

        <div class="recent-searches">
            <h3>Recent Searches</h3>
            <div id="recentList" class="recent-list"></div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Starter Code - CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#cityInput {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

#cityInput:focus {
    outline: none;
    border-color: #667eea;
}

#searchBtn, #locationBtn {
    padding: 12px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

#locationBtn {
    width: 50px;
    padding: 12px;
}

#searchBtn:hover, #locationBtn:hover {
    background: #5568d3;
}

.error {
    color: #f56565;
    padding: 12px;
    background: #ffe0e0;
    border-radius: 5px;
    margin-bottom: 20px;
    display: none;
}

.error.show {
    display: block;
}

.loader {
    text-align: center;
    padding: 40px;
}

.loader.hidden {
    display: none;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.weather-info {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
}

.weather-info.hidden {
    display: none;
}

.city-info {
    margin-bottom: 20px;
}

.city-info h2 {
    font-size: 28px;
    margin-bottom: 5px;
}

.city-info p {
    opacity: 0.8;
    font-size: 14px;
}

.current-weather {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}

.temperature {
    font-size: 72px;
    font-weight: bold;
}

.unit {
    font-size: 36px;
}

.condition {
    text-align: center;
}

#weatherIcon {
    width: 80px;
    height: 80px;
}

#description {
    text-transform: capitalize;
    font-size: 18px;
    margin-top: 10px;
}

.details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.detail {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 5px;
}

.label {
    display: block;
    opacity: 0.8;
    font-size: 12px;
    margin-bottom: 5px;
}

.recent-searches {
    margin-top: 30px;
}

.recent-searches h3 {
    color: #333;
    margin-bottom: 15px;
}

.recent-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.recent-item {
    background: #f0f0f0;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.recent-item:hover {
    background: #667eea;
    color: white;
}
```

---

## Starter Code - JavaScript

```javascript
class WeatherApp {
    constructor(apiKey) {
        this.apiKey = apiKey; // Get from OpenWeatherMap
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadRecentSearches();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.loader = document.getElementById('loader');
        this.error = document.getElementById('error');
        this.recentList = document.getElementById('recentList');
    }

    attachEventListeners() {
        // TODO: Search button click
        // TODO: Input enter key
        // TODO: Location button click
        // TODO: Recent searches click
    }

    // City से weather fetch करो
    async fetchWeather(city) {
        // TODO: Implement
        // - Show loader
        // - Fetch from API
        // - Handle errors
        // - Display results
    }

    // Geolocation से weather fetch करो
    async fetchWeatherByLocation() {
        // TODO: Implement
        // - Get user location
        // - Fetch weather
        // - Handle errors
    }

    // Display करो
    displayWeather(data) {
        // TODO: Implement
        // - Extract data
        // - Update DOM
        // - Add to recent searches
    }

    // Recent searches save करो
    saveSearch(city) {
        // TODO: Implement
        // - Add to localStorage
        // - Update display
    }

    // Error दिखाओ
    showError(message) {
        this.error.textContent = message;
        this.error.classList.add('show');
        this.weatherInfo.classList.add('hidden');
    }

    hideError() {
        this.error.classList.remove('show');
    }
}

// API key from https://openweathermap.org/api
const app = new WeatherApp('YOUR_API_KEY_HERE');
```

---

## Hints

1. **Get API Key** - OpenWeatherMap से free account बनाओ
2. **Error Handling** - Network errors, invalid city, rate limit
3. **Units** - API से metric units request करो
4. **Icons** - Weather icons OpenWeatherMap provide करता है
5. **localStorage** - Recent searches save करो

---

## Testing Checklist

- [ ] Search by city name works
- [ ] Weather data displays correctly
- [ ] Current location works
- [ ] Invalid city shows error
- [ ] Network error shows error
- [ ] Loader shows while fetching
- [ ] Recent searches save
- [ ] Recent searches are clickable
- [ ] Date and time display correctly
- [ ] All weather details show

---

---

# Project 4: Chat Application (Basic WebSocket Concept)

## Learning Goals
- ✅ DOM manipulation
- ✅ Array methods
- ✅ LocalStorage for storage
- ✅ Message handling
- ✅ Chat UI patterns

## Duration
**2-3 hours**

## Difficulty
⭐ Beginner+ (Local storage based, no real backend)

## Note
Real-time WebSocket version के लिए backend required है. यह version localStorage से simulate करेगा.

## Requirements

### Features
1. **User Setup** - Username से start करना
2. **Send Message** - Message type करके send करना
3. **Display Messages** - Chat history दिखाना
4. **Timestamp** - हर message के साथ time
5. **Clear Chat** - Chat history clear करना
6. **Multiple Users** - Different users से chat simulate करना
7. **Emoji Support** - Emoji भेजने की capability

---

## Project Structure

```
chat-app/
├── index.html
├── styles.css
└── script.js
```

---

## Starter Code - HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>Chat Room</h1>
            <span id="userInfo"></span>
        </div>

        <div id="setupScreen" class="screen">
            <div class="setup-form">
                <h2>Welcome to Chat</h2>
                <input 
                    type="text" 
                    id="usernameInput" 
                    placeholder="Enter your name..."
                    autocomplete="off"
                >
                <button id="joinBtn">Join Chat</button>
            </div>
        </div>

        <div id="chatScreen" class="screen hidden">
            <div id="messagesContainer" class="messages-container">
                <!-- Messages यहाँ आएंगे -->
            </div>

            <div class="input-area">
                <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="Type a message..."
                    autocomplete="off"
                >
                <button id="sendBtn">Send</button>
            </div>

            <div class="actions">
                <button id="simulateBtn" title="Simulate message from other user">
                    Simulate Other User
                </button>
                <button id="clearBtn">Clear Chat</button>
                <button id="leaveBtn">Leave</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Starter Code - CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    height: 90vh;
    max-height: 600px;
}

.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h1 {
    font-size: 24px;
}

#userInfo {
    font-size: 14px;
    opacity: 0.9;
}

.screen {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
}

.screen.hidden {
    display: none;
}

.setup-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.setup-form h2 {
    color: #333;
    margin-bottom: 30px;
    font-size: 28px;
}

.setup-form input {
    width: 300px;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 15px;
}

.setup-form input:focus {
    outline: none;
    border-color: #667eea;
}

.setup-form button {
    width: 300px;
    padding: 15px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.setup-form button:hover {
    background: #5568d3;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    padding-right: 10px;
}

.message {
    display: flex;
    margin-bottom: 15px;
    gap: 10px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message.own {
    justify-content: flex-end;
}

.message-content {
    max-width: 60%;
}

.message.own .message-content {
    align-items: flex-end;
}

.message-bubble {
    padding: 10px 15px;
    border-radius: 10px;
    word-wrap: break-word;
}

.message.own .message-bubble {
    background: #667eea;
    color: white;
    border-radius: 10px 0 10px 10px;
}

.message:not(.own) .message-bubble {
    background: #f0f0f0;
    color: #333;
    border-radius: 0 10px 10px 10px;
}

.message-info {
    font-size: 12px;
    color: #999;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
}

.message.own .message-info {
    justify-content: flex-end;
}

.input-area {
    display: flex;
    gap: 10px;
    border-top: 1px solid #eee;
    padding-top: 20px;
}

#messageInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

#messageInput:focus {
    outline: none;
    border-color: #667eea;
}

#sendBtn {
    padding: 12px 25px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

#sendBtn:hover {
    background: #5568d3;
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: flex-end;
    border-top: 1px solid #eee;
    padding-top: 15px;
}

.actions button {
    padding: 8px 15px;
    border: 2px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
    transition: all 0.3s;
}

.actions button:hover {
    background: #f0f0f0;
    border-color: #667eea;
}

#leaveBtn {
    background: #f56565;
    color: white;
    border-color: #f56565;
}

#leaveBtn:hover {
    background: #e53e3e;
    border-color: #e53e3e;
}
```

---

## Starter Code - JavaScript

```javascript
class ChatApp {
    constructor(storageKey = 'chatMessages') {
        this.storageKey = storageKey;
        this.currentUser = null;
        this.messages = this.loadMessages();
        this.otherUsers = ['Alice', 'Bob', 'Charlie'];
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.setupScreen = document.getElementById('setupScreen');
        this.chatScreen = document.getElementById('chatScreen');
        this.usernameInput = document.getElementById('usernameInput');
        this.joinBtn = document.getElementById('joinBtn');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.userInfo = document.getElementById('userInfo');
        this.clearBtn = document.getElementById('clearBtn');
        this.leaveBtn = document.getElementById('leaveBtn');
        this.simulateBtn = document.getElementById('simulateBtn');
    }

    attachEventListeners() {
        // TODO: Join button
        // TODO: Send button
        // TODO: Message input enter key
        // TODO: Clear button
        // TODO: Leave button
        // TODO: Simulate button
    }

    // User को join करो
    joinChat(username) {
        // TODO: Implement
        // - Set current user
        // - Show chat screen
        // - Load existing messages
        // - Render messages
    }

    // Message send करो
    sendMessage(text) {
        // TODO: Implement
        // - Create message object
        // - Add to messages array
        // - Save to storage
        // - Render new message
        // - Clear input
    }

    // Simulate other user message
    simulateMessage() {
        // TODO: Implement
        // - Pick random user
        // - Generate random message
        // - Add message
        // - Render
    }

    // Render करो
    renderMessages() {
        // TODO: Implement
        // - Clear container
        // - Display all messages
        // - Scroll to bottom
    }

    // Storage से load करो
    loadMessages() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Storage में save करो
    saveMessages() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
    }

    // Leave chat
    leaveChat() {
        // TODO: Implement
        // - Reset current user
        // - Show setup screen
        // - Clear inputs
    }
}

const chat = new ChatApp();
```

---

## Hints

1. **Message Structure** - `{ id, user, text, timestamp, isOwn }`
2. **LocalStorage** - Chat history persist करो
3. **Simulate** - Random user से random message भेजो
4. **Auto-scroll** - नया message आए तो नीचे scroll करो
5. **Timestamps** - हर message के साथ time दिखाओ

---

## Testing Checklist

- [ ] Join chat with username
- [ ] Send messages works
- [ ] Messages display in order
- [ ] Timestamps show correctly
- [ ] Own messages align right, others left
- [ ] Simulate other user works
- [ ] Clear chat removes all messages
- [ ] Leave chat works
- [ ] Data persists on refresh
- [ ] Scroll works smoothly

---

---

# Project 5: File Manager (Local UI)

## Learning Goals
- ✅ Complex DOM manipulation
- ✅ Array methods
- ✅ File operations simulation
- ✅ Nested data structures
- ✅ Search and filter

## Duration
**3-4 hours**

## Difficulty
⭐⭐ Intermediate

## Note
Real file system operations need backend. यह local UI है files को simulate करने के लिए.

## Requirements

### Features
1. **Folder Navigation** - Open/close folders
2. **File Display** - Files और folders दिखाना
3. **Create File** - नई file बनाना
4. **Create Folder** - नया folder बनाना
5. **Delete** - File या folder delete करना
6. **Rename** - Rename करना
7. **Search** - Files को search करना
8. **Breadcrumb** - Current path दिखाना

---

## Project Structure

```
file-manager/
├── index.html
├── styles.css
└── script.js
```

---

## Starter Code - HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Manager</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>File Manager</h1>
            <div class="controls">
                <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="Search files..."
                >
                <button id="newFolderBtn">+ Folder</button>
                <button id="newFileBtn">+ File</button>
            </div>
        </div>

        <div class="breadcrumb" id="breadcrumb">
            <span class="breadcrumb-item" data-path="">Root</span>
        </div>

        <div class="file-explorer">
            <div class="file-list" id="fileList">
                <!-- Files/folders यहाँ आएंगे -->
            </div>
        </div>

        <div id="contextMenu" class="context-menu hidden">
            <button class="context-item" data-action="rename">Rename</button>
            <button class="context-item" data-action="delete">Delete</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## Starter Code - CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 90vh;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-bottom: 1px solid #ddd;
}

.header h1 {
    margin-bottom: 15px;
}

.controls {
    display: flex;
    gap: 10px;
}

#searchInput {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 3px;
}

.controls button {
    padding: 8px 15px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid white;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s;
}

.controls button:hover {
    background: rgba(255, 255, 255, 0.3);
}

.breadcrumb {
    padding: 15px 20px;
    background: #f9f9f9;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.breadcrumb-item {
    padding: 5px 10px;
    cursor: pointer;
    background: #f0f0f0;
    border-radius: 3px;
    transition: all 0.2s;
}

.breadcrumb-item:hover {
    background: #e0e0e0;
}

.breadcrumb-item::after {
    content: " / ";
    margin: 0 5px;
    color: #ccc;
}

.breadcrumb-item:last-child::after {
    content: "";
}

.file-explorer {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.file-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
}

.file-item {
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.file-item:hover {
    background: #f9f9f9;
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.file-item.folder {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.file-item-icon {
    font-size: 40px;
    text-align: center;
    margin-bottom: 10px;
}

.file-item-name {
    text-align: center;
    font-size: 14px;
    word-break: break-word;
    color: #333;
    font-weight: 500;
}

.file-item-size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}

.file-item-actions {
    position: absolute;
    top: 5px;
    right: 5px;
    display: none;
    gap: 5px;
}

.file-item:hover .file-item-actions {
    display: flex;
}

.file-item-actions button {
    background: #f56565;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-item-actions button:hover {
    background: #e53e3e;
}

.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.context-menu.hidden {
    display: none;
}

.context-item {
    display: block;
    width: 100%;
    padding: 10px 15px;
    background: white;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
}

.context-item:hover {
    background: #f0f0f0;
}

.empty-state {
    text-align: center;
    color: #999;
    padding: 40px 20px;
}
```

---

## Starter Code - JavaScript

```javascript
class FileManager {
    constructor(storageKey = 'fileSystem') {
        this.storageKey = storageKey;
        this.currentPath = [];
        this.files = this.loadFiles();
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    // Initialize करो
    initializeElements() {
        this.fileList = document.getElementById('fileList');
        this.searchInput = document.getElementById('searchInput');
        this.newFolderBtn = document.getElementById('newFolderBtn');
        this.newFileBtn = document.getElementById('newFileBtn');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.contextMenu = document.getElementById('contextMenu');
    }

    attachEventListeners() {
        // TODO: Search
        // TODO: New folder
        // TODO: New file
        // TODO: File/folder click
        // TODO: Right click for context menu
        // TODO: Breadcrumb navigation
    }

    // Current directory get करो
    getCurrentDirectory() {
        // TODO: Implement
        // - Navigate through currentPath
        // - Return current folder contents
    }

    // File create करो
    createFile(name) {
        // TODO: Implement
        // - Create file object
        // - Add to current directory
        // - Save and render
    }

    // Folder create करो
    createFolder(name) {
        // TODO: Implement
        // - Create folder object
        // - Add to current directory
        // - Save and render
    }

    // Delete करो
    delete(name) {
        // TODO: Implement
        // - Remove from current directory
        // - Save and render
    }

    // Rename करो
    rename(oldName, newName) {
        // TODO: Implement
        // - Find and rename
        // - Save and render
    }

    // Search करो
    search(query) {
        // TODO: Implement
        // - Recursively search files
        // - Return matching items
    }

    // Navigate करो
    navigate(path) {
        // TODO: Implement
        // - Update currentPath
        // - Render breadcrumb
        // - Render files
    }

    // Render करो
    render() {
        // TODO: Implement
        // - Get current directory
        // - Display files
        // - Display folders
        // - Update breadcrumb
    }

    // Storage से load करो
    loadFiles() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : { name: 'root', type: 'folder', children: [] };
    }

    // Storage में save करो
    saveFiles() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.files));
    }
}

const fileManager = new FileManager();
```

---

## Hints

1. **Nested Structure** - Folders में children array
2. **Path Navigation** - Current path array से track करो
3. **Search Recursively** - Sabhi folders mein search करो
4. **File Size** - Static size assign कर सकते हो
5. **Icons** - Different icons for files vs folders

---

## Testing Checklist

- [ ] Create folder works
- [ ] Create file works
- [ ] Folder navigation works
- [ ] Breadcrumb shows correct path
- [ ] Delete file/folder works
- [ ] Rename works
- [ ] Search finds files
- [ ] Nested folders work (3+ levels)
- [ ] Data persists on refresh
- [ ] Context menu works

---

---

## Summary

### Module 1 Completion

बहुत सारे projects complete करके आप बहुत कुछ सीख गए!

✅ **Variables, Scope, Hoisting** - JavaScript fundamentals
✅ **Functions & Arrow Functions** - Code organization
✅ **Callbacks, Promises, Async/Await** - Asynchronous programming
✅ **5 Real Projects** - Practical application

### Skills Gained

- DOM Manipulation
- Event Handling
- Array Methods
- Object Manipulation
- LocalStorage
- API Calls (Weather App)
- Error Handling
- Code Organization

### Next Steps

अब आप **Module 2: Advanced Concepts** के लिए ready हो! 🎉

**Agle Module मे सिखेंगे:**
- Closures & Scope Chain
- Prototypes & Inheritance
- Event Loop & Timing
- Error Handling Patterns
- Regular Expressions
- और 5 और advanced projects!

Padhai continue रखो! 🚀

