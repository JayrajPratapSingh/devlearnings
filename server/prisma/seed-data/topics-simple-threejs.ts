import type { SimpleExplanation } from './topics-simple';
import type { TopicTricks } from './topics-tricks';

/**
 * Beginner explanations and memory hooks for Three.js and R3F.
 *
 * This category is the one place in the app where the reader's existing web
 * intuition actively works against them: there is no request and response, only
 * a loop that must finish sixty times a second. So the simple layer leans on
 * theatre, photography and physical staging rather than on anything from
 * ordinary web development.
 */

export const SIMPLE_THREEJS: Record<string, SimpleExplanation> = {
  'three-what-is-webgl': {
    simple: `**Your computer has a second, very strange processor.**

The normal one is a handful of clever workers. The graphics one is thousands of simple workers who can only do one thing — but they all do it at the same moment.

That is perfect for drawing, because a screen is two million dots and every one needs the same little calculation. One clever worker doing it two million times is slow. Two million simple workers each doing it once is instant.

**Talking to it directly is miserable.**

To draw a single triangle you write two small programs in a language you have never used, compile them, describe your data byte by byte, and hand it over. Hundreds of lines. And you still have no camera, no lights, and no way to load a model.

Three.js is the layer that lets you say *"a red cube, over there, with a light above it"* instead.

**What it is not**

It draws things. It does not do physics, sound, or level editing. Those are separate tools you add.

That is worth knowing early, because "why can Three.js not do X" usually has the answer "because it was never trying to".

**The one idea that changes everything**

A normal web page sits still until someone clicks. This does not.

**A loop runs constantly — about sixty times a second — and everything must finish in about 16 milliseconds.**

That number reframes the whole subject. The question is never "is the page fast". It is "did this frame finish in time". Miss it and people do not see slowness, they see stutter — and everyone notices stutter.

**Remember:** thousands of simple workers, a loop that never stops, and 16 milliseconds to do everything.`,
    simpleHi: `**Aapke computer mein ek doosra, bahut ajeeb processor hai.**

Aam wala kuch chatur karmchari hai. Graphics wala hazaaron simple karmchari hai jo sirf ek kaam kar sakte hain — par sab ek hi pal mein karte hain.

Ye banane ke liye bilkul sahi hai, kyunki screen bees lakh bindu hai aur har ek ko wahi chhota hisaab chahiye. Ek chatur karmchari use bees lakh baar kare to dheema. Bees lakh simple karmchari ek-ek baar karein to turant.

**Usse seedhe baat karna dukhdayi hai.**

Ek triangle banane ke liye aap ek anjaani bhasha mein do chhote program likhte ho, unhe compile karte ho, apna data byte-dar-byte batate ho, aur pakda dete ho. Sau se zyada line. Aur uske baad bhi na camera hai, na lights, na model load karne ka tareeka.

Three.js wo parat hai jo aapko iski jagah kehne deti hai *"ek laal cube, wahan, uske upar ek light"*.

**Ye kya nahi hai**

Ye cheezein banata hai. Ye physics, awaaz ya level editing nahi karta. Wo alag auzaar hain jo aap jodte ho.

Ye jaldi jaanna theek hai, kyunki "Three.js X kyun nahi kar sakta" ka jawab aksar "kyunki wo karne ki koshish hi nahi kar raha tha" hota hai.

**Wo ek vichaar jo sab kuch badal deta hai**

Aam web page tab tak chup baitha rehta hai jab tak koi click na kare. Ye nahi.

**Ek loop lagatar chalta hai — lagbhag ek second mein saath baar — aur sab kuch lagbhag 16 milliseconds mein khatam hona chahiye.**

Wo number poora vishay badal deta hai. Sawaal kabhi "page tez hai kya" nahi hota. Sawaal hai "ye frame waqt par khatam hua kya". Chook jao to logon ko dheemapan nahi, hakla-hat dikhti hai — aur hakla-hat sabko dikhti hai.

**Yaad rakho:** hazaaron simple karmchari, kabhi na rukne wala loop, aur sab kuch karne ko 16 milliseconds.`,
  },

  'three-scene-camera-renderer': {
    simple: `**Think of filming a play. You need three things.**

- **The stage** — where everything stands. Objects can be placed on other objects, and moving the big thing moves everything sitting on it.
- **The camera** — where you are watching from.
- **The projector** — what actually puts the picture on screen.

Miss any one and you see nothing.

**Two camera settings catch everyone**

The camera has a **nearest** and a **furthest** distance it will film. Anything closer than the near one, or further than the far one, is **simply not filmed** — not dim, not small, just absent.

"My object disappeared" is nearly always this.

And do not set that range absurdly wide. The camera only has so much precision to spread across it. Stretch it from a millimetre to a kilometre and surfaces start flickering against each other, because it can no longer tell which is in front.

**One setting that saves your phone users**

Modern phones pack several real dots into every dot you think you see. Draw at full detail and you are painting **nine times** as much as on an ordinary screen — for a difference nobody can see.

Cap it. This is the single biggest reason 3D pages crawl on phones.

**When nothing appears — go down this list**

1. Did you actually tell the projector to project?
2. Is the object inside the near/far range?
3. Is the camera even pointing at it?
4. Is there a light? Most surfaces are pure black without one.
5. Is the object behind the camera, or exactly on top of it?

Almost every beginner problem is one of those five, and running the list is faster than staring at the code.

**Remember:** stage, camera, projector. And "it vanished" usually means it fell outside the camera's range.`,
    simpleHi: `**Natak film karna socho. Teen cheezein chahiye.**

- **Stage** — jahan sab khada hai. Cheezein doosri cheezon par rakhi ja sakti hain, aur badi cheez hilao to us par rakha sab hilta hai.
- **Camera** — aap kahan se dekh rahe ho.
- **Projector** — jo sach mein tasveer screen par daalta hai.

Koi ek bhi chhoot jaye to kuch nahi dikhta.

**Camera ki do settings sabko fasati hain**

Camera ki ek **sabse paas** aur ek **sabse door** ki doori hoti hai jahan tak wo film karta hai. Paas wali se paas ya door wali se door ki cheez **film hoti hi nahi** — dhundhli nahi, chhoti nahi, bas gayab.

"Mera object gayab ho gaya" lagbhag hamesha yahi hai.

Aur us range ko bewajah chauda mat karo. Camera ke paas usme baantne ko itni hi theek-theek jaankari hai. Use millimetre se kilometre tak khinch do aur satahein ek doosre par jhilmilane lagti hain, kyunki wo bata hi nahi pata ki aage kaun hai.

**Ek setting jo aapke phone users ko bachati hai**

Aaj ke phone har us bindu mein kai asli bindu bharte hain jo aapko ek dikhta hai. Poori tafseel se banao aur aap aam screen se **nau guna** paint kar rahe ho — us farak ke liye jo kisi ko dikhta hi nahi.

Use baandho. Phone par 3D pages ke ghisatne ki sabse badi wajah yahi hai.

**Kuch na dikhe to is suchi par chalo**

1. Aapne projector ko project karne ko kaha bhi tha?
2. Object near/far range mein hai?
3. Camera uski taraf dekh bhi raha hai?
4. Koi light hai? Zyadatar satahein bina light ke poori kaali hoti hain.
5. Object camera ke peeche to nahi, ya theek uske upar to nahi?

Lagbhag har shuruaati samasya in paanch mein se ek hai, aur suchi chalana code ko ghoorne se tez hai.

**Yaad rakho:** stage, camera, projector. Aur "gayab ho gaya" ka matlab aksar ye ki wo camera ki range se bahar chala gaya.`,
  },

  'three-mesh-geometry-material': {
    simple: `**Every object on screen is two things: a shape and a skin.**

- **Shape** — the wireframe underneath. Where the corners are.
- **Skin** — what the surface is made of. Shiny metal? Rough wood? Flat colour?

Put them together and you have an object.

**Everything is triangles.** A ball is not round — it is enough triangles that you stop noticing. Zoom in far enough and you always find the flat bits.

**Choosing a skin is most of how it looks**

There are a few, and they trade beauty for speed:

- The **cheapest** ignores light completely. It is one flat colour from every angle — useful for signs and simple shapes, and it looks like cardboard.
- The **standard** one behaves like a real surface: it reacts to light, reflects its surroundings, and can be shiny or dull. This is the one you want.

The realistic one is described by two simple sliders: **how rough is it** (mirror at one end, chalk at the other) and **is it metal** — and that second one is almost always fully yes or fully no, because real things are metal or they are not.

**The mistake absolutely everyone makes once**

You add an object, you load the page, and it is **pure black**. Nothing is broken.

**There is no light.** A realistic surface with nothing shining on it is black, because that is what things look like in the dark.

**One habit worth learning immediately**

If you need a thousand identical objects, make **one** shape and **one** skin, and let all thousand share them.

Making a thousand separate copies of the same thing is one of the most common ways to make a scene slow, and it buys you absolutely nothing.

**Remember:** shape plus skin. And if it is black, turn on a light.`,
    simpleHi: `**Screen par har object do cheezein hai: ek shakal aur ek khaal.**

- **Shakal** — neeche ka dhaancha. Kone kahan hain.
- **Khaal** — satah kis cheez ki hai. Chamakta metal? Khurdura lakdi? Flat rang?

Dono jodo aur object ban gaya.

**Sab kuch triangles hai.** Gend gol nahi hai — wo itne triangles hai ki aap ginna chhod dete ho. Kaafi paas jaao aur chapte hisse hamesha mil jate hain.

**Khaal chunna hi zyadatar ye tay karta hai ki wo kaisa dikhta hai**

Kuch hain, aur wo khoobsurti aur raftaar ka sauda karti hain:

- **Sabse sasti** light ko poori tarah nazarandaz karti hai. Har kon se wo ek flat rang hai — board aur simple shapes ke liye kaam ki, aur ye gatte jaisi dikhti hai.
- **Standard** wali asli satah jaisa bartaav karti hai: wo light par reaction deti hai, aas-paas ko darshati hai, aur chamakdaar ya feeki ho sakti hai. Yahi aapko chahiye.

Vaastavik wali do simple slider se batayi jati hai: **kitni khurduri hai** (ek sire par sheesha, doosre par chalk) aur **kya ye metal hai** — aur doosri lagbhag hamesha poori haan ya poori na hoti hai, kyunki asli cheezein ya to metal hain ya nahi.

**Wo galti jo bilkul har koi ek baar karta hai**

Aap object jodte ho, page kholte ho, aur wo **poora kaala** hai. Kuch toota nahi hai.

**Koi light hai hi nahi.** Vaastavik satah par kuch chamak hi nahi raha to wo kaali hai, kyunki andhere mein cheezein aisi hi dikhti hain.

**Ek aadat turant seekhne layak**

Hazaar ek jaise objects chahiye to **ek** shakal aur **ek** khaal banao, aur hazaaron ko wahi saanjha karne do.

Ek hi cheez ki hazaar alag copies banana scene dheema karne ke sabse aam tareekon mein se ek hai, aur ismein aapko kuch bhi nahi milta.

**Yaad rakho:** shakal aur khaal. Aur kaala dikhe to light jala do.`,
  },

  'three-transforms': {
    simple: `**Every object knows three things: where it is, which way it faces, and how big it is.**

And all three are **relative to whatever it is attached to** — exactly like a box inside a box. Move the outer box and everything inside comes along, without any of them knowing.

This is genuinely useful. To build a solar system you do not calculate orbits. You put the Earth inside a spinner, put the spinner around the Sun, and turn the spinner. The Earth orbits because it is attached to something that is turning.

**Turning is where the trouble is**

**Two surprises, and everybody hits both.**

**It measures turns in a unit that is not degrees.** Write 90 expecting a quarter turn and your object spins about fourteen times. A quarter turn is written differently, and everyone gets this wrong once.

**Turning around three separate axes goes wrong in a specific way.** Turn far enough on one and two of the others line up — and now you have lost a direction you could turn in. It feels like a bug. It is a known flaw in describing rotation with three numbers, and it has a name and a fix.

The fix uses **four** numbers instead of three. You almost never write them yourself; you just use the tools that handle it, and the problem goes away.

**Practical rule:** three numbers for setting a fixed angle you will read later. The four-number version for anything that spins over time.

**One more that saves an afternoon**

If you move something and immediately ask *"where is it now?"* in the same breath, you get the **old** answer. The position is worked out once per frame, and you asked in between.

There is a one-line call to force the update. Knowing it exists saves a genuinely confusing hour.

**Remember:** boxes inside boxes. Not degrees. And turning is harder than it looks.`,
    simpleHi: `**Har object teen cheezein jaanta hai: wo kahan hai, kis taraf mooh kiye hai, aur kitna bada hai.**

Aur teeno **us cheez ke sapeksh hain jisse wo juda hai** — bilkul dibbe ke andar dibba. Bahar wala dibba hilao aur andar ka sab saath aata hai, bina kisi ko pata chale.

Ye sach mein kaam ka hai. Saur mandal banane ke liye aap orbit ka hisaab nahi lagate. Aap Prithvi ko ek ghoomne wale mein rakhte ho, us ghoomne wale ko Sooraj ke aas-paas, aur use ghuma dete ho. Prithvi isliye chakkar lagati hai kyunki wo ghoomti cheez se judi hai.

**Ghumav mein hi dikkat hai**

**Do chaunkane wali baatein, aur dono sabko milti hain.**

**Ye ghumav ko us ikai mein naapta hai jo degree nahi hai.** Chauthai ghumav ki ummeed mein 90 likho aur object lagbhag chaudah baar ghoom jata hai. Chauthai ghumav alag likha jata hai, aur ye galti har koi ek baar karta hai.

**Teen alag axis par ghumana ek khaas tareeke se bigadta hai.** Ek par kaafi ghumao aur doosre do ek line mein aa jate hain — aur ab ek disha chali gayi jisme aap ghuma sakte the. Ye bug lagta hai. Ye teen numbers se ghumav batane ki jaani-maani khaami hai, aur iska naam bhi hai aur hal bhi.

Hal teen ki jagah **chaar** numbers use karta hai. Aap inhe lagbhag kabhi khud nahi likhte; aap bas wo auzaar use karte ho jo ise sambhalte hain, aur samasya gayab ho jati hai.

**Practical niyam:** jo tay kon aap baad mein padhoge uske liye teen numbers. Jo samay ke saath ghoomta ho uske liye chaar wala roop.

**Ek aur jo ek dopahar bachata hai**

Aap kuch hilao aur usi saans mein poochho *"ab wo kahan hai?"* to aapko **purana** jawab milta hai. Jagah har frame mein ek baar nikalti hai, aur aapne beech mein poochh liya.

Update zabardasti karwane ki ek line ki call hai. Iska hona jaanna sach mein uljhane wala ek ghanta bacha leta hai.

**Yaad rakho:** dibbe ke andar dibbe. Degree nahi. Aur ghumav dikhne se mushkil hai.`,
  },

  'three-lights-and-shadows': {
    simple: `**Lighting is what makes a scene look real or fake. Not the models.**

A few kinds of light:

- **Everywhere-at-once** — lifts the darkness but has no direction, so nothing gets shape from it. Never your main light.
- **The sun** — parallel beams from very far away. This is usually your main light.
- **A bulb** — spreads out from a point.
- **A torch** — a cone pointing somewhere.

The classic setup is three: a bright one from the front-side, a soft one from the other side to lift the shadows, and one from behind to make the edges glow so the object separates from the background.

**But here is what actually matters more than any of them**

Real surfaces **reflect their surroundings**. A metal teapot in a white room and the same teapot in a forest look completely different — and not because of the lights.

So if you tell the scene *"you are in a photography studio"* or *"you are outdoors at sunset"*, everything suddenly looks right. Beginners keep adding more lights when what they needed was to say **where they are**.

This is often the single biggest improvement available, and it is one line.

**Shadows: expensive and fiddly**

To draw a shadow, the whole scene is drawn a second time from the light's point of view, to see what is blocked. So **each shadow-casting light roughly doubles the work.** They are the first thing to switch off when things get slow.

They are also off by default, and turning them on takes four separate steps. Miss any one and there is no shadow and no error message — just nothing.

**The cheat everyone uses:** a soft dark blur under the object. It costs nothing, it often looks better than a real shadow, and a great many finished projects use exactly that.

**Remember:** tell the scene where it is. That does more than any light.`,
    simpleHi: `**Scene asli lagta hai ya nakli, ye lighting tay karti hai. Models nahi.**

Kuch tarah ki lights:

- **Har taraf se ek saath** — andhera halka karti hai par uski koi disha nahi, isliye ismein kisi ko shakal nahi milti. Ise kabhi mukhya light mat banao.
- **Sooraj** — bahut door se samanantar kirnein. Aam taur par yahi aapki mukhya light hai.
- **Bulb** — ek bindu se har taraf phailti hai.
- **Torch** — kisi taraf ishara karta cone.

Classic setup teen ka hai: saamne-bagal se ek tez, doosri taraf se ek narm jo shadows halke kare, aur peeche se ek jo kinaron ko chamka de taaki object background se alag dikhe.

**Par asal mein in sabse zyada matter kya karta hai**

Asli satahein **apne aas-paas ko darshati hain**. Safed kamre mein rakhi metal ki kettle aur jungle mein wahi kettle bilkul alag dikhti hain — aur lights ki wajah se nahi.

Isliye agar aap scene se kaho *"aap photography studio mein ho"* ya *"aap dhalte sooraj mein bahar ho"*, to achanak sab theek dikhne lagta hai. Shuruaat mein log aur lights jodte rehte hain jabki unhe ye batana tha ki **wo hain kahan**.

Ye aksar uplabdh sabse bada sudhaar hai, aur ek line ka hai.

**Shadows: mehnge aur nakhrelu**

Shadow banane ke liye poora scene doosri baar banaya jata hai, light ki nazar se, taaki dekha ja sake kya rok raha hai. Isliye **shadow daalne wali har light kaam lagbhag dugna kar deti hai.** Cheezein dheemi hon to sabse pehle inhi ko band karte hain.

Ye default mein band bhi hain, aur chalu karne mein chaar alag kadam lagte hain. Koi ek chhoot jaye to na shadow banta hai na koi error aata hai — bas kuch nahi.

**Wo jugaad jo sab use karte hain:** object ke neeche ek narm kaala dhabba. Ismein kuch kharch nahi hota, ye aksar asli shadow se behtar dikhta hai, aur bahut se poore hue projects theek yahi use karte hain.

**Yaad rakho:** scene ko batao ki wo kahan hai. Ye kisi bhi light se zyada karta hai.`,
  },

  'three-animation-loop': {
    simple: `**Something has to happen sixty times a second, forever.**

Every time round the loop: work out what changed, then draw it. That is the whole shape of a 3D app.

**The bug absolutely everyone ships once**

You write *"turn a bit each time round"* and it looks perfect. On your machine.

Then someone opens it on a fancy monitor that redraws **144** times a second instead of 60, and everything runs **more than twice as fast**. Your animation is now frantic, and you cannot see it, because your screen is fine.

**The fix:** do not say "turn a bit each time". Say **"turn this much per second"**, and multiply by how long the last frame actually took.

Now it runs at the same speed on every machine ever made. This one habit prevents the single most common animation bug there is.

**The other half of that**

If someone switches to another tab and comes back ten minutes later, the "how long since last time" is **ten minutes**. Anything moving gets flung across the scene.

So put a ceiling on it. If more than a fraction of a second has passed, pretend it was a fraction of a second.

**How much time do you actually have?**

At sixty frames a second, about **16 milliseconds** — for everything. Thinking, moving, drawing. The browser needs a slice too, so treat about 10 as yours.

And smoothness matters more than speed. **Steady is better than fast-but-jumpy.** A solid thirty feels better than a sixty that keeps stumbling to forty-five, which people find genuinely unpleasant.

**One thing in the wrong order**

Move the camera **before** you draw, not after. Draw first and you are always showing where the camera was **last** time — a small permanent lag that is maddening to track down and trivial to fix.

**Remember:** per second, not per frame. And put a ceiling on it.`,
    simpleHi: `**Kuch na kuch ek second mein saath baar hona hai, hamesha.**

Har chakkar mein: pata karo kya badla, phir banao. 3D app ki poori shakal yahi hai.

**Wo bug jo bilkul har koi ek baar ship karta hai**

Aap likhte ho *"har baar thoda ghumao"* aur wo bilkul theek dikhta hai. Aapki machine par.

Phir koi use us shandar monitor par kholta hai jo 60 ki jagah **144** baar dobara banata hai, aur sab kuch **do guna se zyada tez** chalta hai. Aapki animation ab bawali hai, aur aapko dikhti nahi, kyunki aapki screen theek hai.

**Hal:** "har baar thoda ghumao" mat kaho. Kaho **"ek second mein itna ghumao"**, aur pichhle frame mein sach mein kitna waqt laga usse guna karo.

Ab ye har machine par ek hi raftaar se chalta hai. Yahi ek aadat sabse aam animation bug rok deti hai.

**Isi ka doosra aadha**

Koi doosre tab par jaakar das minute baad laut e, to "pichhli baar se kitna waqt" **das minute** hai. Jo bhi hil raha hai wo scene ke paar phenk diya jata hai.

Isliye us par chhat lagao. Ek second ke kuch hisse se zyada beeta ho to maan lo ki utna hi hissa beeta tha.

**Aapke paas sach mein kitna waqt hai?**

Ek second mein saath frame par, lagbhag **16 milliseconds** — sab kuch ke liye. Sochna, hilana, banana. Browser ko bhi hissa chahiye, isliye lagbhag 10 apna maano.

Aur raftaar se zyada smooth hona matter karta hai. **Ek-jaisa hona, tez-par-uchhalta hone se behtar hai.** Sthir tees, us saath se behtar lagta hai jo baar-baar pachas-paintalis par ladkhadata ho, aur ye logon ko sach mein bura lagta hai.

**Ek cheez galat kram mein**

Camera ko banane se **pehle** hilao, baad mein nahi. Pehle banao to aap hamesha ye dikha rahe ho ki camera **pichhli** baar kahan tha — ek chhota sthai lag jo dhoondhna pagal kar deta hai aur pata chalte hi theek karna aasan hai.

**Yaad rakho:** per second, per frame nahi. Aur us par chhat lagao.`,
  },

  'three-textures-and-uv': {
    simple: `**A texture is a picture wrapped onto a shape.**

Like a label on a tin. Something has to say which part of the picture goes where, and that information is stored in the shape itself. Modelling programs work it out; you almost never do it by hand.

**Modern surfaces use several pictures at once**

- One for **colour** — what shade it is
- One for **bumpiness** — and this one is the clever trick
- One for **shine** — glossy here, dull there
- One for **metal or not**

The bumpiness one deserves a moment. It does not actually add any bumps. It **lies to the light** about which way the surface faces, and your eye completely falls for it. A perfectly flat wall can look like rough brick, at no extra cost. It is the best value in the whole subject.

**The bug everyone hits and nobody notices**

Some of these pictures are **colours** and some are **numbers pretending to be a picture**.

The bumpiness one is not a picture of anything — it is directions, stored as colours because that is convenient. Treat it like a colour and the computer "corrects" it the way it corrects photos, and everything ends up slightly, unnameably wrong.

You will not spot it. You will just think your scene looks a bit off and never know why.

**Size is your loading time**

Textures are usually the biggest thing you send. One very large texture can be sixty megabytes once it is on the graphics card — for **one** surface.

Use the smallest that looks right. On most objects nobody can tell, and the difference between a page that loads instantly and one that does not is usually here.

**And they do not clean themselves up.** When you are finished with a picture you must say so explicitly. Forget, and moving between scenes slowly fills the graphics card until the tab dies.

**Remember:** some of those pictures are not pictures. And smaller than you think is usually enough.`,
    simpleHi: `**Texture wo tasveer hai jo shakal par lipti hoti hai.**

Jaise dibbe par label. Kisi ko batana hota hai ki tasveer ka kaunsa hissa kahan jayega, aur wo jaankari shakal mein hi rakhi hoti hai. Modelling programs ise nikaal lete hain; aap lagbhag kabhi haath se nahi karte.

**Aaj ki satahein ek saath kai tasveerein use karti hain**

- Ek **rang** ke liye — kaunsa shade hai
- Ek **ubhaar** ke liye — aur yahi chalak tareeka hai
- Ek **chamak** ke liye — yahan chikni, wahan feeki
- Ek **metal hai ya nahi**

Ubhaar wali par ek pal rukna chahiye. Wo sach mein koi ubhaar jodti hi nahi. Wo **light se jhoot bolti hai** ki satah kis taraf mooh kiye hai, aur aapki aankh poori tarah dhokha kha jati hai. Bilkul chapti deewar khurdari eent jaisi dikh sakti hai, bina kisi extra kharch ke. Poore vishay mein sabse achha sauda yahi hai.

**Wo bug jo sabko milta hai aur kisi ko dikhta nahi**

Inme se kuch tasveerein **rang** hain aur kuch **numbers hain jo tasveer hone ka natak kar rahe hain**.

Ubhaar wali kisi cheez ki tasveer hai hi nahi — wo dishaayein hain, rangon mein rakhi hui kyunki wo suvidha janak hai. Use rang maan lo aur computer use waise "theek" kar deta hai jaise wo photos ko karta hai, aur sab kuch halka sa, naam na dene layak galat ho jata hai.

Aapko ye dikhega nahi. Aapko bas lagega ki scene thoda ajeeb hai aur kabhi pata nahi chalega kyun.

**Size hi aapka loading time hai**

Textures aksar sabse badi cheez hoti hain jo aap bhejte ho. Ek bahut badi texture graphics card par pahunch kar saath megabyte ho sakti hai — **ek** satah ke liye.

Sabse chhoti use karo jo theek dikhe. Zyadatar objects par kisi ko farak nahi dikhta, aur turant load hone wale page aur na hone wale page ka farak aksar yahin hota hai.

**Aur ye khud saaf nahi hoti.** Tasveer ka kaam khatam ho to saaf-saaf batana padta hai. Bhoolo, aur scenes ke beech ghoomna dheere-dheere graphics card bhar deta hai jab tak tab mar na jaye.

**Yaad rakho:** un tasveeron mein se kuch tasveerein hain hi nahi. Aur aapke andaze se chhoti aksar kaafi hoti hai.`,
  },

  'three-loading-models': {
    simple: `**Somebody else made the 3D model. You have to get it onto the page.**

There is a standard format for this, designed specifically for sending over the internet rather than for making things in. Use it. There is a single-file version — use that one, because it is one download and nothing can go missing.

**The step people skip, and it is the important one**

Models come out of modelling programs **enormous**. Fifty megabytes is normal.

Run it through a squasher first and the same model can be two megabytes. Same appearance. Twenty-five times smaller.

This takes one command and it is the difference between a page that loads in a second and one that loads in twelve. Skipping it is the most common reason 3D pages feel broken.

**Waiting is the actual product problem**

3D files are big. While they download, your visitor is looking at nothing — and looking at nothing is the most common reason people leave.

Three things help, in order:

1. **Show a real progress bar.** Not a spinner. A spinner says "wait"; a bar says "wait about this long", and that difference decides whether people stay.
2. **Put something on screen immediately** — a photo of the thing, anything at all.
3. **Load the important object first**, decoration afterwards.

**Two things that will go wrong**

**The graphics card can drop everything.** A driver update, or switching apps on a phone, and your whole scene vanishes. Catch it and say something, rather than leaving a blank rectangle.

**The download can fail.** Networks do that. Show a picture instead of nothing.

**One habit that prevents a crash**

When you take a model off the screen, that does **not** give the memory back. You have to say so explicitly.

Skip it, and moving between a few 3D pages slowly fills the graphics card until the tab dies. This is the classic bug in apps that have several 3D views.

**Remember:** squash it first, show real progress, and give the memory back when you are done.`,
    simpleHi: `**3D model kisi aur ne banaya hai. Aapko use page par laana hai.**

Iske liye ek standard format hai, jo khaas taur par internet par bhejne ke liye bana hai, banane ke liye nahi. Wahi use karo. Uska ek-file wala roop hai — wahi lo, kyunki wo ek download hai aur usme kuch gum nahi ho sakta.

**Wo kadam jise log chhod dete hain, aur wahi zaroori hai**

Models modelling programs se **bahut bade** nikalte hain. Pachas megabyte aam hai.

Pehle use dabane wale se guzaro aur wahi model do megabyte ho sakta hai. Wahi dikhaawat. Pachhees guna chhota.

Ismein ek command lagti hai aur ye ek second mein load hone wale page aur baarah second wale page ka farak hai. Ise chhodna hi 3D pages ke toota hua lagne ki sabse aam wajah hai.

**Intezaar hi asli product samasya hai**

3D files badi hoti hain. Download ke dauran aapka aane wala kuch nahi dekh raha — aur kuch na dekhna logon ke chale jaane ki sabse aam wajah hai.

Teen cheezein madad karti hain, isi kram mein:

1. **Asli progress bar dikhao.** Spinner nahi. Spinner kehta hai "ruko"; bar kehti hai "lagbhag itna ruko", aur wahi farak tay karta hai ki log rukenge ya nahi.
2. **Turant screen par kuch daalo** — us cheez ki photo, kuch bhi.
3. **Zaroori object pehle load karo**, sajawat baad mein.

**Do cheezein jo bigdengi**

**Graphics card sab kuch chhod sakta hai.** Driver update, ya phone par app badalna, aur poora scene gayab. Ise pakdo aur kuch kaho, khaali chaukor mat chhodo.

**Download fail ho sakta hai.** Network aisa karte hain. Kuch na dikhane ki jagah ek tasveer dikhao.

**Ek aadat jo crash rokti hai**

Jab aap model screen se hataate ho, isse memory wapas **nahi** milti. Aapko saaf-saaf kehna padta hai.

Chhod do, aur kuch 3D pages ke beech ghoomna dheere-dheere graphics card bhar deta hai jab tak tab mar na jaye. Jin apps mein kai 3D views hain unka classic bug yahi hai.

**Yaad rakho:** pehle dabao, asli pragati dikhao, aur kaam khatam ho to memory wapas do.`,
  },

  'three-raycasting': {
    simple: `**How do you know which 3D object someone clicked?**

The screen is flat. The scene is not. So you fire an invisible beam from the eye, straight out through wherever the cursor is, and see what it hits first.

That is genuinely all it is, and it gives you more than "which object" — it tells you the **exact spot** where the beam landed, which is how you place a pin precisely where someone tapped.

**Where it quietly becomes slow**

The mouse reports its position **far more often than the screen redraws**. Fire the beam on every one of those and you are testing every object you own, hundreds of times a second, for a picture that only changes sixty times.

Two easy fixes:

- Only fire **once per drawn frame**, not once per mouse wiggle
- Only test the objects that are actually **clickable**, not the entire scene

Both are one line. Together they turn a sluggish scene into a smooth one.

**The part that is genuinely important**

**A 3D canvas is completely invisible to a screen reader.**

Not badly described — **invisible**. Everything inside it does not exist as far as assistive software is concerned. And you cannot reach any of it by pressing Tab, because there is nothing there to reach.

So if the only way to see a product detail is to click a spot on a 3D model, some people **cannot use your product at all**.

The answer is to put the same thing in ordinary page elements too — a list of buttons, a text description, real links. Not as a nice extra. As the version that works.

**And on phones:** there is no hovering on a touchscreen, and fingers are not precise. Anything relying on hover needs a different design, and hit areas should be bigger than they look.

**Remember:** one beam per frame, and always build a version that works without the canvas.`,
    simpleHi: `**Ye kaise pata chale ki kisne kaunsa 3D object click kiya?**

Screen chapti hai. Scene nahi. Isliye aap aankh se ek adrishya kiran chhodte ho, seedha wahan se hokar jahan cursor hai, aur dekhte ho wo pehle kis se takrati hai.

Sach mein bas itna hi hai, aur ye "kaunsa object" se zyada deta hai — ye wo **theek jagah** batata hai jahan kiran giri, aur isi se aap pin bilkul wahan lagate ho jahan kisi ne tap kiya.

**Ye chupchaap dheema kahan ban jata hai**

Mouse apni jagah **screen ke dobara banne se kahin zyada baar** batata hai. Un sab par kiran chhodo aur aap apne har object ko, ek second mein sau baar, jaanch rahe ho — us tasveer ke liye jo sirf saath baar badalti hai.

Do aasan hal:

- Kiran **har bane frame par ek baar** chhodo, har mouse hilne par nahi
- Sirf un objects ko jaancho jo sach mein **click hone layak** hain, poore scene ko nahi

Dono ek-ek line hain. Saath mein ye sust scene ko smooth bana dete hain.

**Wo hissa jo sach mein zaroori hai**

**Screen reader ke liye 3D canvas poori tarah adrishya hai.**

Bura bataya gaya nahi — **adrishya**. Uske andar ka sab kuch sahayak software ke liye hai hi nahi. Aur aap Tab dabakar usme kuch nahi pahunch sakte, kyunki wahan pahunchne ko kuch hai hi nahi.

Isliye agar product ki tafseel dekhne ka ekmatra rasta 3D model par ek jagah click karna hai, to kuch log **aapka product use kar hi nahi sakte**.

Jawab ye hai ki wahi cheez aam page elements mein bhi rakho — buttons ki list, text ka hulia, asli links. Achhe extra ki tarah nahi. Us roop ki tarah jo sach mein chalta hai.

**Aur phone par:** touchscreen par hover hota hi nahi, aur ungliyan theek-theek nahi hoti. Jo hover par tika ho use alag design chahiye, aur chhune ki jagah dikhne se badi honi chahiye.

**Yaad rakho:** har frame ek kiran, aur hamesha ek aisa roop banao jo canvas ke bina chale.`,
  },

  'r3f-basics': {
    simple: `**Writing 3D the way you already write React.**

Instead of building objects one line at a time and remembering to attach each one, you describe the scene as components — nested, exactly like normal React.

And it is not a slower copy. It builds the very same objects underneath. You lose nothing by using it, and you gain everything React is good at: reuse, props, composition.

**One free gift worth naming:** when a component disappears, it cleans up its own 3D memory. That is the leak people spend an afternoon on in plain 3D code, handled for you.

**The one rule that matters more than everything else**

There are two kinds of change, and telling them apart is the whole skill:

**Things that change occasionally** — is the panel open, which model is loaded, what colour did they pick. Normal React state. Perfect.

**Things that change every single frame** — a spinning object, a following camera, anything animated.

**Never use React state for the second kind.**

If you do, React does its full "something changed, work out what to redraw" routine **sixty times a second**, forever. That machinery is designed for a click, not for a continuous loop, and it will not keep up.

Instead, there is a place to write code that runs every frame **outside** React entirely. In there you change the object directly. React never finds out, does no work, and everything stays smooth.

**Say it like this:** *React for what the user did. The frame loop for what is moving.*

That one distinction is the difference between an R3F scene that runs beautifully and one that stutters for no visible reason — and it is the single most common mistake in the whole library.

**Remember:** state for occasional, the frame loop for constant. Never mix them up.`,
    simpleHi: `**3D waise likhna jaise aap pehle se React likhte ho.**

Ek-ek line mein objects banane aur har ek ko jodna yaad rakhne ki jagah, aap scene ko components ki tarah batate ho — nested, bilkul aam React jaise.

Aur ye dheemi copy nahi hai. Ye neeche bilkul wahi objects banata hai. Ise use karne se aap kuch nahi khote, aur wo sab paate ho jisme React achha hai: dobara istemal, props, composition.

**Ek muft tohfa ginane layak:** component gayab hote hi wo apni 3D memory khud saaf kar deta hai. Wahi leak jis par aam 3D code mein log ek dopahar lagate hain, aapke liye sambhal jata hai.

**Wo ek niyam jo baaki sabse zyada matter karta hai**

Do tarah ke badlav hote hain, aur inhe alag pehchan lena hi poora hunar hai:

**Jo kabhi-kabhi badalte hain** — panel khula hai ya nahi, kaunsa model load hai, unhone kaunsa rang chuna. Aam React state. Bilkul theek.

**Jo har ek frame badalte hain** — ghoomta object, peecha karta camera, koi bhi animation.

**Doosre wale ke liye React state kabhi mat use karo.**

Karoge to React apna poora "kuch badla, ab tay karo kya dobara banana hai" wala kaam **ek second mein saath baar** karega, hamesha. Wo machinery click ke liye bani hai, lagatar chalte loop ke liye nahi, aur wo saath nahi de payegi.

Iski jagah, ek aisi jagah hai jahan aap har frame chalne wala code React ke **bahar** likh sakte ho. Wahan aap object ko seedha badalte ho. React ko pata hi nahi chalta, wo kuch kaam nahi karta, aur sab smooth rehta hai.

**Aise kaho:** *React ke liye wo jo user ne kiya. Frame loop ke liye wo jo hil raha hai.*

Yahi ek farak shandar chalne wale R3F scene aur bina kisi dikhti wajah ke hakla ne wale scene ka antar hai — aur poori library ki sabse aam galti yahi hai.

**Yaad rakho:** kabhi-kabhi ke liye state, lagatar ke liye frame loop. Inhe kabhi mat ghulao.`,
  },

  'r3f-ecosystem': {
    simple: `**Almost everything you are about to build already exists.**

There is a companion toolbox for R3F, and reaching for it first is the difference between a weekend and an afternoon.

**What is in it**

- **Drag to spin the object.** You were about to write this. Do not.
- **"You are in a photography studio."** One line, and your scene suddenly looks professional. This is usually the single biggest improvement available to you.
- **A soft shadow under things.** Costs nothing, often looks better than a real one.
- **Text that stays sharp** no matter how close you zoom.
- **Real page elements floating in 3D space** — actual buttons, at a position in the scene. This is how you make a 3D thing usable by keyboard and screen readers, which the canvas alone can never be.
- **Automatic quality dropping** — if the frame rate falls, it quietly renders a bit softer instead of stuttering. Users notice stutter; they do not notice slightly softer.

**Why not write your own**

Not because you could not. Because these have been used by thousands of projects and already handle the awkward cases — window resizing, cleaning up, phones with strange screens — that your version will handle only *after* it has broken on somebody's machine.

**One warning about the shiny effects**

There is a package of film-like effects: glow, blur, colour shifts. Each one makes the computer redraw the entire screen an extra time.

A little glow can transform a scene. Four effects stacked usually make it look **worse** and run at **half speed**. Restraint genuinely reads as quality here — the best-looking work usually uses one, carefully.

**Remember:** check the toolbox before you build it. And one effect, not four.`,
    simpleHi: `**Aap jo banane ja rahe ho wo lagbhag sab pehle se maujood hai.**

R3F ke liye ek saathi toolbox hai, aur pehle usi ko uthana ek weekend aur ek dopahar ka farak hai.

**Usme kya hai**

- **Object ghumane ke liye drag.** Aap yahi likhne ja rahe the. Mat likho.
- **"Aap photography studio mein ho."** Ek line, aur aapka scene achanak professional dikhne lagta hai. Aam taur par aapke paas uplabdh sabse bada sudhaar yahi hai.
- **Cheezon ke neeche narm shadow.** Kuch kharch nahi, aksar asli se behtar dikhta hai.
- **Aisa text jo saaf rehta hai** chahe kitna bhi paas zoom karo.
- **3D jagah mein tairte asli page elements** — sach ke buttons, scene mein ek jagah par. Isi tarah aap 3D cheez ko keyboard aur screen reader ke liye use hone layak banate ho, jo akela canvas kabhi nahi ho sakta.
- **Apne aap quality girana** — frame rate gire to wo chupchaap thoda narm banata hai, hakla ne ki jagah. Users ko hakla-hat dikhti hai; halka narm nahi dikhta.

**Apna kyun na likhein**

Isliye nahi ki aap nahi likh sakte. Isliye ki inhe hazaaron projects use kar chuke hain aur ye wo ajeeb case pehle se sambhalte hain — window resize, safai, ajeeb screen wale phone — jinhe aapka roop tabhi sambhalega *jab* wo kisi ki machine par toot chuka hoga.

**Chamakdaar effects ke baare mein ek chetavni**

Film jaise effects ka ek package hai: chamak, dhundhlapan, rang ka badlav. Har ek computer se poori screen ek baar aur banwata hai.

Thodi si chamak scene badal deti hai. Chaar effects ek saath aksar use **bura** bana dete hain aur **aadhi raftaar** par chalate hain. Yahan sanyam sach mein quality lagta hai — sabse achha dikhne wala kaam aksar ek hi use karta hai, dhyan se.

**Yaad rakho:** banane se pehle toolbox dekho. Aur ek effect, chaar nahi.`,
  },

  'three-performance': {
    simple: `**The surprising thing: it is usually not about how detailed your models are.**

Everyone assumes "fewer triangles, faster". Often wrong.

What actually costs you is **how many separate times you ask the graphics card to draw something**. Each request has paperwork attached, and the paperwork is the expensive part.

**So one big complicated object is often faster than a thousand tiny simple ones.** That is genuinely counter-intuitive, and it is why "reduce the polygons" is so often the wrong advice.

**The trick that fixes most of it**

If you need a thousand identical things — trees, chairs, particles — there is a way to say *"draw this one shape, a thousand times, in these thousand places"* as a **single** request.

One request instead of a thousand. This is usually the biggest single win available, and it is not hard.

**The other big one: the memory does not clean itself**

This is the part that catches people from ordinary web work, where you never think about it.

When you throw away a 3D object, **the graphics card keeps holding it**. You have to say, explicitly, "you can let go now".

Forget, and every visit to a 3D page leaves a little behind. Move between a few of them and eventually the tab just dies. Watching the numbers only ever climb is how you spot it.

**And about phones**

A phone is far weaker than your laptop, gets hot and slows itself down on purpose, and is often trying to draw far more dots than your screen is.

**Test on an actual ordinary phone.** Not a simulator, not the newest one. Most people have neither, and the gap between your laptop and a three-year-old phone is enormous.

**Before changing anything: find out what is actually slow.** There are numbers you can read that tell you. Guessing wastes afternoons, and the wrong fix changes nothing at all.

**Remember:** count the requests, not the triangles. And give the memory back.`,
    simpleHi: `**Chaunkane wali baat: ye aksar is baare mein nahi hai ki aapke models kitne tafseeli hain.**

Sab maan lete hain "kam triangles, zyada tez". Aksar galat.

Kharch asal mein ye karta hai ki **aap graphics card se alag-alag kitni baar kuch banane ko kehte ho**. Har guzarish ke saath kaagzi kaam juda hai, aur mehnga wahi kaagzi kaam hai.

**Isliye ek bada mushkil object aksar hazaar chhote simple objects se tez hota hai.** Ye sach mein ulta lagta hai, aur isiliye "polygon kam karo" itni baar galat salah hoti hai.

**Wo tareeka jo zyadatar theek kar deta hai**

Hazaar ek jaisi cheezein chahiye — ped, kursiyan, particles — to ek tareeka hai jisse kaha ja sake *"is ek shakal ko, hazaar baar, in hazaar jagahon par banao"* ek **hi** guzarish mein.

Hazaar ki jagah ek guzarish. Aam taur par uplabdh sabse badi jeet yahi hai, aur ye mushkil nahi hai.

**Doosri badi baat: memory khud saaf nahi hoti**

Yahi wo hissa hai jo aam web kaam se aane walon ko fasata hai, jahan aap kabhi iske baare mein sochte hi nahi.

Jab aap 3D object phenkte ho, **graphics card use pakde rehta hai**. Aapko saaf-saaf kehna padta hai "ab chhod do".

Bhoolo, aur 3D page ki har visit thoda peeche chhod jati hai. Kuch ke beech ghoomo aur aakhir mein tab bas mar jata hai. Numbers ka sirf badhte jana hi ise pakadne ka tareeka hai.

**Aur phone ke baare mein**

Phone aapke laptop se kahin kamzor hai, garam hokar jaan-boojh kar dheema ho jata hai, aur aksar aapki screen se kahin zyada bindu banane ki koshish kar raha hota hai.

**Asli, aam phone par test karo.** Simulator par nahi, sabse naye par nahi. Zyadatar logon ke paas dono nahi hain, aur aapke laptop aur teen saal purane phone ka faasla bahut bada hai.

**Kuch badalne se pehle: pata karo sach mein dheema kya hai.** Aise numbers hain jo aap padh sakte ho aur wo bata dete hain. Andaza dopaharein barbaad karta hai, aur galat hal kuch bhi nahi badalta.

**Yaad rakho:** guzarishein gino, triangles nahi. Aur memory wapas do.`,
  },

  'three-shaders': {
    simple: `**Two tiny programs that run on the graphics card itself.**

Every surface you have used already had these — you were just using ready-made ones. Writing your own means taking the wheel.

**One runs for every corner** of a shape. It can move those corners: waves, ripples, wind in grass.

**One runs for every dot on the screen.** It picks the colour of that dot.

**And the difference in scale is the whole lesson.**

A cube has about two dozen corners. A full screen is **two million** dots — and both of those happen every frame, sixty times a second.

So anything you can work out at the corners instead of at every dot, **do it at the corners**. Two dozen calculations instead of two million. That instinct is most of what makes shader work fast or slow.

**What it is like to write**

Fussy. The language insists you write "1.0" rather than "1", and that one rule causes most of the errors on your first day.

And there is **no way to print anything**. No console, no stepping through. You debug by **making the screen a colour** — take the value you are wondering about, paint it on screen, and look at it. That is genuinely the technique.

**Two honest things**

**Start by borrowing, not building.** You can inject a little of your own code into a ready-made surface and keep all the lighting you would otherwise have to rewrite. Writing lighting from scratch is a large job with very little reward.

**And they are more seductive than useful.** Shaders are the most impressive-looking corner of this subject and usually not what a project needs. Good lighting, decent materials and a touch of glow beat a hand-written shader in most real work, at a fraction of the effort.

Learn them for the things nothing else can do. Not because a scene looks unfinished without one.

**Remember:** corners are cheap, dots are expensive. And you debug by painting.`,
    simpleHi: `**Do chhote program jo khud graphics card par chalte hain.**

Jo bhi satah aapne use ki hai usme ye pehle se the — aap bas banaye-banaye use kar rahe the. Apna likhne ka matlab hai steering apne haath mein lena.

**Ek har kone par chalta hai** shakal ke. Wo un konon ko hila sakta hai: lehrein, hilkore, ghaas mein hawa.

**Ek screen ke har bindu par chalta hai.** Wo us bindu ka rang chunta hai.

**Aur paimane ka farak hi poora sabak hai.**

Cube mein lagbhag do darjan kone hain. Poori screen **bees lakh** bindu hai — aur ye dono har frame hote hain, ek second mein saath baar.

Isliye jo bhi aap har bindu ki jagah konon par nikaal sako, **konon par nikalo**. Bees lakh ki jagah do darjan hisaab. Yahi soch shader kaam ko tez ya dheema banane ka zyadatar hissa hai.

**Ise likhna kaisa lagta hai**

Nakhrela. Bhasha zid karti hai ki aap "1" ki jagah "1.0" likho, aur pehle din ki zyadatar galtiyan isi ek niyam se aati hain.

Aur **kuch chhaapne ka koi tareeka nahi**. Na console, na kadam-dar-kadam. Aap **screen ko rang bana kar** debug karte ho — jis value ke baare mein soch rahe ho use screen par paint karo aur dekho. Sach mein tareeka yahi hai.

**Do imaandar baatein**

**Banane se pehle udhaar lo.** Aap banayi-banayi satah mein apna thoda code ghusa sakte ho aur wo poori lighting rakh sakte ho jise warna dobara likhna padta. Lighting shuru se likhna bada kaam hai aur inaam bahut kam.

**Aur ye kaam se zyada lubhavane hain.** Shaders is vishay ka sabse prabhavshali dikhne wala kona hain aur aksar wo nahi jo project ko chahiye. Achhi lighting, theek materials aur thodi chamak zyadatar asli kaam mein haath se likhe shader ko haraate hain, mehnat ke bahut kam hisse mein.

Inhe un cheezon ke liye seekho jo aur kuch nahi kar sakta. Isliye nahi ki inke bina scene adhoora lagta hai.

**Yaad rakho:** kone saste hain, bindu mehnge. Aur aap paint karke debug karte ho.`,
  },

  'three-production': {
    simple: `**Working on your laptop is about half the job.**

**The files are enormous.** A 3D page can be twenty times heavier than a normal one. On a phone connection, people simply leave before it arrives. Squash everything, load nothing until it is actually needed, and set yourself a size limit that the build refuses to exceed — otherwise it creeps up quietly with every addition.

**Phones are the real audience.** Weaker, hotter, and trying to draw far more dots. Test on an ordinary phone, not the newest one and not a simulator.

**And here is the part most 3D work gets wrong**

**A 3D canvas is invisible to a screen reader.** Not "hard to use" — genuinely not there. Nothing inside it can be reached by keyboard either.

So if the only way to see a price, a spec or a feature is by dragging a 3D model around, then for some people **that information does not exist**.

The fix is not clever: put the same information in ordinary page elements as well. A list, some buttons, a description. It takes an hour and it decides whether some people can use your product at all.

**Also: some people get motion sickness** from things that move continuously. Browsers let someone say "please, less movement" — listen for it and stop the spinning. That is a health thing, not a preference.

**Always have a plan for when it does not work.** Some machines cannot do 3D at all. Some lose it halfway through. Show a picture and a sentence — a blank grey rectangle with no explanation is the worst outcome available.

**And the question worth asking honestly**

**Does the 3D actually help the person, or does it help the demo?**

A configurator where you choose a colour and see it — that earns its cost. A rotating logo on the homepage costs fifteen megabytes, punishes every phone user, and helps nobody.

**Remember:** the scene working is half the job. The other half is everyone else being able to use it.`,
    simpleHi: `**Aapke laptop par chalna lagbhag aadha kaam hai.**

**Files bahut badi hain.** 3D page aam page se bees guna bhaari ho sakta hai. Phone connection par log pahunchne se pehle hi chale jate hain. Sab kuch dabao, zaroorat padne tak kuch load mat karo, aur apne liye ek size ki seema rakho jise build paar hi na karne de — warna wo har jodne ke saath chupchaap badhti rehti hai.

**Asli sunne wale phone hain.** Kamzor, garam, aur kahin zyada bindu banane ki koshish karte hue. Aam phone par test karo, sabse naye par nahi aur simulator par nahi.

**Aur yahan wo hissa hai jise zyadatar 3D kaam galat karta hai**

**Screen reader ke liye 3D canvas adrishya hai.** "Use karna mushkil" nahi — sach mein hai hi nahi. Uske andar kuch bhi keyboard se pahunch mein nahi.

Isliye agar daam, tafseel ya feature dekhne ka ekmatra rasta 3D model ghumana hai, to kuch logon ke liye **wo jaankari hai hi nahi**.

Hal chalak nahi hai: wahi jaankari aam page elements mein bhi rakho. Ek list, kuch buttons, ek hulia. Ismein ek ghanta lagta hai aur ye tay karta hai ki kuch log aapka product use kar sakte hain ya nahi.

**Aur: kuch logon ko lagatar hilti cheezon se matli aati hai.** Browser kisi ko kehne dete hain "kam hilna, please" — use suno aur ghumna rok do. Ye sehat ki baat hai, pasand ki nahi.

**Jab ye kaam na kare uski yojna hamesha rakho.** Kuch machines 3D kar hi nahi sakti. Kuch beech mein kho deti hain. Ek tasveer aur ek vaakya dikhao — bina safai ke khaali slate rang ka chaukor sabse bura natija hai.

**Aur wo sawaal jo imaandari se poochhna chahiye**

**Kya 3D sach mein insaan ke kaam aa raha hai, ya demo ke?**

Aisa configurator jisme aap rang chuno aur dekho — wo apni keemat kamata hai. Homepage par ghoomta logo pandrah megabyte leta hai, har phone user ko sazaa deta hai, aur kisi ke kaam nahi aata.

**Yaad rakho:** scene ka chalna aadha kaam hai. Doosra aadha ye hai ki baaki sab use use kar sakein.`,
  },
};

export const TRICKS_THREEJS: Record<string, TopicTricks> = {
  'three-what-is-webgl': {
    tricks: `### ⚡ "Few clever workers vs thousands of simple ones"

CPU: a handful of powerful cores. GPU: thousands of weak ones, all doing the same thing at once. A screen is two million pixels needing the same small calculation — that is exactly the GPU's shape.

### 🧱 "Three.js is not a game engine"

It renders. No physics, no audio, no editor, no asset pipeline. Those are separate libraries you assemble.

**Say it:** *"It draws. That is the job."*

Knowing this in advance answers most "why does Three.js not have X" questions before you ask them.

### ⏱️ "16 milliseconds, every frame"

At 60fps that is the entire budget — updates, physics, and the render itself. Browser overhead takes some, so treat **~10ms** as yours.

**The reframe:** not "is the page fast" but **"did this frame finish in time"**. Miss it and users see stutter, which people notice far more readily than slowness.

### 📱 "Cap the pixel ratio"

A 3x phone renders **nine times** the pixels of a 1x display. This is the single most common cause of terrible mobile performance, and the fix is one line.

**Why this sticks:** "did this frame finish in time" is *a different question from the one you are used to asking*. Replacing a familiar question with a better one changes how you look at every subsequent problem in the category.`,
    tricksHi: `### ⚡ "Kuch chatur karmchari बनाम hazaaron simple"

CPU: kuch shaktishali cores. GPU: hazaaron kamzor, sab ek saath wahi kaam karte hue. Screen bees lakh pixel hai jinhe wahi chhota hisaab chahiye — GPU ki theek yahi shakal hai.

### 🧱 "Three.js game engine nahi hai"

Ye banata hai. Na physics, na audio, na editor, na asset pipeline. Wo alag libraries hain jo aap jodte ho.

**Bolo:** *"Ye banata hai. Bas yahi kaam hai."*

Ye pehle se jaanna "Three.js mein X kyun nahi" wale zyadatar sawaal poochhne se pehle hi hal kar deta hai.

### ⏱️ "16 milliseconds, har frame"

60fps par yahi poora budget hai — updates, physics, aur khud render. Browser ka kharch bhi ismein se hai, isliye **~10ms** apna maano.

**Nayi soch:** "page tez hai kya" nahi balki **"ye frame waqt par khatam hua kya"**. Chook jao to users ko hakla-hat dikhti hai, jo logon ko dheemapan se kahin jaldi dikhti hai.

### 📱 "Pixel ratio baandho"

3x phone 1x display se **nau guna** pixel banata hai. Mobile par bhayanak performance ki sabse aam wajah yahi hai, aur hal ek line ka hai.

**Ye kyun tikta hai:** "ye frame waqt par khatam hua kya" *us sawaal se alag hai jo aap poochhne ke aadi ho*. Jaane-pehchane sawaal ki jagah behtar sawaal rakh dena is kshetra ki har agli samasya dekhne ka tareeka badal deta hai.`,
  },

  'three-scene-camera-renderer': {
    tricks: `### 🎬 "Stage, camera, projector"

Scene, camera, renderer. Miss any one and you see nothing.

### 👻 "Near and far are a hard cutoff"

Anything closer than \`near\` or further than \`far\` is **not drawn at all** — not dim, not small, absent.

**This is the number one cause of "my object is invisible."**

### ⚡ "Tight near/far, or z-fighting"

Depth precision is spread across that range. Stretch it from 0.0001 to a million and surfaces flicker against each other because the renderer cannot tell which is in front.

**Say it:** *"Wide range, flickering surfaces."*

### 🔍 The "nothing renders" checklist

**"Render? Range? Pointing? Light? Behind?"**

1. Did you call render?
2. Inside near/far?
3. Camera pointing at it? (default looks down **−Z**)
4. Any light? StandardMaterial is black without one.
5. Behind the camera, or exactly on it?

Five checks, and almost every beginner problem is one of them. **Running the list beats staring at the code.**

### 🖼️ "Resize is three things"

aspect, \`updateProjectionMatrix()\`, \`setSize\`. People forget the middle one, and resizing silently distorts everything.

**Why this sticks:** the five-item checklist is *a procedure, not knowledge*. Procedures get executed under frustration; facts get forgotten exactly when you are frustrated enough to need them.`,
    tricksHi: `### 🎬 "Stage, camera, projector"

Scene, camera, renderer. Koi ek chhoote to kuch nahi dikhta.

### 👻 "Near aur far pakki kataai hai"

\`near\` se paas ya \`far\` se door ki cheez **banti hi nahi** — dhundhli nahi, chhoti nahi, gayab.

**"Mera object dikh nahi raha" ki number ek wajah yahi hai.**

### ⚡ "Tang near/far, warna z-fighting"

Depth ki precision us range par phailti hai. Use 0.0001 se das lakh tak khinch do aur satahein jhilmilane lagti hain kyunki renderer bata hi nahi pata ki aage kaun hai.

**Bolo:** *"Chaudi range, jhilmilaati satahein."*

### 🔍 "Kuch nahi dikh raha" ki suchi

**"Render? Range? Ishara? Light? Peeche?"**

1. Render bulaya tha?
2. Near/far ke andar hai?
3. Camera uski taraf hai? (default **−Z** ki taraf dekhta hai)
4. Koi light? StandardMaterial bina light ke kaala hai.
5. Camera ke peeche, ya theek us par?

Paanch jaanch, aur lagbhag har shuruaati samasya inme se ek hai. **Suchi chalana code ghoorne se behtar hai.**

### 🖼️ "Resize teen cheezein hain"

aspect, \`updateProjectionMatrix()\`, \`setSize\`. Log beech wali bhool jate hain, aur resize chupchaap sab bigaad deta hai.

**Ye kyun tikta hai:** paanch cheezon ki suchi *ek prakriya hai, gyaan nahi*. Prakriyaayein khijh mein chalayi jati hain; tathya theek tab bhool jate hain jab aap itne khijhe ho ki unki zaroorat ho.`,
  },

  'three-mesh-geometry-material': {
    tricks: `### 🧍 "Shape plus skin"

Geometry is the shape, material is the surface, mesh is the two together. Everything on screen is that pair.

### ⚫ "Black means no light"

\`MeshStandardMaterial\` with nothing shining on it renders **pure black**. It is not broken — that is what unlit looks like.

**Every single person hits this once.**

### 🎚️ "Metalness is 0 or 1"

Real materials are metal or they are not. Intermediate values are almost always a mistake.

Roughness is the continuous one: 0 = mirror, 1 = chalk.

### ♻️ "One geometry, one material, a thousand meshes"

Creating a new material per mesh multiplies draw calls for no benefit whatsoever. Share them.

**Say it:** *"Share the skin."*

### 🫥 "alphaTest for cutouts, transparent for glass"

\`transparent: true\` moves the object to a separate sorted pass, where overlapping transparent surfaces can sort wrongly.

A leaf or a fence only needs a **hard cutout** — \`alphaTest\` keeps it in the opaque pass and sidesteps the sorting problem entirely.

**Why this sticks:** "black means no light" attaches a *symptom you will definitely see* to its cause. Symptom-first hooks are retrieved at exactly the moment you need them, because the symptom is what triggers the search.`,
    tricksHi: `### 🧍 "Shakal aur khaal"

Geometry shakal hai, material satah, mesh dono ka mel. Screen par sab kuch yahi jodi hai.

### ⚫ "Kaala matlab light nahi"

Jis \`MeshStandardMaterial\` par kuch chamak hi nahi raha wo **poora kaala** banta hai. Wo toota nahi — bina light ke aisa hi dikhta hai.

**Har ek insaan ko ye ek baar milta hai.**

### 🎚️ "Metalness 0 ya 1"

Asli materials ya metal hain ya nahi. Beech ki values lagbhag hamesha galti hoti hain.

Roughness lagatar badalne wali hai: 0 = sheesha, 1 = chalk.

### ♻️ "Ek geometry, ek material, hazaar meshes"

Har mesh ke liye naya material banana bina kisi faayde ke draw calls gunna kar deta hai. Inhe saanjha karo.

**Bolo:** *"Khaal saanjhi karo."*

### 🫥 "Cutout ke liye alphaTest, kaanch ke liye transparent"

\`transparent: true\` object ko alag sorted pass mein bhej deta hai, jahan ek doosre par chadhti transparent satahein galat sort ho sakti hain.

Patte ya baad ko sirf **sakht cutout** chahiye — \`alphaTest\` use opaque pass mein rakhta hai aur sorting ki samasya poori tarah bacha leta hai.

**Ye kyun tikta hai:** "kaala matlab light nahi" ek *aisi nishaani ko jo aapko pakka dikhegi* uski wajah se jod deta hai. Nishaani se shuru hone wale hook theek us pal yaad aate hain jab chahiye, kyunki khoj nishaani se hi shuru hoti hai.`,
  },

  'three-transforms': {
    tricks: `### 📦 "Boxes inside boxes"

Every transform is relative to the parent. Move the outer group and everything inside follows — exactly like nested DOM.

**Build a solar system with nested groups, not orbit maths.**

### 🔢 "Radians, not degrees"

A quarter turn is \`Math.PI / 2\`, not 90. Write 90 and your object spins about fourteen times.

**Everybody does this once.**

### 🔒 "Three numbers lose a direction"

Rotate 90° on one axis and two others can align — now you have lost a degree of freedom and rotation goes strange. That is **gimbal lock**, and it is a property of Euler angles, not a Three.js bug.

**Quaternions use four numbers and do not have the problem.**

**Say it:** *"Euler to set, quaternion to spin."*

### ⏳ "Moved it? The world position is still last frame's"

Matrices update once per frame. Change a transform and read the world position in the same breath and you get the **old** value.

\`updateMatrixWorld()\` forces it. Knowing this exists saves a genuinely confusing hour.

**Why this sticks:** "Euler to set, quaternion to spin" is *four words that resolve the actual decision*. The theory behind gimbal lock is interesting; the four words are what you need at the moment you are choosing.`,
    tricksHi: `### 📦 "Dibbe ke andar dibbe"

Har transform parent ke sapeksh hai. Bahar wala group hilao aur andar ka sab saath aata hai — bilkul nested DOM jaisa.

**Saur mandal nested groups se banao, orbit ke ganit se nahi.**

### 🔢 "Radians, degrees nahi"

Chauthai ghumav \`Math.PI / 2\` hai, 90 nahi. 90 likho aur object lagbhag chaudah baar ghoom jata hai.

**Har koi ye ek baar karta hai.**

### 🔒 "Teen numbers ek disha kho dete hain"

Ek axis par 90° ghumao aur doosre do ek line mein aa sakte hain — ab ek aazadi chali gayi aur rotation ajeeb ho gaya. Ye **gimbal lock** hai, aur ye Euler angles ka gun hai, Three.js ka bug nahi.

**Quaternions chaar numbers use karte hain aur unme ye samasya hai hi nahi.**

**Bolo:** *"Set karne ko Euler, ghumane ko quaternion."*

### ⏳ "Hila diya? World position abhi bhi pichhle frame ki hai"

Matrices har frame ek baar update hoti hain. Transform badal kar usi saans mein world position padho to **purani** value milti hai.

\`updateMatrixWorld()\` use zabardasti karwata hai. Iska hona jaanna sach mein uljhane wala ek ghanta bacha leta hai.

**Ye kyun tikta hai:** "set karne ko Euler, ghumane ko quaternion" *chaar shabd hain jo asli faisla suljha dete hain*. Gimbal lock ka siddhant dilchasp hai; chunte waqt aapko wo chaar shabd chahiye.`,
  },

  'three-lights-and-shadows': {
    tricks: `### 🌍 "An environment beats more lights"

For PBR materials, metals and glossy surfaces **reflect their surroundings**. With no environment they look flat no matter how many lights you add.

Load an HDR, set \`scene.environment\`, and the scene often looks dramatically better with **fewer** lights.

**Say it:** *"Beginners add lights. The answer was an environment."*

Usually the single biggest visual improvement available, and it is one line.

### 4️⃣ "Shadows need four flags, and fail silently"

renderer, light, caster, receiver. Miss one and there is **no shadow and no error**.

### 💰 "Each shadow light is an extra render"

The scene is drawn again from the light's point of view. That is why shadows are the first thing to cut when frames drop.

### 🩹 "Acne vs peter-panning"

Stripes across surfaces → raise \`shadow.bias\`. Too much bias → the shadow **detaches** from the object.

**Say it:** *"Too little bias stripes it, too much floats it."*

### 🎯 "Blocky shadows? Tighten the shadow camera"

A frustum far larger than the scene spreads resolution thin. This one adjustment fixes most bad-looking shadows.

### ✨ "A blurred circle is often better"

A fake contact shadow costs almost nothing and frequently looks better than a real low-resolution shadow map. Many shipped scenes use exactly this.

**Why this sticks:** "beginners add lights, the answer was an environment" *names the wrong instinct before giving the right one*. Correcting a specific mistaken reflex is more durable than adding a fact beside it.`,
    tricksHi: `### 🌍 "Environment zyada lights se jeet ta hai"

PBR materials ke liye metals aur chamakdaar satahein **apne aas-paas ko darshati hain**. Bina environment ke wo chapti dikhti hain, chahe kitni bhi lights jodo.

HDR load karo, \`scene.environment\` set karo, aur scene aksar **kam** lights ke saath kahin behtar dikhta hai.

**Bolo:** *"Shuruaat mein log lights jodte hain. Jawab environment tha."*

Aam taur par uplabdh sabse bada drishya sudhaar, aur ek line ka.

### 4️⃣ "Shadows ko chaar flag chahiye, aur ye chupchaap fail hote hain"

renderer, light, caster, receiver. Ek chhoote to **na shadow, na error**.

### 💰 "Har shadow light ek extra render hai"

Scene light ki nazar se dobara banaya jata hai. Isiliye frames girne par sabse pehle shadows kaate jate hain.

### 🩹 "Acne बनाम peter-panning"

Satahon par dhaariyan → \`shadow.bias\` badhao. Bahut zyada bias → shadow object se **alag** ho jata hai.

**Bolo:** *"Kam bias dhaariyan deta hai, zyada use tairaa deta hai."*

### 🎯 "Bhadde shadows? Shadow camera kaso"

Scene se kahin bada frustum resolution patli phaila deta hai. Yahi ek badlav zyadatar bure shadows theek kar deta hai.

### ✨ "Dhundhla gola aksar behtar hai"

Nakli contact shadow lagbhag kuch nahi leta aur aksar asli kam-resolution shadow map se behtar dikhta hai. Bahut se ship hue scenes theek yahi use karte hain.

**Ye kyun tikta hai:** "shuruaat mein log lights jodte hain, jawab environment tha" *sahi batane se pehle galat aadat ka naam leta hai*. Ek khaas galat aadat theek karna, uske bagal mein tathya jodne se zyada tikau hai.`,
  },

  'three-animation-loop': {
    tricks: `### ⏱️ "Per second, not per frame"

\`\`\`js
rotation.y += 0.01;          // ❌ speed depends on the monitor
rotation.y += 1.5 * delta;   // ✅ same everywhere
\`\`\`

A 144Hz monitor runs the first version **2.4x faster** than yours. And you will never see it, because your screen is 60Hz.

**Say it:** *"Invisible on your machine, obvious on theirs."*

That is why this ships so often.

### 🚧 "Clamp the delta"

Return from a background tab and delta could be thirty seconds. Anything integrating over it teleports across the scene.

Cap it around 0.1.

### 🎬 "Camera before render"

Update the camera **before** drawing, or you are permanently showing where it was last frame — a small lag that is maddening to diagnose.

### 📉 "Steady beats fast"

A solid 30fps feels better than a 60 that regularly drops to 45. **Consistency is the thing people actually perceive**, which is why adaptive quality works so well.

**Why this sticks:** "invisible on your machine, obvious on theirs" *explains why the bug survives review*. Knowing why you cannot see a bug is what makes you check for it deliberately.`,
    tricksHi: `### ⏱️ "Per second, per frame nahi"

\`\`\`js
rotation.y += 0.01;          // ❌ raftaar monitor par nirbhar
rotation.y += 1.5 * delta;   // ✅ har jagah wahi
\`\`\`

144Hz monitor pehla roop aapse **2.4 guna tez** chalata hai. Aur aapko kabhi dikhega nahi, kyunki aapki screen 60Hz hai.

**Bolo:** *"Aapki machine par adrishya, unki par saaf."*

Isiliye ye itni baar ship ho jata hai.

### 🚧 "Delta ko baandho"

Background tab se laut o aur delta tees second ho sakta hai. Us par jodne wali har cheez scene ke paar kood jati hai.

Ise lagbhag 0.1 par baandho.

### 🎬 "Camera render se pehle"

Camera ko banane se **pehle** update karo, warna aap hamesha dikha rahe ho ki wo pichhle frame kahan tha — ek chhota lag jo pakadna pagal kar deta hai.

### 📉 "Sthir, tez se behtar"

Sthir 30fps us 60 se behtar lagta hai jo baar-baar 45 par girta ho. **Log asal mein ek-jaisapan mehsoos karte hain**, aur isiliye adaptive quality itna achha chalta hai.

**Ye kyun tikta hai:** "aapki machine par adrishya, unki par saaf" *samjhata hai ki ye bug review se kyun nikal jata hai*. Ye jaanna ki aapko bug kyun nahi dikh raha, hi aapse jaan-boojh kar jaanch karwata hai.`,
  },

  'three-textures-and-uv': {
    tricks: `### 🏷️ "Some of these images are not images"

Colour maps (albedo, emissive) are **colours** → sRGB.
Normal, roughness, metalness, AO are **numbers wearing an image** → **not** sRGB.

Get it wrong and everything looks subtly, unnameably off — and you will never spot it, you will just think your scene looks a bit wrong.

**Say it:** *"Colour gets sRGB. Data does not."*

### 🧱 "Normal maps lie to the light"

They add no geometry at all. They tell the lighting the surface faces a different way, and your eye completely falls for it.

**Best value in the whole subject:** a flat wall that looks like rough brick, for free.

### 💾 "JPEG is small on the wire, huge in memory"

It decompresses to full size on the GPU. **KTX2 stays compressed in GPU memory** — that distinction is the one people miss.

### 📏 "1K is usually enough"

A 4K texture is ~64MB in GPU memory for **one** map on **one** object. Nobody can tell on most objects.

### 🗑️ "Textures do not free themselves"

\`dispose()\` explicitly. This is the leak that appears when navigating between scenes.

**Why this sticks:** "you will never spot it" is *unusual to say about a bug*, and that admission is what makes people check the colour space deliberately rather than trusting their eyes.`,
    tricksHi: `### 🏷️ "Inme se kuch images, images hain hi nahi"

Colour maps (albedo, emissive) **rang** hain → sRGB.
Normal, roughness, metalness, AO **image ka bhes pehne numbers** hain → sRGB **nahi**.

Galat hua to sab halka, naam na dene layak galat dikhta hai — aur aapko kabhi dikhega nahi, aapko bas lagega ki scene thoda ajeeb hai.

**Bolo:** *"Rang ko sRGB. Data ko nahi."*

### 🧱 "Normal maps light se jhoot bolte hain"

Wo bilkul koi geometry nahi jodte. Wo lighting ko batate hain ki satah doosri taraf mooh kiye hai, aur aapki aankh poori tarah dhokha kha jati hai.

**Poore vishay mein sabse achha sauda:** chapti deewar jo khurdari eent dikhti hai, muft mein.

### 💾 "JPEG taar par chhota, memory mein vishaal"

Wo GPU par poore size mein khul jata hai. **KTX2 GPU memory mein bhi compressed rehta hai** — yahi farak log chhod dete hain.

### 📏 "1K aksar kaafi hai"

4K texture **ek** object ke **ek** map ke liye GPU memory mein ~64MB hai. Zyadatar objects par kisi ko farak nahi dikhta.

### 🗑️ "Textures khud ko khaali nahi karte"

Saaf-saaf \`dispose()\`. Scenes ke beech ghoomne par yahi leak dikhta hai.

**Ye kyun tikta hai:** "aapko kabhi dikhega nahi" *kisi bug ke baare mein kehna asaamanya hai*, aur wahi sweekarokti logon se aankhon par bharosa karne ki jagah colour space jaan-boojh kar jaanchwati hai.`,
  },

  'three-loading-models': {
    tricks: `### 📦 "glTF, and prefer .glb"

The JPEG of 3D. The single-file \`.glb\` version means one request and no missing-texture paths.

### 🗜️ "50MB uncompressed, 2MB compressed"

Run every model through gltf-transform or gltfpack. **This is a build step, not an optimisation** — and skipping it is the difference between loading in one second and twelve.

**Say it:** *"Squash it before you ship it."*

### 📊 "A bar, not a spinner"

A spinner says "wait". A bar says "wait about this long". That difference decides whether people stay, and 3D assets are large enough that it matters a great deal.

### 🗑️ "Removing from the scene frees nothing"

Traverse and dispose geometries, materials and textures. **This is the classic leak** in single-page apps with several 3D views — navigate a few times and the tab dies.

R3F handles this for objects it created. Not for anything you made imperatively.

### 💥 "The GPU can drop your context"

A driver update or a mobile app switch and everything vanishes. Listen for \`webglcontextlost\` — a blank canvas with no explanation is the worst outcome.

### 📐 "glTF is metres"

Models often import 100x too large or small. Check scale and pivot before debugging anything else.

**Why this sticks:** "50MB uncompressed, 2MB compressed" is *a 25x ratio in concrete numbers*. Ratios that large are self-justifying — nobody argues with the build step once they have seen the two figures.`,
    tricksHi: `### 📦 "glTF, aur .glb hi chuno"

3D ka JPEG. Ek-file wala \`.glb\` matlab ek request aur texture ke raste ki koi samasya nahi.

### 🗜️ "Bina compress 50MB, compress karke 2MB"

Har model gltf-transform ya gltfpack se guzaro. **Ye build ka kadam hai, optimisation nahi** — aur ise chhodna ek second aur baarah second mein load hone ka farak hai.

**Bolo:** *"Bhejne se pehle dabao."*

### 📊 "Bar, spinner nahi"

Spinner kehta hai "ruko". Bar kehti hai "lagbhag itna ruko". Wahi farak tay karta hai ki log rukenge ya nahi, aur 3D assets itne bade hain ki ye bahut matter karta hai.

### 🗑️ "Scene se hataane se kuch khaali nahi hota"

Traverse karke geometries, materials aur textures dispose karo. Kai 3D views wale single-page apps mein **yahi classic leak hai** — kuch baar ghoomo aur tab mar jata hai.

R3F apne banaye objects ke liye ye sambhalta hai. Jo aapne imperative tareeke se banaya uske liye nahi.

### 💥 "GPU aapka context chhod sakta hai"

Driver update ya mobile par app badalna, aur sab gayab. \`webglcontextlost\` suno — bina safai ke khaali canvas sabse bura natija hai.

### 📐 "glTF meters mein hai"

Models aksar 100 guna bade ya chhote import hote hain. Kuch aur debug karne se pehle scale aur pivot jaancho.

**Ye kyun tikta hai:** "bina compress 50MB, compress karke 2MB" *thos numbers mein 25 guna ka anupaat* hai. Itne bade anupaat khud apni safai hain — do number dekhne ke baad koi build step par behes nahi karta.`,
  },

  'three-raycasting': {
    tricks: `### 🔦 "Fire a beam from the eye through the cursor"

Whatever it hits first is what they clicked. And it tells you the **exact point**, not just the object — enough to place a marker precisely where they tapped.

### 🐌 "Once per frame, not once per mousemove"

Mousemove fires far more often than you render. Raycasting the whole scene on every event tests every triangle you own, hundreds of times a second, for a picture that changes sixty times.

**Two one-line fixes:** throttle to one raycast per frame, and pass an **explicit list** of clickable objects rather than the whole scene.

**Say it:** *"Per frame, and only the clickable ones."*

### ♿ "A canvas is invisible to a screen reader"

Not badly described — **not there**. Nothing inside is keyboard reachable either.

So if a spec is only visible by rotating a model, some people **cannot access it at all**.

**The fix:** mirror every meaningful interaction in real DOM — a list, buttons, a description. Not polish; the version that works.

### 🔄 "Groups need \`recursive: true\`"

Otherwise it tests only the group itself and hits nothing — the confusing "my clicks do nothing" bug.

**Why this sticks:** "not badly described — not there" *corrects a wrong assumption in five words*. People assume a canvas is merely poor for accessibility; knowing it is absent changes what they build.`,
    tricksHi: `### 🔦 "Aankh se cursor se hokar ek kiran chhodo"

Wo pehle jisse takrati hai wahi click hua. Aur wo **theek bindu** batati hai, sirf object nahi — itna kaafi ki marker bilkul wahin lag jaye jahan tap hua.

### 🐌 "Har frame ek baar, har mousemove par nahi"

Mousemove aapke render se kahin zyada baar chalta hai. Har event par poore scene par raycast karna aapke har triangle ko, ek second mein sau baar jaanchta hai — us tasveer ke liye jo saath baar badalti hai.

**Do ek-line ke hal:** har frame ek raycast par throttle karo, aur poore scene ki jagah click hone layak objects ki **saaf list** bhejo.

**Bolo:** *"Har frame, aur sirf click hone layak."*

### ♿ "Screen reader ke liye canvas adrishya hai"

Bura bataya gaya nahi — **hai hi nahi**. Uske andar kuch bhi keyboard ki pahunch mein nahi.

Isliye agar koi tafseel sirf model ghuma kar dikhti hai, to kuch log us tak **pahunch hi nahi sakte**.

**Hal:** har matlab wale interaction ko asli DOM mein bhi rakho — list, buttons, hulia. Chamak nahi; wo roop jo sach mein chalta hai.

### 🔄 "Groups ko \`recursive: true\` chahiye"

Warna wo sirf group ko jaanchta hai aur kuch nahi lagta — "mere click kuch nahi karte" wala uljhane wala bug.

**Ye kyun tikta hai:** "bura bataya gaya nahi — hai hi nahi" *paanch shabdon mein galat maanyata theek karta hai*. Log maante hain ki canvas accessibility ke liye bas kamzor hai; ye jaanna ki wo hai hi nahi, unke banaye hue ko badal deta hai.`,
  },

  'r3f-basics': {
    tricks: `### ⚛️ "Same objects, JSX syntax"

\`<mesh>\` creates a real \`THREE.Mesh\`. R3F is a React **renderer**, not a wrapper — there is no performance penalty.

**Free gift:** automatic disposal on unmount, which removes the most common Three.js memory leak.

### 🚫 "Never setState per frame"

\`\`\`jsx
useFrame(() => setY(v => v + 1));   // ❌ 60 full re-renders per second
useFrame(() => { ref.current.rotation.y += d; });  // ✅ no re-render at all
\`\`\`

\`useFrame\` runs **outside** React's render cycle, so mutating a ref there is free. Setting state 60 times a second runs the entire reconciliation pipeline every frame.

**This is the single most common R3F performance mistake.**

### 🧠 The mental split

**"State for what the user did. The frame loop for what is moving."**

Occasional changes → React state. Per-frame changes → refs and direct mutation.

### 🚪 "Canvas is its own React root"

Context from outside does not automatically cross in. Providers often need repeating inside — which surprises everyone the first time state comes back undefined.

**Why this sticks:** "state for what the user did, the frame loop for what is moving" is *a sorting rule you apply constantly*. Rules used many times a day are rehearsed by use rather than by memory.`,
    tricksHi: `### ⚛️ "Wahi objects, JSX syntax"

\`<mesh>\` asli \`THREE.Mesh\` banata hai. R3F React **renderer** hai, wrapper nahi — koi performance ka nuksaan nahi.

**Muft tohfa:** unmount par apne aap disposal, jo Three.js ka sabse aam memory leak hata deta hai.

### 🚫 "Har frame setState kabhi nahi"

\`\`\`jsx
useFrame(() => setY(v => v + 1));   // ❌ ek second mein 60 poore re-render
useFrame(() => { ref.current.rotation.y += d; });  // ✅ koi re-render nahi
\`\`\`

\`useFrame\` React ke render cycle ke **bahar** chalta hai, isliye wahan ref badalna muft hai. Ek second mein 60 baar state set karna har frame poori reconciliation chalata hai.

**R3F ki sabse aam performance galti yahi hai.**

### 🧠 Soch ka batwara

**"State us ke liye jo user ne kiya. Frame loop us ke liye jo hil raha hai."**

Kabhi-kabhi ke badlav → React state. Har frame ke badlav → refs aur seedha badlav.

### 🚪 "Canvas apna React root hai"

Bahar ka context apne aap andar nahi jata. Providers ko aksar andar dohrana padta hai — aur pehli baar jab state undefined aati hai to ye sabko chaunkata hai.

**Ye kyun tikta hai:** "state us ke liye jo user ne kiya, frame loop us ke liye jo hil raha hai" *ek chhantne ka niyam hai jo aap lagatar lagate ho*. Din mein kai baar use hone wale niyam yaad se nahi, istemal se dohraye jate hain.`,
  },

  'r3f-ecosystem': {
    tricks: `### 🧰 "Check drei before you build it"

Orbit controls, environments, contact shadows, sharp text, DOM in 3D space, adaptive quality — all already there.

Not because you could not write them, but because these handle resize, disposal and odd device pixel ratios that **your version will handle only after it has broken on someone's machine**.

### 🌍 "\`<Environment preset="studio" />\`"

One line, and usually the single biggest visual improvement available.

### 🏷️ "\`<Html />\` is the accessibility answer"

Real DOM positioned in 3D space — actual buttons, reachable by keyboard and screen readers. The canvas alone never can be.

### 📉 "Adaptive DPR beats dropping frames"

Render slightly softer rather than stuttering. **Users notice stutter; they do not notice softer pixels.**

### ✨ "One effect, not four"

Every post-processing effect is an extra full-screen pass. A little bloom transforms a scene; four stacked usually make it look **worse** at **half** the frame rate.

**Say it:** *"Restraint reads as quality."*

### 🧊 "Simple colliders"

A box or capsule around a complex mesh is dramatically cheaper than a trimesh collider, and for most interactions indistinguishable.

**Why this sticks:** "your version will handle it only after it has broken on someone's machine" *names the specific future cost* of writing your own. Concrete future regret is more persuasive than "use the library".`,
    tricksHi: `### 🧰 "Banane se pehle drei dekho"

Orbit controls, environments, contact shadows, saaf text, 3D mein DOM, adaptive quality — sab pehle se hai.

Isliye nahi ki aap likh nahi sakte, balki isliye ki ye resize, safai aur ajeeb device pixel ratio sambhalte hain jo **aapka roop tabhi sambhalega jab wo kisi ki machine par toot chuka hoga**.

### 🌍 "\`<Environment preset="studio" />\`"

Ek line, aur aam taur par uplabdh sabse bada drishya sudhaar.

### 🏷️ "\`<Html />\` accessibility ka jawab hai"

3D jagah mein rakha asli DOM — sach ke buttons, keyboard aur screen reader ki pahunch mein. Akela canvas kabhi nahi ho sakta.

### 📉 "Adaptive DPR frames girne se behtar hai"

Hakla ne ki jagah thoda narm banao. **Users ko hakla-hat dikhti hai; narm pixels nahi dikhte.**

### ✨ "Ek effect, chaar nahi"

Har post-processing effect ek aur poori screen ka pass hai. Thodi chamak scene badal deti hai; chaar ek saath aksar use **bura** bana dete hain **aadhi** frame rate par.

**Bolo:** *"Sanyam hi quality lagta hai."*

### 🧊 "Simple colliders"

Mushkil mesh ke aas-paas box ya capsule trimesh collider se bahut sasta hai, aur zyadatar interactions mein farak dikhta hi nahi.

**Ye kyun tikta hai:** "aapka roop tabhi sambhalega jab wo kisi ki machine par toot chuka hoga" apna likhne ki *aage aane wali khaas keemat ka naam leta hai*. Thos bhavishya ka pachhtava "library use karo" se zyada manata hai.`,
  },

  'three-performance': {
    tricks: `### 📞 "Draw calls, not triangles"

Every unique geometry+material pair is one instruction to the GPU, with CPU paperwork attached.

**One 100k-triangle mesh often renders faster than a thousand 100-triangle meshes.**

That is genuinely counter-intuitive, and it is why "reduce the polygons" is so often the wrong advice.

**Say it:** *"Count the calls, not the triangles."*

### 🌲 "Instancing: 1000 objects, one call"

The single biggest win available for repeated geometry — trees, crowds, particles.

### 🗑️ "GPU memory is not garbage collected"

Removing a mesh from the scene frees **nothing**. Dispose explicitly.

**Watch \`renderer.info.memory\`.** If those numbers only ever climb, that is your leak — and in a single-page app it ends with the tab dying.

### 🔬 "Measure before optimising"

Are you **CPU-bound** (too many draw calls, heavy per-frame JS) or **GPU-bound** (too many pixels, expensive shaders)?

Reducing triangles when you are fill-rate limited changes **nothing**, and that is a very common wasted afternoon.

### 📱 "Test on a real mid-range phone"

Not a simulator, not a flagship. Most users are on neither, and the gap from a dev laptop is enormous.

**Why this sticks:** "one 100k mesh beats a thousand 100-triangle meshes" *inverts the intuition with a concrete comparison*. Inverted intuitions get flagged as important, and the comparison makes it checkable rather than a claim.`,
    tricksHi: `### 📞 "Draw calls, triangles nahi"

Geometry+material ka har alag jodda GPU ko ek nirdesh hai, jiske saath CPU ka kaagzi kaam juda hai.

**Ek 1 lakh triangle wala mesh aksar hazaar 100-triangle wale meshes se tez banta hai.**

Ye sach mein ulta lagta hai, aur isiliye "polygon kam karo" itni baar galat salah hoti hai.

**Bolo:** *"Calls gino, triangles nahi."*

### 🌲 "Instancing: 1000 objects, ek call"

Dohrayi gayi geometry ke liye uplabdh sabse badi jeet — ped, bheed, particles.

### 🗑️ "GPU memory garbage collect nahi hoti"

Scene se mesh hataane se **kuch** khaali nahi hota. Saaf-saaf dispose karo.

**\`renderer.info.memory\` dekho.** Wo numbers sirf badhte jayein to wahi aapka leak hai — aur single-page app mein iska ant tab ke marne se hota hai.

### 🔬 "Optimise se pehle naapo"

Aap **CPU-bound** ho (bahut draw calls, har frame bhaari JS) ya **GPU-bound** (bahut pixels, mehnge shaders)?

Fill-rate ki seema par triangles kam karne se **kuch nahi** badalta, aur ye bahut aam barbaad dopahar hai.

### 📱 "Asli mid-range phone par test karo"

Simulator par nahi, flagship par nahi. Zyadatar users dono par nahi hain, aur dev laptop se faasla bahut bada hai.

**Ye kyun tikta hai:** "ek 1 lakh wala mesh hazaar 100-triangle walon se behtar" *thos tulna ke saath aam soch ko ulta deta hai*. Ulti soch zaroori mark hoti hai, aur tulna ise daawe ki jagah jaanch ne layak bana deti hai.`,
  },

  'three-shaders': {
    tricks: `### 🔢 "24 corners vs 2 million pixels"

The vertex shader runs per vertex — a cube has 24. The fragment shader runs per **pixel** — a full 1080p screen is **two million**, every frame.

**Anything that can move to the vertex shader should.**

**Say it:** *"Corners are cheap, pixels are expensive."*

That single instinct is most of what separates fast shader work from slow.

### 🌈 "You debug by painting"

No console, no debugger, no stack trace. Assign the value you are investigating to the output colour and **look at it**. That is genuinely the technique.

### 🔤 "1.0, not 1"

GLSL is strict about types. This one rule accounts for most first-day compile errors.

### 🩹 "Borrow before you build"

\`onBeforeCompile\` injects your code into an existing \`MeshStandardMaterial\` and **keeps all of Three.js's lighting**. Writing PBR lighting from scratch is a large job with very little reward.

### ⚖️ The honest warning

Shaders are the most seductive corner of this subject and usually not what a project needs. **Good lighting, decent materials and a touch of bloom beat a hand-written shader in most real work** — at a fraction of the time.

Learn them for what nothing else can do.

**Why this sticks:** "corners are cheap, pixels are expensive" is *a four-word optimisation rule with the numbers behind it*. Once you know it is 24 versus two million, the rule needs no further justification.`,
    tricksHi: `### 🔢 "24 kone बनाम 20 lakh pixel"

Vertex shader har vertex par chalta hai — cube mein 24. Fragment shader har **pixel** par — poori 1080p screen **bees lakh** hai, har frame.

**Jo bhi vertex shader mein ja sakta hai wo jana chahiye.**

**Bolo:** *"Kone saste, pixel mehnge."*

Yahi ek soch tez aur dheeme shader kaam ka zyadatar farak hai.

### 🌈 "Aap paint karke debug karte ho"

Na console, na debugger, na stack trace. Jis value ki jaanch kar rahe ho use output rang par daalo aur **dekho**. Sach mein tareeka yahi hai.

### 🔤 "1.0, 1 nahi"

GLSL types par sakht hai. Pehle din ki zyadatar compile errors sirf isi ek niyam se aati hain.

### 🩹 "Banane se pehle udhaar lo"

\`onBeforeCompile\` aapka code maujooda \`MeshStandardMaterial\` mein ghusata hai aur **Three.js ki poori lighting bacha leta hai**. PBR lighting shuru se likhna bada kaam hai aur inaam bahut kam.

### ⚖️ Imaandar chetavni

Shaders is vishay ka sabse lubhavana kona hain aur aksar wo nahi jo project ko chahiye. **Achhi lighting, theek materials aur thodi bloom zyadatar asli kaam mein haath se likhe shader ko haraate hain** — waqt ke bahut kam hisse mein.

Inhe un cheezon ke liye seekho jo aur kuch nahi kar sakta.

**Ye kyun tikta hai:** "kone saste, pixel mehnge" *numbers ke saath chaar shabd ka optimisation niyam* hai. Ek baar pata chal jaye ki 24 बनाम bees lakh hai, to niyam ko aur safai ki zaroorat hi nahi.`,
  },

  'three-production': {
    tricks: `### 📦 "Assets are the product problem"

A 3D page can be 20x heavier than a normal one. Compress everything, lazy-load until it is scrolled to, and **set a size budget the build enforces** — otherwise it creeps up quietly with every addition.

### ♿ "A canvas is invisible to assistive technology"

Not badly described — **not there**. Nothing inside is keyboard reachable.

If a spec is only visible by rotating a model, **some people cannot access it at all.**

**Mirror every meaningful interaction in real DOM.** An hour of work that decides whether some people can use your product.

### 🤢 "Reduced motion is a health matter"

Continuous camera movement genuinely causes nausea for some people. Respect \`prefers-reduced-motion\` — that is not a preference setting.

### 🛟 "Always have a fallback"

No WebGL, a lost context, a blocklisted GPU. Show a static image and a sentence. **A blank grey rectangle with no explanation is the worst available outcome.**

### 🤔 The question worth asking honestly

**"Does the 3D serve the user, or serve the demo?"**

A configurator earns its cost. A rotating logo costs 15MB, punishes every phone user, and helps nobody.

**Why this sticks:** "serve the user or serve the demo" is *a question that judges your own work*, and self-directed questions get asked again on the next project — which is exactly where the decision matters.`,
    tricksHi: `### 📦 "Assets hi asli product samasya hain"

3D page aam page se 20 guna bhaari ho sakta hai. Sab kuch compress karo, scroll aane tak lazy-load karo, aur **size ka budget rakho jise build lagu kare** — warna wo har jodne ke saath chupchaap badhta rehta hai.

### ♿ "Sahayak technology ke liye canvas adrishya hai"

Bura bataya gaya nahi — **hai hi nahi**. Uske andar kuch bhi keyboard ki pahunch mein nahi.

Agar koi tafseel sirf model ghuma kar dikhti hai, to **kuch log us tak pahunch hi nahi sakte.**

**Har matlab wale interaction ko asli DOM mein bhi rakho.** Ek ghante ka kaam jo tay karta hai ki kuch log aapka product use kar sakte hain ya nahi.

### 🤢 "Reduced motion sehat ki baat hai"

Lagatar camera hilna kuch logon ko sach mein matli laata hai. \`prefers-reduced-motion\` ka maan rakho — ye pasand ki setting nahi hai.

### 🛟 "Fallback hamesha rakho"

WebGL nahi, context kho gaya, GPU rok diya gaya. Sthir image aur ek vaakya dikhao. **Bina safai ke khaali slate rang ka chaukor sabse bura uplabdh natija hai.**

### 🤔 Wo sawaal jo imaandari se poochhna chahiye

**"3D user ke kaam aa raha hai, ya demo ke?"**

Configurator apni keemat kamata hai. Ghoomta logo 15MB leta hai, har phone user ko sazaa deta hai, aur kisi ke kaam nahi aata.

**Ye kyun tikta hai:** "user ke kaam ya demo ke" *aisa sawaal hai jo aapke apne kaam ko jaanchta hai*, aur khud se poochhe sawaal agle project par phir poochhe jate hain — aur faisla wahin matter karta hai.`,
  },
};
