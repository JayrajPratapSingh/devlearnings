import type { SimpleExplanation } from './topics-simple';

/** Beginner layer for WebSockets and Socket.IO. */
export const SIMPLE_REALTIME: Record<string, SimpleExplanation> = {
  'ws-why-not-http': {
    simple: `**Letters vs a phone call.**

Normal HTTP is like sending letters. You write, they reply. But **they can never write to you first** — you only ever get a reply to something you asked.

So how does WhatsApp show a message the moment it arrives?

Three ways people solve this:

- **Polling** — ask every 3 seconds "anything new?". Works, but it is like calling the shop every 3 seconds to ask if your parcel arrived. Mostly the answer is no.
- **SSE** — you keep one line open and the shop calls **you** when something happens. One-way: they talk, you listen.
- **WebSocket** — a **proper phone call**. Line stays open, **both** can talk any time.

**Choosing:**
- Only need to hear updates? → SSE, simpler
- Both sides talk a lot (chat, games)? → WebSocket
- Update every 30 seconds is fine? → just poll, honestly

**Remember:** HTTP = letters, WebSocket = phone call.`,
    simpleHi: `**Chitthi vs phone call.**

Normal HTTP chitthi bhejne jaisa hai. Aap likhte ho, wo jawab dete hain. Par **wo aapko pehle kabhi likh hi nahi sakte** — aapko sirf apne poochhe ka jawab milta hai.

To WhatsApp message aate hi kaise dikha deta hai?

Log teen tareekon se ye solve karte hain:

- **Polling** — har 3 second poochho "kuch naya hai?". Chalta hai, par ye dukaan ko har 3 second phone karke poochhne jaisa hai ki parcel aaya kya. Zyadatar jawab "nahi" hota hai.
- **SSE** — aap ek line khuli rakhte ho aur kuch hone par dukaan **aapko** call karti hai. Ek tarfa: wo bolte hain, aap sunte ho.
- **WebSocket** — **poora phone call**. Line khuli rehti hai, **dono** kabhi bhi bol sakte hain.

**Kaise chuno:**
- Sirf updates sunne hain? → SSE, simple
- Dono taraf bahut baat (chat, games)? → WebSocket
- 30 second mein update chalega? → sach mein, polling hi theek hai

**Yaad rakho:** HTTP = chitthi, WebSocket = phone call.`,
  },

  'ws-how-it-works': {
    simple: `**"Can we switch to a call?"**

A WebSocket does not start as something new. It starts as a **normal HTTP request** that politely asks: *"can we upgrade this to a phone call?"*

The server replies **101 Switching Protocols** — meaning "yes, line is open". From that moment the same connection stops being letters and becomes a call.

Why bother starting with HTTP? Because offices, wifi routers and firewalls all recognise normal web traffic. A brand-new protocol on a strange port would just get blocked.

**Always use \`wss://\`** (the secure one), never \`ws://\`. It is the same difference as https vs http.

**One thing to know:** a normal request finishes in milliseconds and is forgotten. A WebSocket **stays open**. 10,000 users = 10,000 open lines your server must hold. That is the real cost.

**Remember:** starts as HTTP, upgrades to a call, and stays open.`,
    simpleHi: `**"Call par aa jaayein?"**

WebSocket kisi nayi cheez se shuru nahi hota. Wo ek **normal HTTP request** se shuru hota hai jo tameez se poochhti hai: *"kya ise phone call mein upgrade kar sakte hain?"*

Server jawab deta hai **101 Switching Protocols** — matlab "haan, line khuli". Us pal se wahi connection chitthi hona chhod kar call ban jata hai.

HTTP se shuru kyun? Kyunki office, wifi router aur firewall sab normal web traffic pehchante hain. Kisi ajeeb port par bilkul naya protocol bas block ho jata.

**Hamesha \`wss://\`** (secure wala) use karo, \`ws://\` kabhi nahi. Wahi farq hai jo https aur http mein hai.

**Ek baat jaan lo:** normal request milliseconds mein khatam ho kar bhula di jati hai. WebSocket **khula rehta hai**. 10,000 users = 10,000 khuli lines jo server ko pakde rehni hain. Asli kharcha yahi hai.

**Yaad rakho:** HTTP se shuru, call mein upgrade, aur khula rehta hai.`,
  },

  'ws-socketio': {
    simple: `**A phone with extra buttons.**

A raw WebSocket gives you an open line and nothing else. Socket.IO is that line **plus the features you would end up building anyway**:

- **Auto-redial** — wifi drops, it reconnects by itself
- **Groups (rooms)** — "tell everyone watching order 5", one line of code
- **Named messages** — \`socket.on('order:updated')\` instead of checking a type field yourself
- **Delivery receipt** — know the other side actually got it
- **Backup line** — falls back to normal HTTP where WebSockets are blocked

**Rooms** are the useful idea. A room is just a named group. Join it, then send to the group — no bookkeeping of your own.

\`\`\`js
socket.join('order:5');                    // join
io.to('order:5').emit('updated', data);    // tell that group only
\`\`\`

**One catch:** Socket.IO speaks its own dialect. A plain \`new WebSocket()\` **cannot** connect to it. Both sides must use Socket.IO.

**Remember:** Socket.IO = WebSocket + reconnect + rooms.`,
    simpleHi: `**Extra buttons wala phone.**

Raw WebSocket sirf khuli line deta hai, aur kuch nahi. Socket.IO wahi line hai **plus wo features jo aap waise bhi khud banate**:

- **Auto-redial** — wifi jaye to khud reconnect
- **Groups (rooms)** — "order 5 dekh rahe sabko batao", ek line
- **Naam wale messages** — khud type field check karne ki jagah \`socket.on('order:updated')\`
- **Delivery receipt** — pata chale ki doosri taraf sach mein mila
- **Backup line** — jahan WebSocket block hai wahan normal HTTP par chala jata hai

**Rooms** kaam ka idea hai. Room bas ek naam wala group hai. Join karo, phir group ko bhejo — apna koi hisaab nahi rakhna.

\`\`\`js
socket.join('order:5');                    // join
io.to('order:5').emit('updated', data);    // sirf us group ko
\`\`\`

**Ek baat:** Socket.IO apni alag boli bolta hai. Plain \`new WebSocket()\` isse connect **nahi** ho sakta. Dono taraf Socket.IO chahiye.

**Yaad rakho:** Socket.IO = WebSocket + reconnect + rooms.`,
  },

  'ws-auth-and-security': {
    simple: `**The wristband problem.**

At a concert you show your ticket **once** at the gate and get a wristband. Then you walk around for hours.

A WebSocket is the same: you prove who you are **once**, when connecting, and the line stays open for hours. That creates three dangers.

**1. The wristband does not open every door.**
Being connected proves *who* you are. It does not prove you may see order 99. So check permission on **every single message**, not just at the gate.

**2. Never join a room the client names.**
\`socket.join(whateverTheyAskedFor)\` means anyone can type \`order:99\` and start receiving someone else's data. Always verify it is theirs first.

**3. CORS does not protect you here.**
This surprises people. For normal requests, browsers block other websites from reading your API. **For WebSockets that protection does not apply.** You must check the \`Origin\` yourself.

Also: send the token in the connection data, **not in the URL** — URLs end up in server logs.

**Remember:** wristband at the gate, but check the door every time.`,
    simpleHi: `**Wristband wali problem.**

Concert mein aap gate par **ek baar** ticket dikhate ho aur wristband mil jata hai. Phir ghanton ghoomte ho.

WebSocket bhi wahi hai: aap **ek baar** sabit karte ho ki kaun ho, connect karte waqt, aur line ghanton khuli rehti hai. Isse teen khatre bante hain.

**1. Wristband har darwaza nahi kholta.**
Connected hona sirf ye sabit karta hai ki aap *kaun* ho. Ye nahi ki aap order 99 dekh sakte ho. Isliye permission **har message par** check karo, sirf gate par nahi.

**2. Client ka bataya room kabhi join mat karao.**
\`socket.join(jo unhone maanga)\` ka matlab hai koi bhi \`order:99\` likh kar doosre ka data lena shuru kar de. Pehle verify karo ki wo unka hai.

**3. CORS yahan aapko nahi bachata.**
Ye logon ko chaunkata hai. Normal requests mein browser doosri websites ko aapka API padhne se rokta hai. **WebSockets par wo bachav lagta hi nahi.** \`Origin\` aapko khud check karna padega.

Aur: token connection data mein bhejo, **URL mein nahi** — URLs server logs mein pahunch jaate hain.

**Yaad rakho:** gate par wristband, par darwaza har baar check karo.`,
  },

  'ws-scaling': {
    simple: `**Two rooms, one wall between them.**

Everything works on your laptop. Then you add a second server, and half your users stop receiving messages. Here is why.

A normal API request can go to **any** server — none of them remember you. But a WebSocket **lives on one specific machine**.

\`\`\`
Alice ──── Server A          Bob ──── Server B
\`\`\`

Alice sends a message. Server A shouts it to everyone **in its room**. Bob is in a different building. **He hears nothing.**

**The fix:** put a **loudspeaker between the servers** — that is what Redis does here. Server A shouts, Redis carries it across, Server B repeats it to Bob. About two lines of setup.

**Two more things that bite:**
- Every open connection uses memory the whole time. Your limit is **how many people are connected**, not how many requests per second.
- When you deploy, **everyone** disconnects at once and everyone reconnects at once. Without a random delay, that stampede can knock your server over.

**Remember:** sockets stick to one server — Redis carries the shout across.`,
    simpleHi: `**Do kamre, beech mein deewar.**

Aapke laptop par sab chalta hai. Phir aap doosra server lagate ho, aur aadhe users ko messages milne band. Wajah ye hai.

Normal API request **kisi bhi** server par ja sakti hai — koi bhi aapko yaad nahi rakhta. Par WebSocket **ek khaas machine par rehta hai**.

\`\`\`
Alice ──── Server A          Bob ──── Server B
\`\`\`

Alice message bhejti hai. Server A **apne kamre** mein sabko chilla kar bata deta hai. Bob doosri building mein hai. **Use kuch sunai nahi deta.**

**Ilaaj:** **servers ke beech loudspeaker** lagao — Redis yahan yahi karta hai. Server A chillata hai, Redis paar pahunchata hai, Server B Bob ko dohra deta hai. Lagbhag do line ka setup.

**Do aur cheezein jo kaatti hain:**
- Har khuli connection poore samay memory leti hai. Aapki limit hai **kitne log jude hain**, na ki kitni requests per second.
- Deploy karte hi **sab** ek saath disconnect hote hain aur sab ek saath reconnect. Bina random delay ke ye bhagdad server gira sakti hai.

**Yaad rakho:** sockets ek server se chipke rehte hain — Redis chillahat paar pahunchata hai.`,
  },
};
