import type { AlgorithmDemo, Frame, MapEntry, Tone } from '../types';

/**
 * Each builder replays a real algorithm and records a frame at every decision
 * point. The code here mirrors the seeded reference solutions on purpose — what
 * you watch is what you are asked to write.
 */

/* ─────────────────────────── Two Sum — hash map ──────────────────────────── */

function twoSumFrames(): Frame[] {
  const arr = [2, 7, 11, 15, 3];
  const target = 18;
  const frames: Frame[] = [];
  const seen = new Map<number, number>();

  const mapEntries = (freshKey?: number, hitKey?: number): MapEntry[] =>
    [...seen.entries()].map(([k, v]) => ({
      key: String(k),
      value: `index ${v}`,
      fresh: k === freshKey,
      hit: k === hitKey,
    }));

  frames.push({
    note: `Goal: find two numbers that add to ${target}. The hash map will remember every number we have already passed.`,
    noteHi: `Target: do numbers jinka sum ${target} ho. Hash map yaad rakhega ki ab tak kaun se numbers dekh chuke hain.`,
    cells: arr,
    cellTones: {},
    map: { title: 'seen  (value → index)', entries: [] },
    vars: [{ label: 'target', value: String(target) }],
  });

  for (let i = 0; i < arr.length; i += 1) {
    const x = arr[i]!;
    const need = target - x;

    frames.push({
      note: `At index ${i} the value is ${x}. So the partner we need is ${target} − ${x} = ${need}. Is ${need} in the map?`,
      noteHi: `Index ${i} par value ${x} hai. Matlab partner chahiye ${target} − ${x} = ${need}. Kya ${need} map mein hai?`,
      cells: arr,
      cellTones: { [i]: 'active' },
      pointers: [{ name: 'i', index: i, tone: 'active' }],
      map: { title: 'seen  (value → index)', entries: mapEntries() },
      vars: [
        { label: 'target', value: String(target) },
        { label: 'need', value: String(need), tone: 'warn' },
      ],
    });

    if (seen.has(need)) {
      const j = seen.get(need)!;
      frames.push({
        note: `Yes — ${need} is at index ${j}. ${arr[j]} + ${x} = ${target}. Done in one pass.`,
        noteHi: `Haan — ${need} index ${j} par hai. ${arr[j]} + ${x} = ${target}. Ek hi pass mein ho gaya.`,
        cells: arr,
        cellTones: { [i]: 'good', [j]: 'good' },
        pointers: [
          { name: 'j', index: j, tone: 'good' },
          { name: 'i', index: i, tone: 'good' },
        ],
        map: { title: 'seen  (value → index)', entries: mapEntries(undefined, need) },
        vars: [
          { label: 'target', value: String(target) },
          { label: 'answer', value: `[${j}, ${i}]`, tone: 'good' },
        ],
        result: `Answer: indices ${j} and ${i}`,
        resultHi: `Answer: index ${j} aur ${i}`,
      });
      return frames;
    }

    seen.set(x, i);
    frames.push({
      note: `No. Store ${x} → index ${i} so a later number can find it, and move on. Storing AFTER the check is what stops an element pairing with itself.`,
      noteHi: `Nahi mila. ${x} → index ${i} store kar do taaki aage koi number ise dhoondh sake. Check ke BAAD store karna hi element ko khud se pair hone se rokta hai.`,
      cells: arr,
      cellTones: { [i]: 'dim' },
      pointers: [{ name: 'i', index: i, tone: 'idle' }],
      map: { title: 'seen  (value → index)', entries: mapEntries(x) },
      vars: [{ label: 'target', value: String(target) }],
    });
  }

  return frames;
}

/* ───────────────────── Two pointers — sorted array sum ───────────────────── */

function twoPointerFrames(): Frame[] {
  const arr = [2, 3, 5, 8, 11, 15];
  const target = 19;
  const frames: Frame[] = [];
  let l = 0;
  let r = arr.length - 1;

  frames.push({
    note: `The array is sorted, so start as wide as possible: one pointer at each end.`,
    noteHi: `Array sorted hai, isliye sabse chaudi jagah se shuru karo: dono ends par ek-ek pointer.`,
    cells: arr,
    ranges: [{ from: 0, to: arr.length - 1, tone: 'active', label: 'search space' }],
    pointers: [
      { name: 'l', index: l, tone: 'active' },
      { name: 'r', index: r, tone: 'active' },
    ],
    vars: [{ label: 'target', value: String(target) }],
  });

  while (l < r) {
    const sum = arr[l]! + arr[r]!;

    if (sum === target) {
      frames.push({
        note: `${arr[l]} + ${arr[r]} = ${sum}. That is the target.`,
        noteHi: `${arr[l]} + ${arr[r]} = ${sum}. Yahi target hai.`,
        cells: arr,
        cellTones: { [l]: 'good', [r]: 'good' },
        pointers: [
          { name: 'l', index: l, tone: 'good' },
          { name: 'r', index: r, tone: 'good' },
        ],
        vars: [
          { label: 'sum', value: String(sum), tone: 'good' },
          { label: 'target', value: String(target) },
        ],
        result: `Found at indices ${l} and ${r}`,
        resultHi: `Index ${l} aur ${r} par mil gaya`,
      });
      return frames;
    }

    const tooBig = sum > target;
    frames.push({
      note: `${arr[l]} + ${arr[r]} = ${sum}, which is too ${tooBig ? 'big' : 'small'}. ${
        tooBig
          ? `Every pair using ${arr[r]} is at least this big, so drop the whole right end.`
          : `Every pair using ${arr[l]} is at most this big, so drop the whole left end.`
      }`,
      noteHi: `${arr[l]} + ${arr[r]} = ${sum}, jo ${tooBig ? 'bahut bada' : 'bahut chhota'} hai. ${
        tooBig
          ? `${arr[r]} wale saare pairs itne hi bade honge, isliye poora right end hata do.`
          : `${arr[l]} wale saare pairs itne hi chhote honge, isliye poora left end hata do.`
      }`,
      cells: arr,
      cellTones: { [l]: tooBig ? 'active' : 'bad', [r]: tooBig ? 'bad' : 'active' },
      ranges: [{ from: l, to: r, tone: 'active', label: 'still possible' }],
      pointers: [
        { name: 'l', index: l, tone: tooBig ? 'active' : 'bad' },
        { name: 'r', index: r, tone: tooBig ? 'bad' : 'active' },
      ],
      vars: [
        { label: 'sum', value: String(sum), tone: tooBig ? 'warn' : 'warn' },
        { label: 'target', value: String(target) },
      ],
    });

    if (tooBig) r -= 1;
    else l += 1;
  }

  frames.push({
    note: 'The pointers met without finding a pair.',
    noteHi: 'Pointers mil gaye par koi pair nahi mila.',
    cells: arr,
    result: 'No pair found',
    resultHi: 'Koi pair nahi mila',
  });
  return frames;
}

/* ────────────────── Sliding window — longest unique substring ─────────────── */

function slidingWindowFrames(): Frame[] {
  const s = 'abcabcbb';
  const chars = s.split('');
  const frames: Frame[] = [];
  const last = new Map<string, number>();
  let left = 0;
  let best = 0;
  let bestRange: [number, number] = [0, 0];

  frames.push({
    note: `Grow a window to the right. The window must never contain a repeated character.`,
    noteHi: `Window ko right mein badhao. Window mein kabhi koi character repeat nahi hona chahiye.`,
    cells: chars,
    ranges: [{ from: 0, to: 0, tone: 'active', label: 'window' }],
    map: { title: 'last seen  (char → index)', entries: [] },
    vars: [{ label: 'best', value: '0' }],
  });

  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i]!;
    const seenAt = last.get(c);
    const repeat = seenAt !== undefined && seenAt >= left;

    if (repeat) {
      frames.push({
        note: `'${c}' is already inside the window (index ${seenAt}). Jump left to ${seenAt! + 1} — never backwards, or old characters would sneak back in.`,
        noteHi: `'${c}' pehle se window ke andar hai (index ${seenAt}). left ko ${seenAt! + 1} par le jao — peeche kabhi nahi, warna purane characters wapas ghus jayenge.`,
        cells: chars,
        cellTones: { [i]: 'bad', [seenAt!]: 'warn' },
        ranges: [{ from: left, to: i, tone: 'bad', label: 'has a repeat' }],
        pointers: [
          { name: 'left', index: left, tone: 'warn' },
          { name: 'i', index: i, tone: 'bad' },
        ],
        map: {
          title: 'last seen  (char → index)',
          entries: [...last.entries()].map(([k, v]) => ({ key: k, value: `index ${v}`, hit: k === c })),
        },
        vars: [{ label: 'best', value: String(best) }],
      });
      left = seenAt! + 1;
    }

    last.set(c, i);
    const width = i - left + 1;
    if (width > best) {
      best = width;
      bestRange = [left, i];
    }

    frames.push({
      note: repeat
        ? `Window is now [${left}…${i}] = "${s.slice(left, i + 1)}", width ${width}.`
        : `'${c}' is new. Window grows to [${left}…${i}] = "${s.slice(left, i + 1)}", width ${width}.${
            width === best ? ' New best.' : ''
          }`,
      noteHi: repeat
        ? `Ab window [${left}…${i}] = "${s.slice(left, i + 1)}" hai, width ${width}.`
        : `'${c}' naya hai. Window badh kar [${left}…${i}] = "${s.slice(left, i + 1)}", width ${width}.${
            width === best ? ' Naya best.' : ''
          }`,
      cells: chars,
      cellTones: { [i]: 'active' },
      ranges: [{ from: left, to: i, tone: width === best ? 'good' : 'active', label: `width ${width}` }],
      pointers: [
        { name: 'left', index: left, tone: 'idle' },
        { name: 'i', index: i, tone: 'active' },
      ],
      map: {
        title: 'last seen  (char → index)',
        entries: [...last.entries()].map(([k, v]) => ({ key: k, value: `index ${v}`, fresh: k === c })),
      },
      vars: [{ label: 'best', value: String(best), tone: width === best ? 'good' : undefined }],
    });
  }

  frames.push({
    note: `Longest run without a repeat is "${s.slice(bestRange[0], bestRange[1] + 1)}" — length ${best}. Both pointers only ever moved forward, so this was O(n).`,
    noteHi: `Bina repeat ka sabse lamba hissa "${s.slice(bestRange[0], bestRange[1] + 1)}" hai — length ${best}. Dono pointers sirf aage badhe, isliye ye O(n) tha.`,
    cells: chars,
    ranges: [{ from: bestRange[0], to: bestRange[1], tone: 'good', label: 'answer' }],
    vars: [{ label: 'best', value: String(best), tone: 'good' }],
    result: `Length ${best}`,
    resultHi: `Length ${best}`,
  });

  return frames;
}

/* ────────────────────────────── Binary search ────────────────────────────── */

function binarySearchFrames(): Frame[] {
  const arr = [-1, 0, 3, 5, 9, 12, 17, 21];
  const target = 12;
  const frames: Frame[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  let step = 0;

  frames.push({
    note: `Looking for ${target} in a sorted array of ${arr.length}. Each step throws away half the remaining range.`,
    noteHi: `${arr.length} elements ke sorted array mein ${target} dhoondhna hai. Har step baaki range ka aadha hissa phenk deta hai.`,
    cells: arr,
    ranges: [{ from: 0, to: arr.length - 1, tone: 'active', label: `${arr.length} candidates` }],
    vars: [{ label: 'target', value: String(target) }],
  });

  while (lo <= hi) {
    step += 1;
    const mid = lo + ((hi - lo) >> 1);
    const v = arr[mid]!;

    if (v === target) {
      frames.push({
        note: `Step ${step}: middle is index ${mid} = ${v}. Found it after ${step} comparison${step === 1 ? '' : 's'} instead of scanning all ${arr.length}.`,
        noteHi: `Step ${step}: beech ka index ${mid} = ${v}. Poore ${arr.length} scan karne ki jagah sirf ${step} comparison mein mil gaya.`,
        cells: arr,
        cellTones: { [mid]: 'good' },
        ranges: [{ from: lo, to: hi, tone: 'good' }],
        pointers: [{ name: 'mid', index: mid, tone: 'good' }],
        vars: [
          { label: 'steps', value: String(step), tone: 'good' },
          { label: 'target', value: String(target) },
        ],
        result: `Found at index ${mid}`,
        resultHi: `Index ${mid} par mila`,
      });
      return frames;
    }

    const goRight = v < target;
    frames.push({
      note: `Step ${step}: middle is index ${mid} = ${v}, which is ${goRight ? 'less' : 'greater'} than ${target}. So the answer must be in the ${goRight ? 'right' : 'left'} half — discard the other ${goRight ? mid - lo + 1 : hi - mid + 1} elements.`,
      noteHi: `Step ${step}: beech ka index ${mid} = ${v}, jo ${target} se ${goRight ? 'chhota' : 'bada'} hai. Isliye answer ${goRight ? 'right' : 'left'} half mein hoga — baaki ${goRight ? mid - lo + 1 : hi - mid + 1} elements hata do.`,
      cells: arr,
      cellTones: { [mid]: 'warn' },
      ranges: [
        { from: lo, to: hi, tone: 'dim' },
        goRight
          ? { from: mid + 1, to: hi, tone: 'active', label: 'keep' }
          : { from: lo, to: mid - 1, tone: 'active', label: 'keep' },
      ],
      pointers: [
        { name: 'lo', index: lo, tone: 'idle' },
        { name: 'mid', index: mid, tone: 'warn' },
        { name: 'hi', index: hi, tone: 'idle' },
      ],
      vars: [
        { label: 'steps', value: String(step) },
        { label: 'target', value: String(target) },
      ],
    });

    if (goRight) lo = mid + 1;
    else hi = mid - 1;
  }

  frames.push({
    note: 'The range is empty, so the value is not present.',
    noteHi: 'Range khaali ho gayi, matlab value hai hi nahi.',
    cells: arr,
    result: 'Not found (-1)',
    resultHi: 'Nahi mila (-1)',
  });
  return frames;
}

/* ─────────────────────────── Kadane — max subarray ───────────────────────── */

function kadaneFrames(): Frame[] {
  const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const frames: Frame[] = [];
  let cur = arr[0]!;
  let best = arr[0]!;
  let start = 0;
  let bestRange: [number, number] = [0, 0];

  frames.push({
    note: `At every index ask one question: is it better to extend the run so far, or start fresh here?`,
    noteHi: `Har index par ek hi sawaal: ab tak ki run ko aage badhana behtar hai, ya yahin se naya shuru karna?`,
    cells: arr,
    cellTones: { 0: 'active' },
    pointers: [{ name: 'i', index: 0, tone: 'active' }],
    ranges: [{ from: 0, to: 0, tone: 'active', label: 'current run' }],
    vars: [
      { label: 'cur', value: String(cur) },
      { label: 'best', value: String(best) },
    ],
  });

  for (let i = 1; i < arr.length; i += 1) {
    const x = arr[i]!;
    const extend = cur + x;
    const restart = extend < x;

    if (restart) {
      cur = x;
      start = i;
    } else {
      cur = extend;
    }

    const isBest = cur > best;
    if (isBest) {
      best = cur;
      bestRange = [start, i];
    }

    frames.push({
      note: restart
        ? `Previous run summed to ${extend - x}, which is negative — carrying it forward would only hurt. Drop it and restart at ${x}.`
        : `Extending gives ${cur}, better than starting over at ${x}. Keep the run going.${isBest ? ` That is a new best (${best}).` : ''}`,
      noteHi: restart
        ? `Pichhli run ka sum ${extend - x} tha, jo negative hai — usko aage le jaane se sirf nuksaan hoga. Chhod do aur ${x} se dobara shuru.`
        : `Aage badhane se ${cur} milta hai, jo ${x} se naya shuru karne se behtar hai. Run chalti rahe.${isBest ? ` Ye naya best hai (${best}).` : ''}`,
      cells: arr,
      cellTones: { [i]: restart ? 'warn' : 'active' },
      pointers: [{ name: 'i', index: i, tone: restart ? 'warn' : 'active' }],
      ranges: [
        { from: start, to: i, tone: isBest ? 'good' : 'active', label: `sum ${cur}` },
        ...(bestRange[1] !== i
          ? [{ from: bestRange[0], to: bestRange[1], tone: 'dim' as const, label: `best ${best}` }]
          : []),
      ],
      vars: [
        { label: 'cur', value: String(cur), tone: restart ? 'warn' : undefined },
        { label: 'best', value: String(best), tone: isBest ? 'good' : undefined },
      ],
    });
  }

  frames.push({
    note: `Best run is indices ${bestRange[0]}…${bestRange[1]} summing to ${best}. One pass, no nested loops — that is Kadane.`,
    noteHi: `Sabse achhi run index ${bestRange[0]}…${bestRange[1]} hai, sum ${best}. Ek pass, koi nested loop nahi — yahi Kadane hai.`,
    cells: arr,
    ranges: [{ from: bestRange[0], to: bestRange[1], tone: 'good', label: `sum ${best}` }],
    vars: [{ label: 'best', value: String(best), tone: 'good' }],
    result: `Maximum subarray sum = ${best}`,
    resultHi: `Maximum subarray sum = ${best}`,
  });

  return frames;
}

/* ─────────────────── Dutch national flag — sort colours ──────────────────── */

function dutchFlagFrames(): Frame[] {
  const arr = [2, 0, 2, 1, 1, 0];
  const frames: Frame[] = [];
  let lo = 0;
  let mid = 0;
  let hi = arr.length - 1;

  const snapshot = (note: string, noteHi: string, tones: Record<number, Tone> = {}): Frame => ({
    note,
    noteHi,
    cells: [...arr],
    cellTones: tones,
    ranges: [
      ...(lo > 0 ? [{ from: 0, to: lo - 1, tone: 'good' as const, label: '0s' }] : []),
      ...(mid <= hi ? [{ from: mid, to: hi, tone: 'active' as const, label: 'unknown' }] : []),
      ...(hi < arr.length - 1
        ? [{ from: hi + 1, to: arr.length - 1, tone: 'warn' as const, label: '2s' }]
        : []),
    ],
    pointers: [
      { name: 'lo', index: lo, tone: 'good' },
      { name: 'mid', index: Math.min(mid, arr.length - 1), tone: 'active' },
      { name: 'hi', index: Math.max(hi, 0), tone: 'warn' },
    ],
  });

  frames.push(
    snapshot(
      'Three regions: settled 0s on the left, settled 2s on the right, unknown in the middle. mid walks through the unknown part.',
      'Teen hisse: left mein pakke 0s, right mein pakke 2s, beech mein unknown. mid unknown hisse par chalta hai.',
    ),
  );

  while (mid <= hi) {
    const v = arr[mid]!;

    if (v === 0) {
      [arr[lo], arr[mid]] = [arr[mid]!, arr[lo]!];
      frames.push(
        snapshot(
          `${v} at mid — swap it into the 0s region. The value coming back was already checked, so mid can move on.`,
          `mid par ${v} — use 0s wale hisse mein swap kar do. Jo value wapas aayi wo pehle hi check ho chuki thi, isliye mid aage badh sakta hai.`,
          { [lo]: 'good', [mid]: 'good' },
        ),
      );
      lo += 1;
      mid += 1;
    } else if (v === 2) {
      [arr[hi], arr[mid]] = [arr[mid]!, arr[hi]!];
      frames.push(
        snapshot(
          `${v} at mid — swap it into the 2s region. This time mid does NOT move: the value that just arrived has never been looked at.`,
          `mid par ${v} — use 2s wale hisse mein swap karo. Ab mid aage NAHI badhega: jo value abhi aayi hai use kabhi dekha hi nahi gaya.`,
          { [hi]: 'warn', [mid]: 'bad' },
        ),
      );
      hi -= 1;
    } else {
      frames.push(
        snapshot(
          `${v} at mid — it is already in the right place. Just step over it.`,
          `mid par ${v} — ye pehle se sahi jagah par hai. Bas aage badh jao.`,
          { [mid]: 'active' },
        ),
      );
      mid += 1;
    }
  }

  frames.push({
    note: `Sorted in a single pass with no extra memory. The asymmetry — advancing mid after a 0-swap but not a 2-swap — is the whole trick.`,
    noteHi: `Ek hi pass mein sort, bina extra memory. Asli trick wahi asymmetry hai — 0-swap ke baad mid badhta hai, 2-swap ke baad nahi.`,
    cells: [...arr],
    ranges: [{ from: 0, to: arr.length - 1, tone: 'good', label: 'sorted' }],
    result: `[${arr.join(', ')}]`,
    resultHi: `[${arr.join(', ')}]`,
  });

  return frames;
}

/* ──────────────────── Valid parentheses — stack in action ────────────────── */

function stackFrames(): Frame[] {
  const s = '{[()]}';
  const chars = s.split('');
  const frames: Frame[] = [];
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  frames.push({
    note: 'Nesting is last-in-first-out: whatever opened most recently must close first. That is exactly a stack.',
    noteHi: 'Nesting last-in-first-out hoti hai: jo sabse baad mein khula, wahi pehle band hoga. Bilkul stack jaisa.',
    cells: chars,
    stack: { title: 'stack', items: [] },
  });

  for (let i = 0; i < chars.length; i += 1) {
    const c = chars[i]!;

    if (c === '(' || c === '[' || c === '{') {
      stack.push(c);
      frames.push({
        note: `'${c}' opens — push it and remember we owe a matching close.`,
        noteHi: `'${c}' khula — push kar do, yaad rahe ki iska closing baaki hai.`,
        cells: chars,
        cellTones: { [i]: 'active' },
        pointers: [{ name: 'i', index: i, tone: 'active' }],
        stack: { title: 'stack', items: [...stack] },
      });
    } else {
      const top = stack[stack.length - 1];
      const ok = top === pairs[c];
      stack.pop();
      frames.push({
        note: ok
          ? `'${c}' closes — the top of the stack is '${top}', which matches. Pop it.`
          : `'${c}' closes but the top is '${top ?? 'nothing'}' — mismatch, so the string is invalid.`,
        noteHi: ok
          ? `'${c}' band hua — stack ke top par '${top}' hai, match ho gaya. Pop kar do.`
          : `'${c}' band hua par top par '${top ?? 'kuch nahi'}' hai — mismatch, string invalid hai.`,
        cells: chars,
        cellTones: { [i]: ok ? 'good' : 'bad' },
        pointers: [{ name: 'i', index: i, tone: ok ? 'good' : 'bad' }],
        stack: { title: 'stack', items: [...stack], poppedLabel: top },
      });
      if (!ok) {
        frames.push({
          note: 'Invalid — a closing bracket did not match the most recent opening one.',
          noteHi: 'Invalid — closing bracket sabse recent opening se match nahi hua.',
          cells: chars,
          result: 'false',
          resultHi: 'false',
        });
        return frames;
      }
    }
  }

  frames.push({
    note: `Every bracket matched and the stack ended empty. Both conditions matter — "(((" also matches nothing but leaves the stack full.`,
    noteHi: `Har bracket match hua aur stack khaali khatam hua. Dono zaroori hain — "(((" mein bhi mismatch nahi hota par stack bhara reh jata hai.`,
    cells: chars,
    cellTones: Object.fromEntries(chars.map((_, i) => [i, 'good' as Tone])),
    stack: { title: 'stack', items: [] },
    result: 'true — balanced',
    resultHi: 'true — balanced',
  });

  return frames;
}

/* ──────────────────── Coin change — filling a DP table ───────────────────── */

function coinChangeFrames(): Frame[] {
  const coins = [1, 3, 4];
  const amount = 6;
  const INF = Infinity;
  const dp: number[] = [0, ...Array<number>(amount).fill(INF)];
  const frames: Frame[] = [];

  const row = (cursor?: number, tone: Tone = 'active') =>
    dp.map((v, i) => ({
      value: v === INF ? '∞' : v,
      tone: i === cursor ? tone : v === INF ? ('dim' as Tone) : ('done' as Tone),
    }));

  frames.push({
    note: `Coins ${coins.join(', ')} — fewest coins to make ${amount}. Greedy fails here: taking 4 first forces 4+1+1 (three coins) when 3+3 (two) is better. So compute every amount from the ones below it.`,
    noteHi: `Coins ${coins.join(', ')} — ${amount} banane ke liye kam se kam kitne coins. Greedy yahan fail hota hai: pehle 4 lo to 4+1+1 (teen coins) lena padta hai, jabki 3+3 (do) behtar hai. Isliye har amount ko usse chhote amounts se nikalo.`,
    table: {
      title: 'dp[amount] = fewest coins',
      rows: [row()],
      colLabels: dp.map((_, i) => String(i)),
      rowLabels: ['coins'],
    },
    vars: [{ label: 'dp[0]', value: '0', tone: 'done' }],
  });

  for (let a = 1; a <= amount; a += 1) {
    for (const c of coins) {
      if (c > a) continue;
      const candidate = dp[a - c]! + 1;
      const better = candidate < dp[a]!;

      frames.push({
        note: `dp[${a}] using coin ${c}: that leaves ${a - c}, which needs ${dp[a - c] === INF ? '∞' : dp[a - c]} coins, so ${dp[a - c] === INF ? '∞' : `${dp[a - c]} + 1 = ${candidate}`}. ${
          better ? `Better than ${dp[a] === INF ? '∞' : dp[a]} — take it.` : `Not better than ${dp[a]} — keep what we had.`
        }`,
        noteHi: `dp[${a}] mein coin ${c}: bacha ${a - c}, jiske liye ${dp[a - c] === INF ? '∞' : dp[a - c]} coins chahiye, matlab ${dp[a - c] === INF ? '∞' : `${dp[a - c]} + 1 = ${candidate}`}. ${
          better ? `${dp[a] === INF ? '∞' : dp[a]} se behtar hai — le lo.` : `${dp[a]} se behtar nahi — purana hi rakho.`
        }`,
        table: {
          title: 'dp[amount] = fewest coins',
          rows: [
            dp.map((v, i) => ({
              value: v === INF ? '∞' : v,
              tone:
                i === a
                  ? better
                    ? ('good' as Tone)
                    : ('warn' as Tone)
                  : i === a - c
                    ? ('active' as Tone)
                    : v === INF
                      ? ('dim' as Tone)
                      : ('done' as Tone),
            })),
          ],
          colLabels: dp.map((_, i) => String(i)),
          rowLabels: ['coins'],
        },
        vars: [
          { label: 'amount', value: String(a), tone: 'active' },
          { label: 'coin', value: String(c) },
          { label: 'candidate', value: candidate === INF ? '∞' : String(candidate), tone: better ? 'good' : 'warn' },
        ],
      });

      if (better) dp[a] = candidate;
    }
  }

  frames.push({
    note: `dp[${amount}] = ${dp[amount]} — that is 3 + 3, which greedy would have missed. Every cell was built from smaller cells already solved.`,
    noteHi: `dp[${amount}] = ${dp[amount]} — matlab 3 + 3, jo greedy miss kar deta. Har cell pehle se solved chhote cells se bani.`,
    table: {
      title: 'dp[amount] = fewest coins',
      rows: [row(amount, 'good')],
      colLabels: dp.map((_, i) => String(i)),
      rowLabels: ['coins'],
    },
    vars: [{ label: `dp[${amount}]`, value: String(dp[amount]), tone: 'good' }],
    result: `${dp[amount]} coins (3 + 3)`,
    resultHi: `${dp[amount]} coins (3 + 3)`,
  });

  return frames;
}

/* ───────────────────── Number of islands — flood fill ────────────────────── */

function islandsFrames(): Frame[] {
  const raw = ['11000', '11000', '00100', '00011'];
  const grid = raw.map((r) => r.split(''));
  const rows = grid.length;
  const cols = grid[0]!.length;
  const frames: Frame[] = [];
  const tones: Record<string, Tone> = {};
  let count = 0;

  const key = (r: number, c: number) => `${r},${c}`;
  const snapshot = (note: string, noteHi: string): Frame => ({
    note,
    noteHi,
    grid: { title: 'grid  (1 = land, 0 = water)', rows: raw.map((r) => r.split('')), tones: { ...tones } },
    vars: [{ label: 'islands', value: String(count), tone: count > 0 ? 'good' : undefined }],
  });

  frames.push(
    snapshot(
      'Scan the grid. Every unvisited piece of land starts a new island — then flood-fill it so its whole body is never counted again.',
      'Grid scan karo. Har unvisited zameen ek naya island shuru karti hai — phir flood-fill karke poora hissa mark kar do taaki dobara na gine.',
    ),
  );

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r]![c] !== '1') continue;

      count += 1;
      const stack: [number, number][] = [[r, c]];
      grid[r]![c] = '0';
      tones[key(r, c)] = 'good';

      frames.push(
        snapshot(
          `Found unvisited land at (${r}, ${c}). That is island number ${count} — now flood-fill everything connected to it.`,
          `(${r}, ${c}) par unvisited zameen mili. Ye island number ${count} hai — ab isse judi har cell ko flood-fill karo.`,
        ),
      );

      while (stack.length) {
        const [y, x] = stack.pop()!;
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
          if (grid[ny]![nx] !== '1') continue;
          grid[ny]![nx] = '0';
          tones[key(ny, nx)] = 'good';
          stack.push([ny, nx]);
        }
      }

      frames.push(
        snapshot(
          `Island ${count} is fully marked. Because we mark as we go, every cell is visited exactly once — that is what keeps this linear.`,
          `Island ${count} poora mark ho gaya. Chalte-chalte mark karne ki wajah se har cell sirf ek baar visit hota hai — isi se ye linear rehta hai.`,
        ),
      );
    }
  }

  frames.push({
    ...snapshot(
      `${count} islands. The grid itself was the graph — no edge list was ever built.`,
      `${count} islands. Grid khud hi graph tha — koi edge list banane ki zarurat nahi padi.`,
    ),
    result: `${count} islands`,
    resultHi: `${count} islands`,
  });

  return frames;
}

/* ───────────────────────────────── registry ──────────────────────────────── */

export const DEMOS: AlgorithmDemo[] = [
  {
    id: 'two-sum-hashmap',
    title: 'Two Sum',
    pattern: 'Hash map — trade space for time',
    problemSlugs: ['two-sum'],
    topicSlugs: ['js-map-set', 'python-data-structures'],
    inputLabel: 'nums = [2, 7, 11, 15, 3], target = 18',
    complexity: { time: 'O(n)', space: 'O(n)' },
    build: twoSumFrames,
  },
  {
    id: 'two-pointer',
    title: 'Two Pointers on a sorted array',
    pattern: 'Two pointers — discard a whole side per step',
    problemSlugs: ['two-sum-sorted', 'container-with-most-water', 'remove-duplicates-sorted-array'],
    inputLabel: 'nums = [2, 3, 5, 8, 11, 15], target = 19',
    complexity: { time: 'O(n)', space: 'O(1)' },
    build: twoPointerFrames,
  },
  {
    id: 'sliding-window',
    title: 'Longest Substring Without Repeating',
    pattern: 'Sliding window — both pointers only move forward',
    problemSlugs: ['longest-substring-without-repeating', 'max-sum-subarray-size-k'],
    inputLabel: 's = "abcabcbb"',
    complexity: { time: 'O(n)', space: 'O(min(n, alphabet))' },
    build: slidingWindowFrames,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    pattern: 'Halve the search space every step',
    problemSlugs: ['binary-search', 'search-in-rotated-sorted-array'],
    inputLabel: 'nums = [-1, 0, 3, 5, 9, 12, 17, 21], target = 12',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    build: binarySearchFrames,
  },
  {
    id: 'kadane',
    title: 'Maximum Subarray (Kadane)',
    pattern: 'DP in one variable — extend or restart',
    problemSlugs: ['maximum-subarray', 'best-time-to-buy-and-sell-stock'],
    inputLabel: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    complexity: { time: 'O(n)', space: 'O(1)' },
    build: kadaneFrames,
  },
  {
    id: 'dutch-flag',
    title: 'Sort Colors (Dutch National Flag)',
    pattern: 'Three-way partition in one pass',
    problemSlugs: ['sort-colors'],
    inputLabel: 'nums = [2, 0, 2, 1, 1, 0]',
    complexity: { time: 'O(n)', space: 'O(1)' },
    build: dutchFlagFrames,
  },
  {
    id: 'stack-parens',
    title: 'Valid Parentheses',
    pattern: 'Stack — nesting is last-in-first-out',
    problemSlugs: ['valid-parentheses', 'next-greater-element'],
    inputLabel: 's = "{[()]}"',
    complexity: { time: 'O(n)', space: 'O(n)' },
    build: stackFrames,
  },
  {
    id: 'coin-change-dp',
    title: 'Coin Change',
    pattern: 'Bottom-up DP — build every answer from smaller ones',
    problemSlugs: ['coin-change', 'climbing-stairs', 'house-robber'],
    inputLabel: 'coins = [1, 3, 4], amount = 6',
    complexity: { time: 'O(amount × coins)', space: 'O(amount)' },
    build: coinChangeFrames,
  },
  {
    id: 'islands-floodfill',
    title: 'Number of Islands',
    pattern: 'Flood fill — connected components on a grid',
    problemSlugs: ['number-of-islands'],
    inputLabel: '4 × 5 grid of land and water',
    complexity: { time: 'O(rows × cols)', space: 'O(rows × cols)' },
    build: islandsFrames,
  },
];

export const demosForProblem = (slug: string): AlgorithmDemo[] =>
  DEMOS.filter((d) => d.problemSlugs.includes(slug));

export const demoById = (id: string): AlgorithmDemo | undefined => DEMOS.find((d) => d.id === id);
