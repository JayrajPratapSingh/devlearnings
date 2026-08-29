/**
 * Node.js Complete Course — Module 1: Node.js Fundamentals, lesson 5.
 *
 * Streams and buffers: how Node.js handles data that is too large to
 * comfortably hold in memory all at once — a large file upload, a big
 * CSV export, a multi-gigabyte log file — by processing it in small
 * chunks (each one a Buffer) as it arrives, rather than reading the
 * entire thing into memory before doing anything with it. Broken example:
 * reading a large file fully into memory with fs.readFileSync before
 * sending it in a response, or before processing it — this works fine
 * for a small file, but scales directly with file size and can exhaust
 * available memory or block the event loop entirely for a large one.
 * Fixed with fs.createReadStream and .pipe(), processing the file
 * incrementally, one chunk at a time, with Node.js automatically
 * handling backpressure so a slow destination cannot be overwhelmed by a
 * fast source.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_1_PART5: CourseLesson[] = [
  {
    slug: 'streams-and-buffers',
    title: 'Streams and Buffers: Handling Data Too Large to Hold in Memory',
    titleHi: 'Streams Aur Buffers: Memory Mein Rakhne Ke Liye Bahut Badi Data Sambhaalna',
    description: 'A route that reads an entire 2GB log file into memory before sending it to the browser works perfectly in every test with small sample files — and then crashes the whole server the first time a real customer requests the real, full-size file.',
    descriptionHi: 'Ek route jo poori 2GB log file ko browser ko bhejne se pehle memory mein padhta hai chhote sample files ke saath har test mein perfectly kaam karta hai — aur phir poore server ko crash kar deta hai jis pal koi asli customer asli, poore-size ki file ki request karta hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 5,

    analogy: {
      en: '**A librarian handing a reader an entire 50,000-page encyclopedia set, all at once, the moment they ask to read it — versus a librarian who hands over one page at a time, as the reader finishes each one, taking each finished page back before handing over the next.** If a reader asks to read a short, ten-page pamphlet, receiving all ten pages at once is completely reasonable — there\'s no meaningful difference in effort or desk space required either way. But if a reader asks to read a 50,000-page encyclopedia, physically handing over every single page at once, all at the same time, would require an impossibly large desk, and the reader could not possibly hold or process all of it simultaneously regardless — most of those pages would simply sit in an unusable pile while the reader works through them one at a time anyway. A librarian who instead hands over one page, waits for the reader to finish it, takes it back, and hands over the next, lets the reader work through the entire 50,000-page encyclopedia using only enough desk space for a single page at a time — the total amount of material processed is identical, but the resources required at any given moment stay small and constant, regardless of how enormous the full encyclopedia actually is. Reading an entire file into memory before doing anything with it (fs.readFileSync) is the first librarian: it works fine for a small pamphlet-sized file, and becomes physically impossible, or at least dangerously wasteful, for something the size of a real encyclopedia. A stream (fs.createReadStream) is the second librarian: it processes the exact same total amount of data, but only ever holds a small, manageable chunk of it in memory at any given instant, regardless of how large the complete file actually is.',
      hi: '**Ek librarian jo ek reader ko poora 50,000-page encyclopedia set, ek saath, sonpta hai jis pal wo ise padhne ko kehta hai — versus ek librarian jo ek waqt mein ek page deta hai, jaise reader har ek khatam karta hai, har khatam hui page wapas leta hai agli sonpne se pehle.** Agar ek reader ek chhota, das-page ka pamphlet padhne ko kehta hai, sabhi das pages ek saath paana poori tarah samajhdaari-bhara hai — kisi bhi tarike se mehanat ya desk space mein koi maayne-rakhta antar nahi hai. Par agar ek reader ek 50,000-page encyclopedia padhne ko kehta hai, har akeli page ko ek saath, bilkul usi waqt physically sonpna ek asambhav badi desk maangega, aur reader chahe kuch bhi ho ek saath sab kuch pakad ya process nahi kar sakta — zyaadatar wo pages bas ek na-istemal-laayak dher mein baithi rahegi jabki reader ek-ek karke unpar kaam karega. Ek librarian jo iske bajaye ek page deta hai, reader ke ise khatam karne ka intezaar karta hai, ise wapas leta hai, aur agli sonpta hai, reader ko poori 50,000-page encyclopedia ke through kaam karne deta hai sirf itni desk space istemal karte hue jitni ek waqt mein ek page ke liye kaafi ho — process ki gayi kul saamagri ki tadaad wahi hai, par kisi bhi diye pal chahi gayi resources chhoti aur sthir rehti hain, chahe poori encyclopedia asal mein kitni bhi vishaal ho. Kuch bhi karne se pehle poori file ko memory mein padhna (\`fs.readFileSync\`) pehla librarian hai: ye ek chhoti pamphlet-size ki file ke liye theek kaam karta hai, aur ek asli encyclopedia ke size ki kisi cheez ke liye physically asambhav, ya kam-se-kam khatarnaak roop se barbaad-karta, ban jaata hai. Ek stream (\`fs.createReadStream\`) doosra librarian hai: ye bilkul wahi kul tadaad data process karta hai, par kisi bhi diye pal memory mein sirf ek chhota, sambhaalne-laayak tukda hi kabhi rakhta hai, poori file asal mein kitni bhi badi ho.',
    },

    simple: `**Start broken.** Reading an entire file into memory before sending it:

\`\`\`js
app.get("/download/logs", (req, res) => {
  const data = fs.readFileSync("./server.log"); // reads the ENTIRE file into memory first
  res.send(data);
});
\`\`\`

With a small, few-kilobyte log file, this works instantly and looks completely fine in every test. The problem only appears once the real file this route serves in production grows to a realistic size — say, 2GB, entirely plausible for a server log that has been accumulating for months. \`fs.readFileSync\` does not send anything to the response until it has first read the ENTIRE 2GB file into a single \`Buffer\` sitting in the Node.js process\'s memory — this single request now needs 2GB of free memory just to begin responding, and while that read is happening synchronously, it blocks the entire event loop, meaning every other concurrent request to the server is frozen, unable to be processed at all, until this one file finishes reading. If several such requests happen to overlap, or if the file is even larger, the process can exhaust available memory entirely and crash — not gracefully failing this one request, but taking down every other in-flight request the server was handling at that moment too.

**The fix: stream the file in small chunks, piped directly to the response**

\`\`\`js
const fs = require("fs");

app.get("/download/logs", (req, res) => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res); // sends data as it's read, a chunk at a time
  stream.on("error", (err) => res.status(500).end());
});
\`\`\`

\`\`\`ts
import * as fs from "fs";

app.get("/download/logs", (req: Request, res: Response): void => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res);
  stream.on("error", (err: Error) => {
    res.status(500).end();
  });
});
\`\`\`

\`fs.createReadStream\` reads the file in small chunks — typically 64KB at a time by default — emitting each chunk as a \`Buffer\` as soon as it\'s available, rather than waiting for the whole file. \`.pipe(res)\` connects this stream of chunks directly to the HTTP response: as each chunk is read from disk, it is immediately written out to the client, and Node.js automatically pauses reading further chunks from disk if the client\'s connection can\'t keep up (backpressure), resuming once it catches up. At any given instant, only one small chunk of the 2GB file is ever actually held in memory — the total memory used by this route no longer scales with the size of the file being served at all, whether it\'s 2KB or 2GB, and the event loop is never blocked waiting for the entire file to be read before anything can happen.`,

    simpleHi: `**Toote hue se shuru.** Poori file ko memory mein padhna ise bhejne se pehle:

\`\`\`js
app.get("/download/logs", (req, res) => {
  const data = fs.readFileSync("./server.log"); // POORI file ko pehle memory mein padhta hai
  res.send(data);
});
\`\`\`

Ek chhoti, kuch kilobytes wali log file ke saath, ye turant kaam karta hai aur har test mein poori tarah theek dikhta hai. Samasya sirf tab dikhti hai jab asli file jise ye route production mein serve karta hai ek asli size tak badhti hai — maano, 2GB, ek server log ke liye poori tarah sambhaavya jo mahinon se jama ho raha hai. \`fs.readFileSync\` response ko kuch bhi bhejta hi nahi jab tak ye pehle POORI 2GB file ko ek akele \`Buffer\` mein na padh le jo Node.js process ki memory mein baitha hai — is akeli request ko ab jawaab dena shuru karne ke liye 2GB khaali memory chahiye, aur jab tak wo padhna synchronously ho raha hai, ye poore event loop ko block karta hai, matlab server ki har doosri concurrent request jam jaati hai, bilkul process nahi ki jaa sakti, jab tak ye ek file poori na padh le. Agar aisi kai requests ek doosre se overlap ho jaayein, ya agar file aur bhi badi ho, process poori tarah upalabdh memory khatam kar sakta hai aur crash ho sakta hai — is ek request ko saaf taur par fail hone ke bajaye, us pal server ki handle kar rahi har doosri in-flight request ko bhi apne saath le jaate hue.

**Fix: file ko chhote tukdon mein stream karo, seedhe response ko pipe kiya hua**

\`\`\`js
const fs = require("fs");

app.get("/download/logs", (req, res) => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res); // data ko waise bhejta hai jaise padha jaata hai, ek tukda ek waqt
  stream.on("error", (err) => res.status(500).end());
});
\`\`\`

\`\`\`ts
import * as fs from "fs";

app.get("/download/logs", (req: Request, res: Response): void => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res);
  stream.on("error", (err: Error) => {
    res.status(500).end();
  });
});
\`\`\`

\`fs.createReadStream\` file ko chhote tukdon mein padhta hai — aam taur par by default ek waqt mein 64KB — har tukde ko ek \`Buffer\` ki tarah emit karte hue jaise hi ye upalabdh hota hai, poori file ka intezaar karne ke bajaye. \`.pipe(res)\` in tukdon ki stream ko seedhe HTTP response se jodta hai: jaise-jaise har tukda disk se padha jaata hai, ye turant client ko likh diya jaata hai, aur Node.js automatically disk se aur tukde padhna rok deta hai agar client ka connection saath na de paaye (backpressure), catch up karne ke baad dobara shuru karte hue. Kisi bhi diye pal, 2GB file ka sirf ek chhota tukda hi kabhi asal mein memory mein rakha jaata hai — is route dwara istemal ki gayi kul memory ab serve ki jaa rahi file ke size se bilkul bekhabar hai, chahe ye 2KB ho ya 2GB, aur event loop kabhi kuch hone se pehle poori file padhe jaane ka intezaar karte hue block nahi hota.`,

    content: `## Buffers: how Node.js represents raw binary data

\`\`\`js
const buf = Buffer.from("hello");
console.log(buf);           // <Buffer 68 65 6c 6c 6f> — raw bytes, not text
console.log(buf.toString()); // "hello" — decoded back to a string
console.log(buf.length);     // 5 — the number of bytes, not characters
\`\`\`

A \`Buffer\` is Node.js\'s representation of a fixed-length chunk of raw binary data — bytes, not text — and it is the underlying data type every stream emits as it reads chunks of a file, a network socket, or any other binary source. This matters because not all data is text: an image, a video, a compressed file, or a network packet is fundamentally binary, and a \`Buffer\` represents it faithfully without assuming any particular text encoding. When a \`Buffer\` does hold text data, \`.toString()\` decodes it into a JavaScript string using a specified encoding (UTF-8 by default) — but the \`Buffer\` itself, and the stream chunks made of them, remain encoding-agnostic raw bytes until something explicitly decodes them.

## Streams: four kinds, one shared idea — data in motion, not data at rest

\`\`\`
Readable stream: a source of data, emitted in chunks (fs.createReadStream,
                 an incoming HTTP request body)
Writable stream: a destination for data, accepting chunks (fs.createWriteStream,
                 an outgoing HTTP response)
Duplex stream:   both readable and writable (a TCP socket)
Transform stream: readable AND writable, transforming data as it passes
                 through (zlib.createGzip, a compression stream)
\`\`\`

The shared idea across all four kinds of stream is processing data incrementally, as a sequence of chunks arriving over time, rather than requiring the entire dataset to exist in memory at once before anything can happen. A \`Readable\` stream (like \`fs.createReadStream\`) is a source that emits chunks; a \`Writable\` stream (like \`fs.createWriteStream\`, or an HTTP response object) is a destination that accepts chunks; a \`Duplex\` stream is simultaneously both, like a TCP socket that can be read from and written to independently; and a \`Transform\` stream sits in between, receiving chunks, transforming them somehow, and passing the transformed chunks onward — \`zlib.createGzip()\`, used to compress data on the fly as it streams through, is a common example.

## .pipe() and backpressure: connecting streams without overwhelming the destination

\`\`\`js
fs.createReadStream("large-file.csv")
  .pipe(zlib.createGzip())      // transform: compress each chunk as it passes through
  .pipe(fs.createWriteStream("large-file.csv.gz")); // writable: write compressed chunks to disk
\`\`\`

\`.pipe()\` connects a readable stream\'s output directly to a writable stream\'s input, automatically forwarding each chunk as it becomes available — and streams can be chained together, as shown here, sending data through a transform stream on its way from a source to a destination. Critically, \`.pipe()\` also automatically manages backpressure: if the destination (a slow network connection, a slow disk) cannot accept data as fast as the source is producing it, \`.pipe()\` pauses the source from reading further chunks until the destination catches up, then resumes — without this, a fast source could keep producing chunks faster than a slow destination can consume them, causing those chunks to pile up unboundedly in memory while waiting to be written, which is exactly the kind of unbounded memory growth streaming is meant to avoid in the first place.

## When NOT to stream: small, known-size data doesn't need it

\`\`\`js
// A small JSON config file, read once at startup — readFileSync is fine here
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

// A 2GB log file served on demand — this genuinely needs streaming
fs.createReadStream("./server.log").pipe(res);
\`\`\`

Streaming exists specifically to solve the problem of data too large, or too unpredictable in size, to comfortably hold in memory all at once — it is not automatically the "more correct" choice for every single case involving files or data transfer. A small, known-size file read once at application startup (a configuration file, a small JSON fixture) gains nothing meaningful from being streamed, and the simplicity of \`fs.readFileSync\` is entirely appropriate there, following the same principle this course has applied elsewhere: match the tool to the actual scale of the problem, rather than reaching for the more complex mechanism by default regardless of whether the data involved could ever realistically be large enough to need it.`,

    contentHi: `## Buffers: Node.js raw binary data ko kaise darsata hai

\`\`\`js
const buf = Buffer.from("hello");
console.log(buf);           // <Buffer 68 65 6c 6c 6f> — raw bytes, text nahi
console.log(buf.toString()); // "hello" — wapas ek string mein decode kiya gaya
console.log(buf.length);     // 5 — bytes ki tadaad, characters ki nahi
\`\`\`

Ek \`Buffer\` Node.js ka ek fixed-length raw binary data ke tukde ka pratinidhitva hai — bytes, text nahi — aur ye wo underlying data type hai jise har stream emit karta hai jab ye ek file, ek network socket, ya kisi doosre binary source ke tukde padhta hai. Ye maayne rakhta hai kyunki sab data text nahi hai: ek image, ek video, ek compressed file, ya ek network packet buniyaadi taur par binary hai, aur ek \`Buffer\` ise kisi khaas text encoding maane bina saccha darsata hai. Jab ek \`Buffer\` text data rakhta hai, \`.toString()\` ise ek specified encoding (default se UTF-8) istemal karke ek JavaScript string mein decode karta hai — par \`Buffer\` khud, aur unse bane stream chunks, encoding-agnostic raw bytes rehte hain jab tak kuch unhe explicitly decode na kare.

## Streams: chaar tarah, ek shared dhaarna — data gati mein, aaram mein data nahi

\`\`\`
Readable stream: data ka ek source, tukdon mein emit hua (fs.createReadStream,
                 ek aati HTTP request body)
Writable stream: data ke liye ek destination, tukde sweekaarta hai (fs.createWriteStream,
                 ek jaati HTTP response)
Duplex stream:   dono readable aur writable (ek TCP socket)
Transform stream: readable AUR writable, data ko badalte hue jab ye guzarta hai
                 (zlib.createGzip, ek compression stream)
\`\`\`

Stream ki sabhi chaar taraah ke saath saanjha dhaarna data ko badhte hue process karna hai, waqt ke saath aati chunks ki ek sequence ki tarah, poore dataset ke kuch hone se pehle memory mein maujood hone ki maang karne ke bajaye. Ek \`Readable\` stream (jaise \`fs.createReadStream\`) ek source hai jo tukde emit karta hai; ek \`Writable\` stream (jaise \`fs.createWriteStream\`, ya ek HTTP response object) ek destination hai jo tukde sweekaarta hai; ek \`Duplex\` stream ek saath dono hai, jaise ek TCP socket jise alag se padha aur likha jaa sakta hai; aur ek \`Transform\` stream beech mein baithta hai, tukde paata hai, unhe kisi tarah badalta hai, aur badle hue tukdon ko aage bhejta hai — \`zlib.createGzip()\`, jo data ko compress karne ke liye istemal hota hai jab ye stream se guzarta hai, ek aam misal hai.

## \`.pipe()\` aur backpressure: destination ko overwhelm kiye bina streams jodna

\`\`\`js
fs.createReadStream("large-file.csv")
  .pipe(zlib.createGzip())      // transform: guzarti har chunk ko compress karo
  .pipe(fs.createWriteStream("large-file.csv.gz")); // writable: compressed chunks disk par likho
\`\`\`

\`.pipe()\` ek readable stream ke output ko seedhe ek writable stream ke input se jodta hai, automatically har chunk ko forward karte hue jaise ye upalabdh hoti hai — aur streams ek doosre se chain ki jaa sakti hain, jaisa yahaan dikhaaya gaya, data ko ek source se ek destination tak apne raaste mein ek transform stream se guzaarte hue. Bahut zaruri, \`.pipe()\` backpressure ko bhi automatically manage karta hai: agar destination (ek dheema network connection, ek dheema disk) source ke paida karne jitni tezi se data accept nahi kar sakta, \`.pipe()\` source ko aur tukde padhne se rokta hai jab tak destination catch up na kare, phir resume karta hai — iske bina, ek tez source destination ke consume karne se tez tukde paida karta rehta, jo unhe likhe jaane ka intezaar karte hue memory mein bina-seemaa jama karwaata, jo bilkul wahi tarah ki bina-seemaa memory growth hai jise streaming pehli jagah avoid karne ke liye hai.

## Kab STREAM NAHI karna hai: chhoti, jaani-pehchaani-size ki data ko iski zaroorat nahi

\`\`\`js
// Ek chhoti JSON config file, startup par ek baar padhi gayi — readFileSync yahaan theek hai
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

// Ek 2GB log file jo maang par serve hoti hai — ise sach mein streaming chahiye
fs.createReadStream("./server.log").pipe(res);
\`\`\`

Streaming khaas taur par us samasya ko sulajhaane ke liye maujood hai jo data ek saath memory mein aaraam se rakhne ke liye bahut badi, ya size mein bahut anumaanit-na-hone-laayak hai — ye har akele case ke liye automatically zyaada "sahi" chunaav nahi hai jismein files ya data transfer shaamil hain. Ek chhoti, jaani-pehchaani-size ki file jo application startup par ek baar padhi jaati hai (ek configuration file, ek chhoti JSON fixture) stream ki jaane se kuch bhi maayne-rakhta nahi paati, aur \`fs.readFileSync\` ki saadgi wahaan poori tarah upyukt hai, is course ne kahin aur lagu kiya wahi siddhaant palan karte hue: tool ko samasya ke asli scale se milaao, by default zyaada complex mechanism ki taraf pahunchne ke bajaye chahe shaamil data kabhi bhi asal mein utni badi ho sakti hai jitni iski zaroorat ho.`,

    examples: [
      {
        title: 'Broken: reading an entire large file into memory before responding',
        titleHi: 'Toota: response se pehle poori badi file ko memory mein padhna',
        code: `app.get("/download/logs", (req, res) => {
  const data = fs.readFileSync("./server.log"); // blocks until the WHOLE file is read
  res.send(data);
});`,
        codeJs: `const fs = require("fs");

app.get("/download/logs", (req, res) => {
  const data = fs.readFileSync("./server.log");
  res.send(data);
});
// fine for a small file; a 2GB file needs 2GB of memory just to start responding`,
        codeTs: `import * as fs from "fs";

app.get("/download/logs", (req: Request, res: Response): void => {
  const data: Buffer = fs.readFileSync("./server.log");
  res.send(data);
});
// Correctly typed, completely valid TypeScript — the risk is entirely
// about memory usage scaling with file size, not a type error.`,
        output: `Works instantly for a small test file. For the real, multi-gigabyte
production file, this single request can exhaust available memory
and block the event loop for every other concurrent request.`,
        explain: 'fs.readFileSync loads the entire file into one Buffer before returning anything — memory usage and blocking time both scale directly with the file\'s total size.',
        explainHi: '\`fs.readFileSync\` kuch bhi lautaane se pehle poori file ko ek \`Buffer\` mein load karta hai — memory istemal aur blocking waqt dono seedhe file ke kul size ke saath scale karte hain.',
      },
      {
        title: 'Fixed: streaming the file in small chunks via .pipe()',
        titleHi: 'Theek: \`.pipe()\` ke zariye file ko chhote tukdon mein stream karna',
        code: `app.get("/download/logs", (req, res) => {
  fs.createReadStream("./server.log").pipe(res);
});`,
        codeJs: `const fs = require("fs");

app.get("/download/logs", (req, res) => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res);
  stream.on("error", (err) => {
    console.error(err);
    res.status(500).end();
  });
});`,
        codeTs: `import * as fs from "fs";

app.get("/download/logs", (req: Request, res: Response): void => {
  const stream = fs.createReadStream("./server.log");
  stream.pipe(res);
  stream.on("error", (err: Error) => {
    console.error(err);
    res.status(500).end();
  });
});`,
        outputJs: `The response begins immediately with the first chunk, rather than
waiting for the whole file. Memory usage stays small and constant
regardless of whether the file is 2KB or 2GB.`,
        outputTs: `// Identical behaviour. The "error" listener is essential — an error
// partway through reading the file (e.g. it's deleted mid-stream)
// would otherwise go unhandled.`,
        explain: 'Only one small chunk is ever held in memory at a time, and .pipe() forwards each chunk to the response as soon as it\'s read, without waiting for the whole file.',
        explainHi: 'Kisi bhi waqt sirf ek chhota tukda hi memory mein rakha jaata hai, aur \`.pipe()\` har tukde ko response ko forward karta hai jaise hi ye padha jaata hai, poori file ka intezaar kiye bina.',
      },
      {
        title: 'Chaining streams: compressing a file on the fly with a Transform stream',
        titleHi: 'Streams ko chain karna: ek Transform stream se file ko turant compress karna',
        code: `fs.createReadStream("large.csv")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("large.csv.gz"));`,
        codeJs: `const fs = require("fs");
const zlib = require("zlib");

function compressFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(inputPath)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(outputPath));
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}`,
        codeTs: `import * as fs from "fs";
import * as zlib from "zlib";

function compressFile(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(inputPath)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(outputPath));
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}`,
        outputJs: `A multi-gigabyte CSV is read, compressed, and written to disk as a
.gz file, one small chunk at a time, without ever holding the full
uncompressed or compressed file in memory at once.`,
        outputTs: `// Identical behaviour, wrapped in a typed Promise so calling code
// can await the entire pipeline completing (or catch a failure)
// using ordinary async/await.`,
        explain: 'Each chunk flows through the Gzip transform stream on its way from the read stream to the write stream — compression happens incrementally, not as one giant operation on the whole file.',
        explainHi: 'Har tukda read stream se write stream tak apne raaste mein Gzip transform stream se guzarta hai — compression badhte hue hota hai, poori file par ek vishaal operation ki tarah nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `const data = fs.readFileSync(largeFilePath); // reads the whole file into memory
res.send(data);`,
        right: `fs.createReadStream(largeFilePath).pipe(res); // streams it in small chunks`,
        why: 'Reading an entire large file into memory before responding scales memory usage and blocking time directly with file size, risking an out-of-memory crash or a frozen event loop for a genuinely large file.',
        whyHi: 'Response se pehle poori badi file ko memory mein padhna memory istemal aur blocking waqt ko seedhe file size ke saath scale karta hai, ek sach mein badi file ke liye out-of-memory crash ya ek jaam hue event loop ka khatra uthaate hue.',
      },
      {
        wrong: `fs.createReadStream(path).pipe(res);
// no "error" listener — a mid-stream failure (file deleted, disk error) goes unhandled`,
        right: `const stream = fs.createReadStream(path);
stream.pipe(res);
stream.on("error", (err) => res.status(500).end());`,
        why: 'A stream can fail partway through (the file is deleted, a disk error occurs) — without an explicit "error" listener, that failure is unhandled and can crash the process.',
        whyHi: 'Ek stream beech mein fail ho sakta hai (file delete ho jaaye, ek disk error ho) — ek explicit "error" listener bina, wo failure bina-sambhaale rehti hai aur process crash kar sakti hai.',
      },
      {
        wrong: `const config = fs.createReadStream("./config.json"); // streaming a tiny startup config file
// unnecessary complexity for a small, known-size file read once`,
        right: `const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
// simple and appropriate for a small file that's never going to be gigabytes`,
        why: 'Streaming exists to solve the problem of data too large to comfortably hold in memory — reaching for it by default even for small, fixed-size files adds unnecessary complexity with no real benefit.',
        whyHi: 'Streaming us samasya ko sulajhaane ke liye maujood hai jo data aaraam se memory mein rakhne ke liye bahut badi hai — by default ise chhoti, tay-shuda-size ki files ke liye bhi istemal karna koi asli fayde bina bekaar complexity jodta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Node.js\'s own built-in HTTP server, file system module, and zlib compression module all expose their core functionality through the exact same stream interface**, making streams one of the most fundamental, load-bearing abstractions in the entire Node.js platform.',
        hi: '**Node.js ka apna built-in HTTP server, file system module, aur zlib compression module sab apni mukhya functionality ko bilkul usi stream interface ke zariye expose karte hain**, streams ko poore Node.js platform mein sabse buniyaadi, bhaar-uthaati abstractions mein se ek banaate hue.',
      },
      {
        en: '**Streaming large file uploads and downloads directly, without buffering the entire file in memory, is a widely recommended standard practice** for any production service handling files of unpredictable or potentially large size.',
        hi: '**Bade file uploads aur downloads ko seedhe stream karna, poori file ko memory mein buffer kiye bina, ek vyaapak roop se recommend ki jaane waali standard practice hai** kisi bhi production service ke liye jo anumaanit-na-hone-laayak ya sambhaavit roop se badi size ki files sambhaalti hai.',
      },
      {
        en: '**Video streaming platforms, log-processing pipelines, and data-export tools at real scale are all built fundamentally around streams** specifically because the data volumes involved would be entirely impractical to hold in memory all at once.',
        hi: '**Video streaming platforms, log-processing pipelines, aur asli scale ke data-export tools sab buniyaadi taur par streams ke aas-paas bane hain** khaas taur par isliye kyunki shaamil data volumes ek saath memory mein rakhne ke liye poori tarah avyavhaarik honge.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does fs.readFileSync become dangerous specifically as file size grows, when it works perfectly fine for small files?',
        qHi: '\`fs.readFileSync\` khaas taur par file size badhne par khatarnaak kyun ban jaata hai, jab ye chhoti files ke liye poori tarah theek kaam karta hai?',
        a: 'fs.readFileSync is a synchronous operation that reads a file\'s entire contents into a single Buffer object held in the Node.js process\'s memory, and does not return control back to the calling code until that entire read has completed. For a small file — a few kilobytes, even a few megabytes — this is essentially instantaneous and the memory required is negligible, so the fact that it reads everything at once causes no practical problem whatsoever. The danger emerges specifically as the file\'s size grows into the range of hundreds of megabytes or gigabytes, because two separate costs both scale directly and linearly with that size: first, the memory required to hold the entire file\'s contents in a single Buffer grows to match the file\'s size exactly, meaning a 2GB file genuinely requires roughly 2GB of available memory just to complete this one read, memory that is entirely unavailable to any other concurrent request or operation the same process might need to handle simultaneously; second, because this is a SYNCHRONOUS operation, the single-threaded Node.js event loop is completely blocked for the entire duration of the read, unable to process any other incoming request, timer, or I/O completion until the read finishes, meaning every other client connected to the server experiences a complete, unexplained freeze for however long that read takes. A codebase that only ever tests with small sample files may never observe either problem during development, since both costs are proportional to file size and small files simply never approach the point where they become noticeable — the danger is entirely latent until a real, large file is actually encountered in production.',
        aHi: '\`fs.readFileSync\` ek synchronous operation hai jo ek file ki poori contents ko ek akele \`Buffer\` object mein padhta hai jo Node.js process ki memory mein rakha jaata hai, aur calling code ko control tab tak wapas nahi karta jab tak wo poora padhna poora na ho jaaye. Ek chhoti file ke liye — kuch kilobytes, kuch megabytes bhi — ye asar mein turant hai aur zaroori memory mamuli hai, isliye ye tathya ki ye ek saath sab kuch padhta hai koi vyavhaarik samasya bilkul cause nahi karta. Khatra khaas taur par tab zaahir hota hai jab file ka size sainkadon megabytes ya gigabytes ki range mein badhta hai, kyunki do alag keematen dono seedhe aur linearly us size ke saath scale karti hain: pehla, poori file ki contents ko ek akele \`Buffer\` mein rakhne ke liye zaroori memory file ke size se bilkul milkar badhti hai, matlab ek 2GB file ko is ek padhne ko poora karne ke liye sach mein lagbhag 2GB upalabdh memory chahiye, memory jo kisi bhi doosri concurrent request ya operation ke liye bilkul na-upalabdh hai jise wahi process ek saath sambhaalna chaahiye ho; doosra, kyunki ye ek SYNCHRONOUS operation hai, akele-thread wala Node.js event loop poori padhne ki avdhi ke liye poori tarah block ho jaata hai, koi bhi aati request, timer, ya I/O poora hona process karne mein asamarth jab tak padhna poora na ho, matlab server se jude har doosre client ko ek poora, na-samjhaaya gaya freeze anubhav hota hai chahe wo padhna kitna bhi waqt le. Ek codebase jo sirf chhote sample files se test karta hai shaayad development ke dauraan inmein se koi bhi samasya kabhi na dekhe, kyunki dono keematen file size ke anupaat mein hain aur chhoti files bas kabhi us point ke kareeb nahi pahunchti jahan wo dhyaan-dene-laayak ban jaayein — khatra poori tarah latent hai jab tak ek asli, badi file production mein asal mein na mile.',
      },
      {
        q: 'What is "backpressure" in the context of Node.js streams, and why does .pipe() handling it automatically matter?',
        qHi: 'Node.js streams ke context mein "backpressure" kya hai, aur \`.pipe()\` ka ise automatically handle karna kyun maayne rakhta hai?',
        a: 'Backpressure refers to the situation where a source of data (a readable stream) is capable of producing data chunks faster than a destination (a writable stream) is capable of consuming them — for instance, reading from a very fast local disk while writing over a comparatively slow network connection, or writing to a disk that is itself temporarily under heavy load from other processes. Without any mechanism to address this mismatch, a naive approach to moving data from the fast source to the slow destination would simply keep reading chunks from the source as quickly as it can produce them, accumulating an ever-growing queue of chunks waiting to be written to the destination, since the destination cannot keep pace — and because this accumulating queue lives in the process\'s memory, its size grows without any natural bound, defeating the entire purpose of streaming in the first place, which was to keep memory usage small and constant regardless of the total data volume involved. Node.js\'s stream implementation, and .pipe() specifically, address this by actively monitoring the writable destination\'s internal buffer: when that buffer fills up to a configured threshold, indicating the destination cannot currently accept more data quickly enough, .pipe() automatically pauses the readable source from producing further chunks, and only resumes reading once the destination has drained enough of its buffer to signal it can accept more. This means the maximum amount of data that can ever be waiting in memory at once is bounded by that buffer threshold, regardless of how large a mismatch exists between the source\'s and destination\'s respective speeds, or how large the total file or data stream being processed actually is — backpressure handling is precisely what allows streaming to deliver its core promise of small, constant memory usage even when a fast source is paired with a genuinely slow destination.',
        aHi: 'Backpressure us sthiti ko darsata hai jahan data ka ek source (ek readable stream) data chunks paida karne mein ek destination (ek writable stream) ke unhe consume karne se zyaada tez hone ki kshamta rakhta hai — misal ke taur par, ek bahut tez local disk se padhna jabki ek tulnaatmak roop se dheeme network connection par likhna, ya ek disk par likhna jo khud asthaayi taur par doosre processes se bhaari load ke neeche hai. Is mismatch ko sambodhit karne ke liye koi mechanism bina, tez source se dheeme destination tak data le jaane ka ek saadha tarika bas source se chunks utni jaldi padhta rehta jitni jaldi ye unhe paida kar sakta hai, destination ko likhe jaane ka intezaar kar rahi chunks ki ek hamesha-badhti queue jama karte hue, kyunki destination raftaar nahi rakh sakta — aur kyunki ye jama hoti queue process ki memory mein rehti hai, iska size kisi bhi prakritik seemaa bina badhta hai, streaming ka poora maqsad hi haar dete hue jo shuru mein memory istemal ko chhota aur sthir rakhna tha chahe shaamil kul data volume kuch bhi ho. Node.js ka stream implementation, aur \`.pipe()\` khaas taur par, ise writable destination ke internal buffer ko saqriya taur par monitor karke sambodhit karte hain: jab wo buffer ek configure ki gayi threshold tak bhar jaata hai, darsate hue ki destination abhi kaafi jaldi zyaada data accept nahi kar sakta, \`.pipe()\` automatically readable source ko aur tukde paida karne se rokta hai, aur sirf tab dobara padhna shuru karta hai jab destination ne apne buffer ka kaafi hissa khaali kar diya ho ye sanket dete hue ki ye zyaada accept kar sakta hai. Iska matlab hai kisi bhi waqt memory mein intezaar kar sakti data ki adhiktam tadaad us buffer threshold se seemit hai, chahe source aur destination ki apni-apni gati ke beech kitna bhi mismatch ho, ya process ki jaa rahi kul file ya data stream asal mein kitni bhi badi ho — backpressure handling bilkul wahi hai jo streaming ko apna mool vaada poora karne deta hai chhote, sthir memory istemal ka chahe ek tez source ek sach mein dheeme destination ke saath joda gaya ho.',
      },
      {
        q: 'How should a developer decide whether a given piece of code should use fs.readFileSync or a stream, rather than always defaulting to one or the other?',
        qHi: 'Ek developer ko kaise faisla karna chahiye ki code ka ek diya tukda \`fs.readFileSync\` ya ek stream istemal kare, hamesha ek ya doosre ko default karne ke bajaye?',
        a: 'The genuine deciding factor is the actual, realistic size of the data involved, and how confident the developer can be that this size will remain small over the lifetime of the application, not a blanket rule that one approach is universally superior to the other. fs.readFileSync (and its asynchronous counterpart, fs.readFile) is entirely appropriate, and in fact simpler and more directly readable, for data that is genuinely small and bounded in size — a configuration file, a small fixture used in a test, a template file read once at application startup — where the total size will realistically never grow large enough for memory usage or blocking time to become a practical concern, regardless of how the application scales otherwise. Streaming becomes necessary specifically once the data involved is either already large, or has no fixed, predictable upper bound on its size — a file being uploaded by a user (which could be small or could be several gigabytes depending entirely on what that particular user chooses to upload), a log file that grows continuously over the lifetime of a running server, a database export whose size depends on how much data currently exists, or any data being proxied or relayed through the server rather than originating from a small, fixed source the application controls. The practical test a developer can apply is asking: is there a plausible, realistic scenario in which this specific piece of data grows large enough that reading it entirely into memory at once would meaningfully harm the application\'s memory usage or responsiveness? If the honest answer is no, because the data\'s size is small and genuinely bounded, the simplicity of reading it directly is the right choice; if the honest answer is yes, or if the size is fundamentally unpredictable and outside the application\'s control, streaming is the approach that remains safe regardless of how large the actual data turns out to be in any specific instance.',
        aHi: 'Asli faisla karne waala factor shaamil data ka asli, wastavik size hai, aur developer kitna bhrosemand ho sakta hai ki ye size application ki umr ke dauraan chhota rahega, ek blanket rule ke bajaye ki ek tarika doosre se sarvavyaapi roop se behtar hai. \`fs.readFileSync\` (aur uska asynchronous samkakshi, \`fs.readFile\`) poori tarah upyukt hai, aur asal mein saadha aur zyaada seedhe padhne-laayak hai, us data ke liye jo sach mein chhota aur size mein seemit hai — ek configuration file, ek test mein istemal hoti ek chhoti fixture, ek template file jo application startup par ek baar padhi jaati hai — jahan kul size wastavik roop se kabhi itni badi nahi hogi ki memory istemal ya blocking waqt ek vyavhaarik chinta ban jaaye, chahe application aur kaise scale kare. Streaming khaas taur par zaruri ban jaati hai jab shaamil data ya to pehle se badi hai, ya iski size ki koi tay, anumaanit adhiktam seemaa nahi hai — ek user dwara upload ki jaa rahi file (jo chhoti ho sakti hai ya us khaas user ne kya upload karne ka chunaav kiya us par poori tarah nirbhar kai gigabytes ho sakti hai), ek log file jo chalti server ki umr ke dauraan lagaataar badhti hai, ek database export jiska size is baat par nirbhar hai ki abhi kitna data maujood hai, ya koi bhi data jo server ke through proxy ya relay kiya jaa raha hai ek chhote, tay source se aane ke bajaye jise application niyantrit karta hai. Vyavhaarik test jo ek developer lagu kar sakta hai ye poochna hai: kya koi vaastavik, wastavik scenario hai jismein ye khaas data itna bada ho jaata hai ki ise poori tarah ek saath memory mein padhna application ke memory istemal ya responsiveness ko maayne-rakhta nuksaan pahunchaayega? Agar imaandaar jawaab nahi hai, kyunki data ka size chhota aur sach mein seemit hai, ise seedhe padhne ki saadgi sahi chunaav hai; agar imaandaar jawaab haan hai, ya agar size buniyaadi taur par anumaanit-na-hone-laayak hai aur application ke niyantran se baahar hai, streaming wo tarika hai jo surakshit rehta hai chahe asli data kisi bhi khaas maamle mein kitna bhi bada nikle.',
      },
    ],

    exercises: [
      {
        task: 'Create a large test file (several hundred MB, e.g. via a script that writes repeated lines) and write a route using fs.readFileSync to serve it. Observe memory usage while the request is in flight using process.memoryUsage() or a system monitor.',
        taskHi: 'Ek badi test file banaao (kai sau MB, jaise ek script se jo baar-baar lines likhta hai) aur \`fs.readFileSync\` istemal karke use serve karne wala ek route likho. Request in-flight hote waqt \`process.memoryUsage()\` ya ek system monitor istemal karke memory istemal dekho.',
        hint: 'A simple loop writing the same line to a file thousands of times via fs.appendFileSync is an easy way to generate a large test file quickly.',
        hintHi: 'Ek saadha loop jo \`fs.appendFileSync\` ke zariye ek file mein wahi line hazaaron baar likhta hai ek badi test file jaldi generate karne ka ek aasaan tarika hai.',
      },
      {
        task: 'Rewrite the same route using fs.createReadStream().pipe(res), and compare memory usage for the same large file. Confirm memory stays roughly constant regardless of file size.',
        taskHi: 'Usi route ko \`fs.createReadStream().pipe(res)\` istemal karke dobara likho, aur usi badi file ke liye memory istemal compare karo. Confirm karo ki memory lagbhag sthir rehti hai file size se bekhabar.',
        hint: 'Try doubling the test file\'s size and confirm the streamed version\'s memory usage barely changes, while the readFileSync version\'s memory usage roughly doubles.',
        hintHi: 'Test file ka size double karne ki koshish karo aur confirm karo ki streamed version ka memory istemal mushkil se badalta hai, jabki \`readFileSync\` version ka memory istemal lagbhag double hota hai.',
      },
      {
        task: 'Build a small script that reads a text file, pipes it through zlib.createGzip(), and writes the compressed output to a new file, following this lesson\'s chained-streams example. Confirm the output file is a valid, smaller .gz file.',
        taskHi: 'Ek chhota script banaao jo ek text file padhta hai, ise \`zlib.createGzip()\` se pipe karta hai, aur compressed output ko ek nayi file mein likhta hai, is lesson ke chained-streams example ka palan karte hue. Confirm karo ki output file ek vaidh, chhoti \`.gz\` file hai.',
        hint: 'You can verify the output is valid by decompressing it back (via gunzip or zlib.createGunzip()) and confirming the contents match the original file exactly.',
        hintHi: 'Tum output ko vaidh verify kar sakte ho ise wapas decompress karke (\`gunzip\` ya \`zlib.createGunzip()\` ke zariye) aur confirm karke ki contents asli file se bilkul match karti hain.',
      },
    ],

    keyTakeaways: [
      'A Buffer is Node.js\'s representation of raw binary data — the underlying type every stream emits as it processes chunks of a file, network socket, or other binary source.',
      'fs.readFileSync loads an entire file into memory before returning anything, and blocks the event loop for the whole read — both memory usage and blocking time scale directly with file size.',
      'A stream processes data incrementally, in small chunks, keeping memory usage small and constant regardless of the total data size — this is the entire point of streaming.',
      '.pipe() connects streams together and automatically handles backpressure, pausing a fast source when a slow destination can\'t keep up, preventing unbounded memory growth from accumulating chunks.',
      'Streams can be chained through Transform streams (like zlib.createGzip()) to process data incrementally on its way from a source to a destination, without ever holding the full dataset in memory.',
      'Streaming is not automatically the "better" choice for every case — small, genuinely bounded-size data (a config file read once at startup) is simpler and entirely appropriate to read directly.',
    ],
    keyTakeawaysHi: [
      'Ek \`Buffer\` Node.js ka raw binary data ka pratinidhitva hai — underlying type jise har stream emit karta hai jab ye ek file, network socket, ya doosre binary source ke tukde process karta hai.',
      '\`fs.readFileSync\` kuch bhi lautaane se pehle poori file ko memory mein load karta hai, aur poore padhne ke liye event loop ko block karta hai — memory istemal aur blocking waqt dono seedhe file size ke saath scale karte hain.',
      'Ek stream data ko badhte hue, chhote tukdon mein process karta hai, memory istemal ko chhota aur sthir rakhte hue kul data size se bekhabar — ye streaming ka poora maqsad hai.',
      '\`.pipe()\` streams ko saath jodta hai aur automatically backpressure handle karta hai, ek tez source ko rokte hue jab ek dheema destination saath na de paaye, jama hoti chunks se bina-seemaa memory growth ko rokte hue.',
      'Streams ko Transform streams (jaise \`zlib.createGzip()\`) ke through chain kiya jaa sakta hai data ko badhte hue process karne ke liye ek source se ek destination tak apne raaste mein, poora dataset kabhi memory mein rakhe bina.',
      'Streaming automatically har case ke liye "behtar" chunaav nahi hai — chhoti, sach mein seemit-size ki data (startup par ek baar padhi gayi ek config file) seedhe padhne ke liye saadha aur poori tarah upyukt hai.',
    ],
  },
];
