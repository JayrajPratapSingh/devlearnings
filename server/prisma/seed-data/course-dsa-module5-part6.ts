/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 6.
 *
 * Evaluating expressions with a stack. Lesson 1 introduced stacks and
 * name-dropped "valid parentheses" and "evaluate reverse Polish notation" as
 * classic exercises; this lesson actually does them, plus the harder cases
 * that trip people up: an infix calculator with +, -, *, / and operator
 * precedence, then with parentheses, and "decode string" (nested repetition)
 * which uses two stacks.
 *
 * Broken example: evaluating an infix expression left to right with a single
 * running total, ignoring precedence — so "2 + 3 * 4" comes out as 20
 * instead of 14. Also the classic RPN bug: popping the operands in the wrong
 * order, which is invisible for + and * but wrong for - and /.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_5_PART6: CourseLesson[] = [
  {
    slug: 'evaluating-expressions-with-a-stack',
    title: 'Evaluating Expressions With a Stack',
    titleHi: 'Ek Stack Se Expressions Evaluate Karna',
    description: 'Evaluating an arithmetic string like "2 + 3 * 4" by scanning left to right and folding each operator into a single running total as you meet it. It gives the right answer for "2 + 3 + 4" and any all-same-operator string, then silently returns 20 for "2 + 3 * 4" because it multiplied the accumulated 5 by 4 instead of multiplying 3 by 4 first.',
    descriptionHi: 'Ek arithmetic string jaise "2 + 3 * 4" ko left se right scan karke aur har operator ko milte hi ek akele running total mein fold karke evaluate karna. Ye "2 + 3 + 4" aur kisi bhi all-same-operator string ke liye sahi jawaab deta hai, phir chupchaap "2 + 3 * 4" ke liye 20 lautaata hai kyunki isne pehle 3 ko 4 se guna karne ke bajaye jama 5 ko 4 se guna kiya.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Totting up a restaurant bill where some lines are "3 plates at 40 each" and you are handed the lines one at a time.** The naive method is to keep one running total and add each number as it arrives, but that goes wrong the moment a line means "multiply these two together first" — you cannot fold "3" into the total and then multiply the whole total by "40". What actually works is a small holding area for pending items. When a line is a plain addition, you drop the finished amount into the holding area. When a line is "times", you do not touch the holding area at all — you just keep that one pending number in hand, multiply it by the next number, and only when the multiplying is done do you drop the result into the holding area. At the end you sum everything in the holding area. Parentheses are the same trick nested: when the bill has a bracketed sub-total, you set the current holding area aside, work out the bracket into its own fresh holding area, collapse that to a single number, then bring back the set-aside holding area and treat the bracket\'s value as one more pending item. A stack is exactly this "set the current work aside, come back to it later" mechanism.',
      hi: '**Ek restaurant bill jodna jahaan kuch lines "40 ke hisaab se 3 plates" hain aur aapko lines ek-ek karke di jaati hain.** Naive method ek running total rakhna aur har number ko aate hi jodna hai, par wo us pal galat jaata hai jab ek line ka matlab "pehle in dono ko saath guna karo" hai — aap "3" ko total mein fold karke phir poore total ko "40" se guna nahi kar sakte. Jo asal mein kaam karta hai wo pending items ke liye ek chhota holding area hai. Jab ek line ek saada addition hai, aap khatam raashi holding area mein daal dete ho. Jab ek line "times" hai, aap holding area ko bilkul nahi chhoote — aap bas us ek pending number ko haath mein rakhte ho, use agle number se guna karte ho, aur sirf jab guna khatam ho tab nateeja holding area mein daalte ho. Ant mein aap holding area mein sab kuch sum karte ho. Parentheses wahi trick nested hai: jab bill mein ek bracketed sub-total hai, aap current holding area ko alag rakh dete ho, bracket ko iske apne naye holding area mein nikaalte ho, use ek akele number mein collapse karte ho, phir alag rakha holding area wapas laate ho aur bracket ki value ko ek aur pending item ki tarah maante ho. Ek stack bilkul yahi "current kaam alag rakho, baad mein ispar wapas aao" tantra hai.',
    },

    simple: `**Start broken.** One running total, left to right, ignoring precedence:

\`\`\`js
function evalNaive(expr) {
  const tokens = expr.match(/\\d+|[+\\-*/]/g);
  let total = Number(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], n = Number(tokens[i + 1]);
    if (op === '+') total += n;
    else if (op === '-') total -= n;
    else if (op === '*') total *= n;      // multiplies the WHOLE total, not the last number
    else total /= n;
  }
  return total;
}

console.log(evalNaive('2 + 3 + 4'));   // 9   OK
console.log(evalNaive('2 + 3 * 4'));   // 20  WRONG — should be 14
// it computed (2 + 3) * 4 instead of 2 + (3 * 4)
\`\`\`

The bug is precedence: \`*\` and \`/\` must bind tighter than \`+\` and \`-\`. A single accumulator has no way to "hold off" the \`+ 2\` until the \`3 * 4\` is resolved.

**The fix: a stack of pending terms; apply \`*\` and \`/\` immediately, defer \`+\` and \`-\`**

\`\`\`js
function calculate(expr) {
  const stack = [];
  let num = 0, op = '+';                          // the operator BEFORE the current number
  const s = expr.replace(/\\s+/g, '') + '+';       // trailing '+' flushes the last number

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else {
      if (op === '+')      stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);   // resolve now
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      op = ch;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);        // sum the deferred + / - terms
}

console.log(calculate('2 + 3 * 4'));        // 14
console.log(calculate('2*3 - 8/2'));        // 2
console.log(calculate('14 - 3/2'));         // 13   (integer division truncates toward 0)
\`\`\`

\`\`\`ts
function calculate(expr: string): number {
  const stack: number[] = [];
  let num = 0, op = '+';
  const s = expr.replace(/\\s+/g, '') + '+';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') num = num * 10 + (ch.charCodeAt(0) - 48);
    else {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop()! * num);
      else stack.push(Math.trunc(stack.pop()! / num));
      op = ch; num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}
\`\`\`

The rule: when you finish reading a number, look at the operator that came *before* it. If it was \`+\` or \`-\`, the number is a standalone term — push it (negated for \`-\`). If it was \`*\` or \`/\`, it combines with the term already on top of the stack — pop, combine, push back. At the end everything on the stack is a \`+\`/\`-\` term, so summing gives the answer with correct precedence.`,

    simpleHi: `**Toote hue se shuru.** Ek running total, left se right, precedence anadekha karke:

\`\`\`js
function evalNaive(expr) {
  const tokens = expr.match(/\\d+|[+\\-*/]/g);
  let total = Number(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], n = Number(tokens[i + 1]);
    if (op === '+') total += n;
    else if (op === '-') total -= n;
    else if (op === '*') total *= n;      // POORE total ko guna karta hai, aakhri number ko nahi
    else total /= n;
  }
  return total;
}

console.log(evalNaive('2 + 3 + 4'));   // 9   OK
console.log(evalNaive('2 + 3 * 4'));   // 20  GALAT — 14 hona chahiye
// isne 2 + (3 * 4) ke bajaye (2 + 3) * 4 compute kiya
\`\`\`

Bug precedence hai: \`*\` aur \`/\` ko \`+\` aur \`-\` se zyaada sakhti se bind karna chahiye. Ek akele accumulator ke paas \`+ 2\` ko "rok kar rakhne" ka koi tarika nahi jab tak \`3 * 4\` resolve na ho.

**Fix: pending terms ka ek stack; \`*\` aur \`/\` turant lagao, \`+\` aur \`-\` defer karo**

\`\`\`js
function calculate(expr) {
  const stack = [];
  let num = 0, op = '+';                          // current number se PEHLE ka operator
  const s = expr.replace(/\\s+/g, '') + '+';       // trailing '+' aakhri number flush karta hai

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else {
      if (op === '+')      stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);   // abhi resolve karo
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      op = ch;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);        // deferred + / - terms sum karo
}

console.log(calculate('2 + 3 * 4'));        // 14
console.log(calculate('2*3 - 8/2'));        // 2
console.log(calculate('14 - 3/2'));         // 13   (integer division 0 ki taraf truncate)
\`\`\`

\`\`\`ts
function calculate(expr: string): number {
  const stack: number[] = [];
  let num = 0, op = '+';
  const s = expr.replace(/\\s+/g, '') + '+';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') num = num * 10 + (ch.charCodeAt(0) - 48);
    else {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop()! * num);
      else stack.push(Math.trunc(stack.pop()! / num));
      op = ch; num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}
\`\`\`

Niyam: jab aap ek number padhna khatam karo, us operator ko dekho jo iske *pehle* aaya. Agar wo \`+\` ya \`-\` tha, number ek standalone term hai — ise push karo (\`-\` ke liye negate karke). Agar wo \`*\` ya \`/\` tha, ye stack ke top par pehle se maujood term ke saath judta hai — pop karo, combine karo, wapas push karo. Ant mein stack par sab kuch ek \`+\`/\`-\` term hai, isliye sum karna sahi precedence ke saath jawaab deta hai.`,

    content: `## Reverse Polish Notation (postfix) — the simplest case, no precedence needed

\`\`\`js
function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop();          // SECOND operand popped first
      const a = stack.pop();          // FIRST operand
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack.pop();
}
// evalRPN(["2","1","+","3","*"])       -> ((2 + 1) * 3) = 9
// evalRPN(["4","13","5","/","+"])      -> (4 + (13 / 5)) = 6
\`\`\`

\`\`\`
THE ORDER BUG: for "a - b" the tokens arrive as a, b, -.  You pop b first,
then a.  So it is  a - b,  NOT  b - a.
  + and * hide this bug (they commute).  - and / expose it.
Postfix needs no precedence rules and no parentheses — the ordering already
encodes everything. That is why compilers convert to it.
\`\`\`

## The infix calculator with parentheses — recurse or push the state

\`\`\`js
function calculateParens(expr) {
  const s = expr.replace(/\\s+/g, '') + '+';   // trailing '+' flushes the final term
  let i = 0;

  function parse() {                          // evaluate until ')' or end
    const stack = [];
    let num = 0, op = '+';
    while (i < s.length) {
      const ch = s[i++];
      if (ch >= '0' && ch <= '9') { num = num * 10 + (ch.charCodeAt(0) - 48); continue; }
      if (ch === '(') { num = parse(); continue; }   // sub-expression -> one number, resume
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      num = 0;
      if (ch === ')') break;
      op = ch;
    }
    return stack.reduce((a, b) => a + b, 0);
  }
  return parse();
}
// calculateParens("2*(5+5*2)/3+(6/2+8)")  -> 21
// calculateParens("(2+6*3+5-(3*14/7+2)*5)+3")  -> -12
\`\`\`

An opening \`(\` starts a fresh sub-evaluation whose result is treated as a single number; a \`)\` ends the current one. The recursion stack IS the stack of set-aside evaluations. An iterative version pushes \`(stack, op)\` onto an explicit stack at each \`(\` and pops it at each \`)\` — same idea, no recursion.

## Decode String — nesting means TWO stacks

\`\`\`js
function decodeString(s) {
  const countStack = [], strStack = [];
  let cur = '', k = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      k = k * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      countStack.push(k);                 // remember the repeat count
      strStack.push(cur);                 // remember the string built so far
      k = 0; cur = '';
    } else if (ch === ']') {
      const repeat = countStack.pop();
      cur = strStack.pop() + cur.repeat(repeat);
    } else {
      cur += ch;
    }
  }
  return cur;
}
// decodeString("3[a2[c]]")   -> "accaccacc"
// decodeString("2[abc]3[cd]ef") -> "abcabccdcdcdef"
\`\`\`

One stack for the pending repeat counts, one for the pending prefixes. Every \`[\` saves both and starts fresh; every \`]\` pops both, repeats the just-built segment, and glues it after the saved prefix.

## The recognition checklist

\`\`\`
"evaluate reverse Polish / postfix notation"       one number stack, pop b then a
"basic calculator: + - only, maybe with ( )"       sign-tracking + a stack for '('
"basic calculator: + - * / with precedence"        push +/- terms, resolve */  on the spot
"...with parentheses too"                           recurse (or push state) on '(', return on ')'
"decode string / nested repetition"                 two stacks: counts and prefixes
"remove k digits / duplicate letters, keep order"   monotonic stack (Module 5 lesson 3)
"valid parentheses / min add to make valid"         stack of unmatched opens

Interview tell: the input is a string that describes a computation with
nesting or precedence, and the answer depends on structure the linear scan
does not directly see. Push the deferred work; pop it when the structure closes.
\`\`\``,

    contentHi: `## Reverse Polish Notation (postfix) — sabse saral case, koi precedence nahi chahiye

\`\`\`js
function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop();          // DOOSRA operand pehle pop hota hai
      const a = stack.pop();          // PEHLA operand
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack.pop();
}
// evalRPN(["2","1","+","3","*"])       -> ((2 + 1) * 3) = 9
// evalRPN(["4","13","5","/","+"])      -> (4 + (13 / 5)) = 6
\`\`\`

\`\`\`
ORDER BUG: "a - b" ke liye tokens a, b, - ki tarah aate hain.  Aap pehle b pop karte ho,
phir a.  Toh ye  a - b,  hai  b - a NAHI.
  + aur * ise chhupaate hain (wo commute karte hain).  - aur / ise ujaagar karte hain.
Postfix ko koi precedence rules aur koi parentheses nahi chahiye — ordering pehle se
sab kuch encode karti hai. Yahi wajah hai ki compilers ismein convert karte hain.
\`\`\`

## Parentheses waala infix calculator — recurse ya state push karo

\`\`\`js
function calculateParens(expr) {
  const s = expr.replace(/\\s+/g, '') + '+';   // trailing '+' antim term flush karta hai
  let i = 0;

  function parse() {                          // ')' ya end tak evaluate karo
    const stack = [];
    let num = 0, op = '+';
    while (i < s.length) {
      const ch = s[i++];
      if (ch >= '0' && ch <= '9') { num = num * 10 + (ch.charCodeAt(0) - 48); continue; }
      if (ch === '(') { num = parse(); continue; }   // sub-expression -> ek number, phir aage
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      num = 0;
      if (ch === ')') break;
      op = ch;
    }
    return stack.reduce((a, b) => a + b, 0);
  }
  return parse();
}
// calculateParens("2*(5+5*2)/3+(6/2+8)")  -> 21
// calculateParens("(2+6*3+5-(3*14/7+2)*5)+3")  -> -12
\`\`\`

Ek opening \`(\` ek naya sub-evaluation shuru karta hai jiska result ek akele number ki tarah maana jaata hai; ek \`)\` current ko khatam karta hai. Recursion stack HI alag-rakhe evaluations ka stack hai. Ek iterative version har \`(\` par ek explicit stack par \`(stack, op)\` push karta hai aur har \`)\` par ise pop karta hai — wahi idea, koi recursion nahi.

## Decode String — nesting matlab DO stacks

\`\`\`js
function decodeString(s) {
  const countStack = [], strStack = [];
  let cur = '', k = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      k = k * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      countStack.push(k);                 // repeat count yaad rakho
      strStack.push(cur);                 // ab tak bani string yaad rakho
      k = 0; cur = '';
    } else if (ch === ']') {
      const repeat = countStack.pop();
      cur = strStack.pop() + cur.repeat(repeat);
    } else {
      cur += ch;
    }
  }
  return cur;
}
// decodeString("3[a2[c]]")   -> "accaccacc"
// decodeString("2[abc]3[cd]ef") -> "abcabccdcdcdef"
\`\`\`

Pending repeat counts ke liye ek stack, pending prefixes ke liye ek. Har \`[\` dono save karta hai aur naya shuru karta hai; har \`]\` dono pop karta hai, abhi-bane segment ko repeat karta hai, aur ise save kiye prefix ke baad jodta hai.

## Pehchaanne ki checklist

\`\`\`
"reverse Polish / postfix notation evaluate karo"    ek number stack, b phir a pop karo
"basic calculator: sirf + -, shaayad ( ) ke saath"   sign-tracking + '(' ke liye ek stack
"basic calculator: precedence ke saath + - * /"       +/- terms push karo, */ mauke par resolve
"...parentheses ke saath bhi"                          '(' par recurse (ya state push), ')' par return
"decode string / nested repetition"                   do stacks: counts aur prefixes
"k digits / duplicate letters hataao, kram rakho"      monotonic stack (Module 5 lesson 3)
"valid parentheses / valid banane ko min add"          unmatched opens ka stack

Interview sanket: input ek string hai jo nesting ya precedence waali ek computation
varnit karta hai, aur jawaab us structure par nirbhar karta hai jise linear scan
seedhe nahi dekhta. Deferred kaam push karo; jab structure band ho use pop karo.
\`\`\``,

    examples: [
      {
        title: 'Broken: single accumulator ignores precedence',
        titleHi: 'Toota: ek akela accumulator precedence anadekha karta hai',
        code: `if (op === '*') total *= n;   // multiplies the running total, not the last operand`,
        codeJs: `function evalNaive(expr) {
  const tokens = expr.match(/\\d+|[+\\-*/]/g);
  let total = Number(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], n = Number(tokens[i + 1]);
    if (op === '+') total += n;
    else if (op === '-') total -= n;
    else if (op === '*') total *= n;
    else total /= n;
  }
  return total;
}
console.log(evalNaive('2 + 3 + 4'));   // 9
console.log(evalNaive('2 + 3 * 4'));   // 20  (want 14)
console.log(evalNaive('10 - 2 * 3'));  // 24  (want 4)`,
        codeTs: `function evalNaive(expr: string): number {
  const tokens = expr.match(/\\d+|[+\\-*/]/g)!;
  let total = Number(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], n = Number(tokens[i + 1]);
    if (op === '+') total += n;
    else if (op === '-') total -= n;
    else if (op === '*') total *= n;
    else total /= n;
  }
  return total;
}`,
        outputJs: `9
20
24`,
        outputTs: `// All-same-operator strings are fine; the moment precedence matters, wrong.`,
        explain: '"2 + 3 * 4" should be 2 + (3 * 4) = 14, but folding left to right computes (2 + 3) * 4 = 20. "10 - 2 * 3" should be 4 but becomes (10 - 2) * 3 = 24. A single running total cannot defer the low-precedence operation until the high-precedence one resolves.',
        explainHi: '"2 + 3 * 4" 2 + (3 * 4) = 14 hona chahiye, par left se right fold karna (2 + 3) * 4 = 20 compute karta hai. "10 - 2 * 3" 4 hona chahiye par (10 - 2) * 3 = 24 ban jaata hai. Ek akela running total low-precedence operation ko high-precedence resolve hone tak defer nahi kar sakta.',
      },
      {
        title: 'Fixed: stack of terms, resolve * / immediately',
        titleHi: 'Theek: terms ka stack, * / turant resolve karo',
        code: `if (op === '*') stack.push(stack.pop() * num);   // combine with the top term now
else if (op === '+') stack.push(num);            // defer: it is its own term`,
        codeJs: `function calculate(expr) {
  const stack = [];
  let num = 0, op = '+';
  const s = expr.replace(/\\s+/g, '') + '+';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') { num = num * 10 + (ch.charCodeAt(0) - 48); continue; }
    if (op === '+') stack.push(num);
    else if (op === '-') stack.push(-num);
    else if (op === '*') stack.push(stack.pop() * num);
    else stack.push(Math.trunc(stack.pop() / num));
    op = ch; num = 0;
  }
  return stack.reduce((a, b) => a + b, 0);
}
console.log(calculate('2 + 3 * 4'));   // 14
console.log(calculate('10 - 2 * 3'));  // 4
console.log(calculate('100 / 3'));     // 33
console.log(calculate('3 + 5 / 2'));   // 5`,
        codeTs: `function calculate(expr: string): number {
  const stack: number[] = [];
  let num = 0, op = '+';
  const s = expr.replace(/\\s+/g, '') + '+';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') { num = num * 10 + (ch.charCodeAt(0) - 48); continue; }
    if (op === '+') stack.push(num);
    else if (op === '-') stack.push(-num);
    else if (op === '*') stack.push(stack.pop()! * num);
    else stack.push(Math.trunc(stack.pop()! / num));
    op = ch; num = 0;
  }
  return stack.reduce((a, b) => a + b, 0);
}`,
        outputJs: `14
4
33
5`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'When a number finishes, the operator before it decides: + / - push it as a standalone term (negated for -), while * / pop the top term and combine, pushing the product/quotient back. Everything left on the stack is an additive term, so the final sum has correct precedence. The trailing "+" flushes the last number.',
        explainHi: 'Jab ek number khatam hota hai, usse pehla operator tay karta hai: + / - ise ek standalone term ki tarah push karte hain (- ke liye negated), jabki * / top term pop karte hain aur combine karte hain, product/quotient wapas push karte hue. Stack par jo bacha wo ek additive term hai, isliye antim sum ka sahi precedence hai. Trailing "+" aakhri number flush karta hai.',
      },
      {
        title: 'RPN and decode string: the ordering and the two stacks',
        titleHi: 'RPN aur decode string: ordering aur do stacks',
        code: `const b = stack.pop(); const a = stack.pop();   // b is the SECOND operand -> a - b
// decodeString: countStack + strStack, one push per '[', one pop per ']'`,
        codeJs: `function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if ('+-*/'.includes(t) && t.length === 1) {
      const b = st.pop(), a = st.pop();
      st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st.pop();
}
console.log(evalRPN(['2', '1', '+', '3', '*']));       // 9
console.log(evalRPN(['4', '13', '5', '/', '+']));      // 6
console.log(evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'])); // 22

function decodeString(s) {
  const cs = [], ss = [];
  let cur = '', k = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch.charCodeAt(0) - 48);
    else if (ch === '[') { cs.push(k); ss.push(cur); k = 0; cur = ''; }
    else if (ch === ']') { cur = ss.pop() + cur.repeat(cs.pop()); }
    else cur += ch;
  }
  return cur;
}
console.log(decodeString('3[a2[c]]'));        // accaccacc
console.log(decodeString('2[abc]3[cd]ef'));   // abcabccdcdcdef`,
        codeTs: `function decodeString(s: string): string {
  const cs: number[] = [], ss: string[] = [];
  let cur = '', k = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch.charCodeAt(0) - 48);
    else if (ch === '[') { cs.push(k); ss.push(cur); k = 0; cur = ''; }
    else if (ch === ']') { cur = ss.pop()! + cur.repeat(cs.pop()!); }
    else cur += ch;
  }
  return cur;
}`,
        outputJs: `9
6
22
accaccacc
abcabccdcdcdef`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'In RPN the second-popped value is the left operand, so "a b -" evaluates as a - b; + and * would hide a swapped order but - and / would not. decodeString keeps a stack of repeat counts and a stack of prefixes; each "[" defers both, each "]" pops both and splices the repeated inner string after the saved prefix.',
        explainHi: 'RPN mein doosri-pop hui value left operand hai, isliye "a b -" a - b ki tarah evaluate hota hai; + aur * ek swapped order chhupaate par - aur / nahi. decodeString repeat counts ka ek stack aur prefixes ka ek stack rakhta hai; har "[" dono defer karta hai, har "]" dono pop karta hai aur repeated inner string ko save kiye prefix ke baad splice karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// RPN: popping operands in the order they were pushed
const a = stack.pop();
const b = stack.pop();
if (t === '-') stack.push(a - b);   // this is (second - first) = b_real - a_real, backwards`,
        right: `const b = stack.pop();   // the LAST pushed is the RIGHT operand
const a = stack.pop();
if (t === '-') stack.push(a - b);`,
        why: 'Tokens for "x - y" arrive as x, y, -, so x is pushed first and y second. The stack pops in reverse, so the first pop is y (the right operand) and the second is x (the left). Naming the first pop "b" and the second "a" makes a - b correct. + and * commute so a swapped order is invisible there; - and / are where the bug bites.',
        whyHi: '"x - y" ke tokens x, y, - ki tarah aate hain, isliye x pehle push hota hai aur y doosra. Stack ulta pop karta hai, isliye pehla pop y hai (right operand) aur doosra x (left). Pehle pop ko "b" aur doosre ko "a" naam dena a - b ko sahi banaata hai. + aur * commute karte hain isliye ek swapped order wahaan anadekha hai; - aur / wahaan hain jahaan bug kaatta hai.',
      },
      {
        wrong: `// forgetting to flush the last number
for (const ch of expr) { /* ... process operators ... */ }
return stack.reduce((a, b) => a + b, 0);   // the final number was read into 'num' but never pushed`,
        right: `const s = expr.replace(/\\s+/g, '') + '+';   // append a harmless '+' so the loop
// processes the pending 'num' one last time before finishing`,
        why: 'The stack push happens when an operator is seen, using the operator BEFORE the current number. The last number in the string has no operator after it to trigger its push. Appending a trailing "+" (or handling end-of-string explicitly) forces that final push.',
        whyHi: 'Stack push tab hota hai jab ek operator dikhta hai, current number se PEHLE ke operator ka istemal karke. String mein aakhri number ke baad iski push trigger karne ko koi operator nahi. Ek trailing "+" jodna (ya end-of-string explicitly handle karna) us antim push ko majboor karta hai.',
      },
      {
        wrong: `// integer division with Math.floor for negative results
stack.push(Math.floor(stack.pop() / num));   // -3 / 2 -> Math.floor(-1.5) = -2`,
        right: `stack.push(Math.trunc(stack.pop() / num));   // -3 / 2 -> Math.trunc(-1.5) = -1`,
        why: 'Most calculator problems specify that integer division truncates toward zero, so -3 / 2 is -1, not -2. Math.floor rounds toward negative infinity and gives -2. Math.trunc drops the fractional part regardless of sign, matching the "truncate toward zero" rule.',
        whyHi: 'Adhikaansh calculator problems batate hain ki integer division zero ki taraf truncate karta hai, isliye -3 / 2 -1 hai, -2 nahi. Math.floor negative infinity ki taraf round karta hai aur -2 deta hai. Math.trunc sign chahe kuch bhi ho fractional part gira deta hai, "truncate toward zero" niyam se match karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**Every language\'s expression parser** — spreadsheet formula engines, calculator apps, template languages, query builders — converts infix to a postfix or tree form and evaluates it with a stack, exactly these algorithms.',
        hi: '**Har language ka expression parser** — spreadsheet formula engines, calculator apps, template languages, query builders — infix ko ek postfix ya tree form mein convert karta hai aur ise ek stack se evaluate karta hai, bilkul ye algorithms.',
      },
      {
        en: '**Stack-based virtual machines** (the JVM, the CPython bytecode interpreter, WebAssembly) execute compiled code as a stream of push/pop/operate instructions over an operand stack — RPN evaluation is their inner loop.',
        hi: '**Stack-based virtual machines** (JVM, CPython bytecode interpreter, WebAssembly) compiled code ko ek operand stack par push/pop/operate instructions ki ek stream ki tarah execute karti hain — RPN evaluation unka inner loop hai.',
      },
      {
        en: '**Configuration and markup expansion** — nested includes, repeated blocks, string interpolation with nesting — is decode-string with two stacks: one for the pending context, one for the partial output.',
        hi: '**Configuration aur markup expansion** — nested includes, repeated blocks, nesting waala string interpolation — do stacks ke saath decode-string hai: ek pending context ke liye, ek partial output ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Design a calculator for "+ - * /" with precedence but no parentheses. Why a stack, and what goes on it?',
        qHi: 'Precedence ke saath par bina parentheses "+ - * /" ke liye ek calculator design karo. Stack kyun, aur ismein kya jaata hai?',
        a: 'The core difficulty is that you read the expression left to right, but multiplication and division must be applied before addition and subtraction, so when you meet a plus you cannot commit to it yet — there might be a times right after it that has to happen first. The stack holds the terms that will eventually be added together. I scan character by character, building up the current number digit by digit, and I keep one variable holding the operator that appeared just before the current number. When the current number is complete, meaning I have hit the next operator or the end, I look at that pending operator. If it is a plus, the number is its own additive term, so I push it. If it is a minus, I push its negative. If it is a times or a divide, the number is not a standalone term — it modifies the term I most recently pushed, so I pop that term, multiply or divide it by the current number, and push the result back. Then I update the pending operator to the one I just read and reset the number. After the whole scan, every value on the stack is a term that only participates in addition, so I sum the stack and that is the answer, with correct precedence, because the times and divides were already folded into their neighbours. One implementation detail: the push is triggered by seeing an operator, but the last number has no operator after it, so I either append a dummy plus to the end of the string or handle the end-of-string case explicitly, otherwise the final number is read but never pushed. Another: if the problem says integer division truncates toward zero, use a truncation that drops the fraction regardless of sign, not a floor, because floor rounds negative results the wrong way. To extend this to parentheses, an opening paren starts a fresh evaluation with its own stack and pending operator, and its result is treated as a single number in the enclosing evaluation; a closing paren ends the current one. That nesting is naturally a recursion, or you push the current stack and operator onto an explicit stack at each opening paren.',
        aHi: 'Mool kathinaai ye hai ki aap expression ko left se right padhte ho, par multiplication aur division ko addition aur subtraction se pehle lagana chahiye, isliye jab aap ek plus milte ho aap ispar abhi pratibaddh nahi ho sakte — iske bilkul baad ek times ho sakta hai jo pehle hona chahiye. Stack un terms ko rakhta hai jo aakhirkaar saath jode jaayenge. Main character dar character scan karta hoon, current number ko ank dar ank banaate hue, aur main ek variable rakhta hoon jo wo operator rakhta hai jo current number se bilkul pehle aaya. Jab current number poora hai, matlab main agle operator ya end par pahuncha hoon, main us pending operator ko dekhta hoon. Agar wo plus hai, number apna additive term hai, isliye main ise push karta hoon. Agar wo minus hai, main iska negative push karta hoon. Agar wo times ya divide hai, number ek standalone term nahi — ye us term ko modify karta hai jo maine haal hi mein push kiya, isliye main us term ko pop karta hoon, ise current number se guna ya bhaag karta hoon, aur nateeja wapas push karta hoon. Poore scan ke baad, stack par har value ek term hai jo sirf addition mein bhaag leta hai, isliye main stack sum karta hoon.',
      },
      {
        q: 'Why does postfix (RPN) evaluation need no precedence rules or parentheses, and what is the one bug people hit?',
        qHi: 'Postfix (RPN) evaluation ko koi precedence rules ya parentheses kyun nahi chahiye, aur wo ek bug kya hai jispar log pahunchte hain?',
        a: 'Postfix notation writes the operands first and then the operator, so instead of "two plus three" you write "two three plus". The key property is that the position of each operator already tells you exactly which two values it applies to: it applies to the two most recently produced results. There is no ambiguity to resolve, so there is no need for precedence rules to break ties and no need for parentheses to group things — the linear order of the tokens is the grouping. That is precisely why compilers and stack machines convert infix source code into a postfix or tree form: evaluation becomes a trivial single pass. The algorithm is: keep a stack of values, scan the tokens, and for each token, if it is a number push it, if it is an operator pop the top two values, apply the operator, and push the result. At the end the stack holds one value, the answer. The bug almost everyone hits is the order of the two pops. For a non-commutative operator like subtraction or division, the order matters. The tokens for "a minus b" are a, then b, then minus, so a is pushed first and b second. When you pop, the stack gives you the most recent first, so your first pop is b and your second pop is a. The correct expression is second-pop minus first-pop, that is a minus b. If you carelessly name the first pop "a" and the second "b" and then compute a minus b, you have actually computed b minus a, backwards. Addition and multiplication commute, so the same mistake is completely invisible on those operators — the tests pass until someone tries subtraction or division. The fix is a naming discipline: the first value you pop is the right operand, the second is the left operand.',
        aHi: 'Postfix notation operands pehle aur phir operator likhta hai, isliye "do plus teen" ke bajaye aap "do teen plus" likhte ho. Mukhya property ye hai ki har operator ki position pehle se aapko thik-thik batati hai ki wo kaunse do values par lagta hai: wo do sabse haal ke banaaye gaye results par lagta hai. Resolve karne ko koi ambiguity nahi, isliye ties todne ko precedence rules ki koi zaroorat nahi aur cheezein group karne ko parentheses ki koi zaroorat nahi — tokens ka linear kram hi grouping hai. Yahi wajah hai ki compilers aur stack machines infix source code ko ek postfix ya tree form mein convert karte hain: evaluation ek trivial single pass ban jaata hai. Algorithm hai: values ka ek stack rakho, tokens scan karo, aur har token ke liye, agar wo ek number hai ise push karo, agar wo ek operator hai top do values pop karo, operator lagao, aur result push karo. Jo bug lagbhag sab pahunchte hain wo do pops ka kram hai. Subtraction ya division jaise ek non-commutative operator ke liye, kram maayne rakhta hai. "a minus b" ke tokens a, phir b, phir minus hain, isliye a pehle push hota hai aur b doosra. Jab aap pop karte ho, stack aapko sabse haal ka pehle deta hai, isliye aapka pehla pop b hai aur doosra pop a hai. Sahi expression second-pop minus first-pop hai, matlab a minus b.',
      },
    ],

    exercises: [
      {
        task: 'Implement calculate (+ - * / with precedence, no parens). Verify "2 + 3 * 4" -> 14, "10 - 2 * 3" -> 4, " 3+5 / 2 " -> 5, "14-3/2" -> 13. Then remove the trailing "+" trick and show the last number is dropped.',
        taskHi: 'calculate implement karo (+ - * / precedence ke saath, bina parens). Verify karo "2 + 3 * 4" -> 14, "10 - 2 * 3" -> 4, " 3+5 / 2 " -> 5, "14-3/2" -> 13. Phir trailing "+" trick hataao aur dikhao ki aakhri number gir jaata hai.',
        hint: 'Without the appended "+", "2 + 3" reads 2, sees "+", then reads 3 into num — but the loop ends before another operator triggers the push of 3, so the stack only has [2] and the answer is 2.',
        hintHi: 'Joda hua "+" ke bina, "2 + 3" 2 padhta hai, "+" dekhta hai, phir 3 ko num mein padhta hai — par loop khatam ho jaata hai isse pehle ki ek aur operator 3 ki push trigger kare, isliye stack mein sirf [2] hai aur jawaab 2 hai.',
      },
      {
        task: 'Implement evalRPN. Verify ["2","1","+","3","*"] -> 9, ["4","13","5","/","+"] -> 6, ["5","1","2","+","4","*","+","3","-"] -> 14. Then swap the two pops (a first, b second) and show that ["10","3","-"] returns -7 instead of 7.',
        taskHi: 'evalRPN implement karo. Verify karo ["2","1","+","3","*"] -> 9, ["4","13","5","/","+"] -> 6, ["5","1","2","+","4","*","+","3","-"] -> 14. Phir do pops swap karo (a pehle, b doosra) aur dikhao ki ["10","3","-"] 7 ke bajaye -7 lautaata hai.',
        hint: '["10","3","-"] pushes 10 then 3. Correct: pop 3 (b), pop 10 (a), a - b = 7. Swapped: pop 3 (a), pop 10 (b), a - b = 3 - 10 = -7. Try ["10","3","+"] with both orders — it stays 13, because + commutes.',
        hintHi: '["10","3","-"] 10 phir 3 push karta hai. Sahi: 3 pop (b), 10 pop (a), a - b = 7. Swapped: 3 pop (a), 10 pop (b), a - b = 3 - 10 = -7. ["10","3","+"] ko dono orders ke saath try karo — ye 13 rehta hai, kyunki + commute karta hai.',
      },
      {
        task: 'Implement decodeString with two stacks. Verify "3[a2[c]]" -> "accaccacc", "2[abc]3[cd]ef" -> "abcabccdcdcdef", "10[a]" -> "aaaaaaaaaa". Explain what countStack and strStack hold when the parser is sitting on the inner "]" of "3[a2[c]]".',
        taskHi: 'decodeString ko do stacks ke saath implement karo. Verify karo "3[a2[c]]" -> "accaccacc", "2[abc]3[cd]ef" -> "abcabccdcdcdef", "10[a]" -> "aaaaaaaaaa". Samjhaao ki jab parser "3[a2[c]]" ke inner "]" par baitha hai tab countStack aur strStack kya rakhte hain.',
        hint: 'At the inner "]", countStack is [3, 2] and strStack is ["", "a"]. Popping gives repeat 2 and prefix "a": cur becomes "a" + "c".repeat(2) = "acc". The next "]" pops 3 and "", giving "acc".repeat(3).',
        hintHi: 'Inner "]" par, countStack [3, 2] hai aur strStack ["", "a"] hai. Pop karna repeat 2 aur prefix "a" deta hai: cur "a" + "c".repeat(2) = "acc" ban jaata hai. Agla "]" 3 aur "" pop karta hai, "acc".repeat(3) dete hue.',
      },
    ],

    keyTakeaways: [
      'A single running accumulator cannot handle operator precedence — "2 + 3 * 4" needs the "+ 2" deferred until "3 * 4" resolves.',
      'Precedence calculator: scan numbers, track the operator BEFORE the current number. + / - push the number (negate for -) as a standalone term; * / pop the top term, combine, push back. Sum the stack at the end.',
      'Append a trailing "+" (or handle end-of-string) so the final number gets flushed — the push is triggered by the NEXT operator, which the last number lacks.',
      'RPN (postfix) needs no precedence or parentheses: scan tokens, push numbers, on an operator pop two and apply. The FIRST pop is the right operand, the SECOND is the left — critical for - and /, invisible for + and *.',
      'Parentheses: an "(" starts a fresh sub-evaluation returning one number; a ")" ends it. Recurse, or push (stack, op) onto an explicit stack.',
      'Decode string / nested repetition needs TWO stacks: one for pending repeat counts, one for pending prefixes. "[" pushes both and resets; "]" pops both and splices.',
      'Integer division in these problems truncates toward zero — use Math.trunc, not Math.floor (which rounds negatives the wrong way).',
    ],
    keyTakeawaysHi: [
      'Ek akela running accumulator operator precedence handle nahi kar sakta — "2 + 3 * 4" ko "+ 2" ko "3 * 4" resolve hone tak deferred chahiye.',
      'Precedence calculator: numbers scan karo, current number se PEHLE ka operator track karo. + / - number push karte hain (- ke liye negate) ek standalone term ki tarah; * / top term pop karte hain, combine, wapas push. Ant mein stack sum karo.',
      'Ek trailing "+" jodo (ya end-of-string handle karo) taaki antim number flush ho — push AGLE operator se trigger hota hai, jo aakhri number ke paas nahi.',
      'RPN (postfix) ko koi precedence ya parentheses nahi chahiye: tokens scan karo, numbers push karo, ek operator par do pop karo aur lagao. PEHLA pop right operand hai, DOOSRA left — - aur / ke liye mahatvapurna, + aur * ke liye anadekha.',
      'Parentheses: ek "(" ek naya sub-evaluation shuru karta hai jo ek number lautaata hai; ek ")" ise khatam karta hai. Recurse karo, ya (stack, op) ek explicit stack par push karo.',
      'Decode string / nested repetition ko DO stacks chahiye: ek pending repeat counts ke liye, ek pending prefixes ke liye. "[" dono push karta hai aur reset; "]" dono pop karta hai aur splice.',
      'In problems mein integer division zero ki taraf truncate karta hai — Math.trunc istemal karo, Math.floor nahi (jo negatives ko galat tarike se round karta hai).',
    ],
  },
];
