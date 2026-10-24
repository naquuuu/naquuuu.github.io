/* for-ai/content.js
   One editable source for every word, date, photo path and quantity in /for-ai/.
   Edit this file and nothing else for copy changes.

   Note: the two passwords below are sentimental, not security. This whole
   experience is client-side and public by design. See README.md. */

export const config = {
  themeKey: 'naquuuu_mode',
  bookletSessionKey: 'naquuuu_fa_booklet',
  kitchenSessionKey: 'naquuuu_fa_kitchen',
  letterSessionKey: 'naquuuu_fa_letter',
  kitchenStateKey: 'naquuuu_fa_kitchen_state',
  kitchenStateVersion: 1,
};

/* Compared after trimming spaces and ignoring letter case. */
export const passwords = {
  booklet: '251026',
  kitchen: 'DINNERFORAI',
  letter: 'naloveayi',
};

export const landing = {
  label: 'PRIVATE EDITION / 001',
  title: 'a little something, for ai.',
  titleLines: ['a little', 'something,', 'for ai.'],
  footer: ['a weekend, just for us.', 'jakarta · 2026'],
  date: '24–25 october 2026',
  supporting: 'Some days deserve their own little page.',
  entries: [
    {
      key: 'booklet',
      href: '/for-ai/booklet/',
      title: 'Our Little Adventure',
      description: "A little guide to the places we'll go and the memories we'll make.",
      cta: 'Open our story ↗',
    },
    {
      key: 'kitchen',
      href: '/for-ai/kitchen/',
      title: 'Our Little Kitchen',
      description: 'Two people, one kitchen, and something delicious to make together.',
      cta: 'Enter the kitchen ↗',
    },
  ],
};

export const bookletGate = {
  label: 'A PRIVATE LITTLE EDITION',
  title: 'a little day with you.',
  sub: "Some pages aren't meant for everyone.",
  field: 'our little code',
  cta: 'Open our story ↗',
  error: 'Not quite, try again ♡',
};

export const kitchenGate = {
  label: 'PRIVATE WORKSHOP / 001',
  title: 'welcome to our little kitchen.',
  sub: "Tonight, we're making something together.",
  field: 'our little code',
  cta: 'Enter the kitchen ↗',
  error: 'Not quite, try again ♡',
};

/* Photo paths and intrinsic sizes.
   width/height encode the original aspect ratio, so nothing is cropped.
   01–04 landscape 4:3 · 05 969:1280 · 06 3:4 · 07 4:5 · 08 959:1280 · 09 3:4 */
export const photos = {
  '01': { src: '/for-ai/images/photo-01.webp', small: '/for-ai/images/photo-01-small.webp', w: 1600, h: 1200, alt: 'a close selfie together in a dimly lit room' },
  '02': { src: '/for-ai/images/photo-02.webp', small: '/for-ai/images/photo-02-small.webp', w: 1600, h: 1200, alt: 'sharing a meal, with a plate held up to the camera' },
  '03': { src: '/for-ai/images/photo-03.webp', small: '/for-ai/images/photo-03-small.webp', w: 1600, h: 1200, alt: 'a selfie together beside a luggage trolley' },
  '04': { src: '/for-ai/images/photo-04.webp', small: '/for-ai/images/photo-04-small.webp', w: 1600, h: 1200, alt: 'leaning on a shoulder while sitting together by a window' },
  '05': { src: '/for-ai/images/photo-05.webp', small: '/for-ai/images/photo-05-small.webp', w: 969, h: 1280, alt: 'posing together inside a warmly lit photo booth' },
  '06': { src: '/for-ai/images/photo-06.webp', small: '/for-ai/images/photo-06-small.webp', w: 1200, h: 1600, alt: 'a softly blurred mirror selfie together' },
  '07': { src: '/for-ai/images/photo-07.webp', small: '/for-ai/images/photo-07-small.webp', w: 1024, h: 1280, alt: 'posing together in front of a cinema poster' },
  '08': { src: '/for-ai/images/photo-08.webp', small: '/for-ai/images/photo-08-small.webp', w: 959, h: 1280, alt: 'a mirror selfie together in a gym' },
  '09': { src: '/for-ai/images/photo-09.webp', small: '/for-ai/images/photo-09-small.webp', w: 1200, h: 1600, alt: 'standing together beside a tree on a leafy walking trail' },
};

export const playlist = {
  title: 'a playlist for our weekend',
  embed: 'https://open.spotify.com/embed/playlist/4EwdcAxwjAmDZS40z2UDRQ',
  open: 'https://open.spotify.com/playlist/4EwdcAxwjAmDZS40z2UDRQ',
  openLabel: 'open in spotify ↗',
  openAria: 'open the playlist in spotify (new tab)',
  height: 352,
};

export const booklet = {
  cover: {
    label: 'A PRIVATE LITTLE EDITION',
    title: 'a day with ai.',
    date: '24–25 october 2026',
    dedication: 'for ayii, from na.',
    intro:
      "I made this little page because I wanted our time together to feel a little more special. Nothing too complicated. Just a day with you, a few places to go, and some little things I've prepared.",
    turn: 'Turn the page ↓',
    photo: '05',
  },
  moments: {
    label: 'A FEW LITTLE MOMENTS',
    title: 'a few little moments.',
    photos: ['01', '02', '03', '06', '07', '08'],
  },
  songs: {
    label: 'OUR SOUNDTRACK',
    caption: 'some songs to keep us company.',
  },
  chapters: [
    {
      number: '01',
      label: 'chapter 01',
      title: 'somewhere, together.',
      subtitle: 'Saturday, 24 October 2026',
      photoBefore: '09',
      items: [
        {
          title: 'The beginning',
          text: 'Picking you up. A little drive, a little conversation, and the start of our day.',
        },
        {
          title: 'Kota Tua',
          text: "Old buildings, little streets, photographs, and that palm-reading experience you've been wanting to try.",
        },
        {
          title: 'A little pause at Acaraki',
          text: "A stop at Acaraki while we're exploring Kota Tua. No rush, just a little more time together.",
        },
        {
          title: 'A little stop at Café Batavia',
          text: 'Somewhere lovely to sit, something to eat or drink, and a little more time together.',
        },
        {
          title: 'Back to our little place',
          text: "Back to Menteng, where I've prepared something a little different for tonight.",
        },
        {
          title: 'A little after midnight',
          text: "There's something I've been wanting to tell you.",
        },
      ],
    },
    {
      number: '02',
      label: 'chapter 02',
      title: 'sunday, together.',
      subtitle: 'Sunday, 25 October 2026',
      items: [
        {
          title: 'A slow start',
          text: "No alarms if we don't need them. Just taking our time.",
        },
        {
          title: 'Breakfast together',
          text: 'Something to eat, something warm to drink, and a little conversation.',
        },
        {
          title: 'Taman Ismail Marzuki',
          text: 'A little morning stroll around Cikini and TIM. Maybe some photos along the way.',
        },
        {
          title: 'Whatever comes next',
          text: 'No rush. Just enjoying the morning together.',
        },
      ],
    },
    {
      number: '03',
      label: 'chapter 03',
      title: 'one more thing.',
      text: "There's actually something else I wanted to tell you.",
      button: 'A little secret ♡',
    },
  ],
  letter: {
    label: 'for ai, from na.',
    gate: {
      title: 'just one more little secret.',
      description: 'this one is for the right moment.',
      field: 'the letter code',
      button: 'open my letter ♡',
      error: 'not quite, try again ♡',
    },
    photo: '04',
    date: '25 october 2026',
    question: 'would you be my girlfriend?',
    /* Owner-supplied final letter. Preserve wording and paragraph breaks. */
    paragraphs: [
      "hii, aiii.",
      "hehe, akhirnya tanggal 25 juga yaa.",
      "i know we've been talking about this day for a while, dan aiii mungkin udah tau na mau nanya apa. but i still wanted to make this moment special, because you really are someone special to me.",
      "ai, inget ga gimana kita mulai?",
      "back in july, waktu kita masih getting to know each other, aiii pernah nanya ke na, apa na beneran udah ready buat kenal someone new.",
      "and honestly, na seneng ai nanya itu.",
      "because looking back, i think that conversation was important for us. dari awal kita udah bisa ngobrol jujur, saling cerita tentang apa yang kita rasain, dan pelan-pelan belajar ngerti satu sama lain.",
      "waktu itu na belum tau kita bakal sampai di titik ini.",
      "na cuma tau, na pengen kenal aiii lebih jauh.",
      "and i'm really glad i did.",
      "somewhere between our random conversations, late night calls, jokes yang kadang ga jelas, little misunderstandings, dan semua momen kita saling kangen, aiii pelan-pelan jadi bagian penting dari hari-hari na.",
      "na mulai looking forward to the smallest things.",
      "denger cerita tentang hari aiii, liat ai excited sama sesuatu, jemput ai, spend time together, atau bahkan cuma dapet random \"hiii naa\" dari aiii.",
      "simple things, but somehow they feel different because it's you.",
      "and one thing i really appreciate about us is that things haven't always been perfect, and that's okay.",
      "ada waktu kita belum sepenuhnya ngerti satu sama lain. ada hal-hal yang perlu dijelasin, boundaries yang perlu kita pahami, dan kadang kita juga punya cara pandang yang beda.",
      "but what matters to me is that we keep trying to understand each other.",
      "na suka kita bisa bercanda, bisa janggal bareng HAHAHA, tapi juga bisa ngobrol serius tentang hal-hal yang penting buat kita.",
      "na suka how you have your own dreams, your own interests, and so many things you want to do.",
      "and i never want being with me to hold you back from any of those things.",
      "na pengen jadi orang yang support aiii, yang ikut happy setiap ai achieve something, yang mau dengerin cerita ai even on your bad days, dan yang bisa remind ai how capable you are whenever you start doubting yourself.",
      "because ai, i genuinely admire you.",
      "not just the happy, cute, and centil side of you that na get to see, but also the thoughtful, hardworking, sometimes-overthinking ai who's always trying her best.",
      "and i want to keep getting to know every side of you.",
      "there's also something i've been wanting to tell you.",
      "waktu aiii bilang kalau ai notice the little things na do for you, and that they make you feel appreciated and cared for, na beneran happy banget.",
      "because sometimes na mungkin ga selalu tau cara paling tepat buat nunjukin apa yang na rasain.",
      "but i hope, through those little things, ai knows how much you mean to me.",
      "i want you to feel loved, appreciated, respected, and most importantly, comfortable being yourself around me.",
      "na tau kita masih punya banyak hal yang perlu dipelajarin tentang satu sama lain.",
      "na juga tau na ga akan selalu get everything right.",
      "pasti bakal ada misunderstanding lagi, mungkin ada saat kita beda pendapat, atau hal-hal kecil yang ternyata perlu kita obrolin.",
      "but i'm willing to learn, to listen, and to figure things out together.",
      "because i don't just want to be there for the happy moments.",
      "i want to be there for the not-so-easy ones too.",
      "ai, inget ga waktu kita decided to give this a chance?",
      "we called it our little trial, and honestly, na ga nyangka beberapa bulan ini bakal mean this much to me.",
      "what started as us simply getting to know each other turned into something na genuinely look forward to every day.",
      "and somewhere along the way, na realized that i don't want this to just be a trial anymore.",
      "i want us.",
      "and tonight, after our little adventure, our probably-not-Michelin-star dinner HAHAHA, and everything we planned for this day, na realized something.",
      "my favorite part of all of this isn't the places we went to, the food we made, or how everything turned out.",
      "it's getting to do all of those things with you.",
      "so, aiii.",
      "na suka banget sama ai.",
      "na sayang banget sama aiii.",
      "and this time, i'm not saying it half-asleep HAHAHA.",
      "i'm saying it because i mean it.",
      "because after everything we've shared these past few months, i'm sure that i want to keep doing this with you.",
      "the random conversations, the little dates, the silly jokes, the serious talks, and even the janggal moments.",
      "all of it.",
      "i don't know exactly what the future holds for us, but i know that i want to find out with you.",
      "so, ai...",
      "would you be my girlfriend?",
      "not my committed trial partner anymore.",
      "my girlfriend, officially.",
      "and hopefully, the person i get to share so many more little adventures and ordinary days with.",
      "with love,",
      "na ♡"
],
    close: 'close the letter',
    back: 'back to the booklet',
  },
};

export const kitchen = {
  welcome: {
    label: 'PRIVATE WORKSHOP / 001',
    title: "Na & Ai's Little Kitchen",
    subtitle: 'Two people. One kitchen. A little something delicious.',
    message:
      "Hi, Ai. Tonight, I thought we could make something together. Don't worry, I'll handle the complicated parts. You just have to help me make it special.",
    cta: "Let's cook together ↗",
    soundtrack: 'our soundtrack',
    photo: '02',
  },
  menu: {
    label: "TONIGHT'S CREATIONS",
    title: "tonight's creations",
    courses: [
      {
        label: 'MAIN COURSE',
        name: 'Fettuccine Truffle Cream',
        description: 'Silky truffle cream fettuccine, parmesan, and crispy beef bacon.',
      },
      {
        label: 'SIGNATURE DRINK',
        name: 'Strawberry Lemon Sparkler',
        description: 'Fresh strawberries, lemon, and sparkling water.',
      },
    ],
    note: "Made together. That's what makes it special.",
    cta: 'Put on your imaginary apron ↗',
  },
  chefs: {
    label: 'MEET THE CHEFS',
    title: 'na & ai.',
    cards: [
      {
        role: 'head chef',
        name: 'na',
        duties: ['Cooking the pasta', 'Handling hot pans', 'Making the truffle cream sauce', 'Helping with plating'],
      },
      {
        role: 'co-chef',
        name: 'ai',
        duties: ['Preparing the signature drinks', 'Helping with ingredients', 'Official taste testing', 'Finishing touches and plating'],
      },
    ],
    playful: 'Two chefs. One kitchen. Zero Michelin stars (for now).',
    note: 'These roles are playful suggestions, not strict rules. Either person can help with any task they feel comfortable doing.',
    cta: 'Ready, Chef Ai? ↗',
  },
  ingredients: {
    label: 'THE INGREDIENTS',
    title: 'everything, laid out',
    subtitle: 'for two modest portions',
    groups: [
      {
        id: 'pasta',
        title: 'Fettuccine Truffle Cream',
        items: [
          { id: 'fettuccine', text: '150–160 g fettuccine' },
          { id: 'bacon', text: '100–120 g beef bacon' },
          { id: 'cream', text: '180–200 ml cooking cream' },
          { id: 'parmesan', text: '40 g parmesan cheese' },
          { id: 'garlic', text: '2 garlic cloves' },
          { id: 'butter', text: '20 g unsalted butter' },
          { id: 'truffle', text: 'truffle oil, to taste' },
          { id: 'seasoning', text: 'salt and black pepper' },
          { id: 'mushrooms', text: 'optional: 100 g mushrooms' },
        ],
      },
      {
        id: 'drink',
        title: 'Strawberry Lemon Sparkler',
        items: [
          { id: 'strawberries', text: '6 fresh strawberries' },
          { id: 'lemon', text: '1 lemon' },
          { id: 'honey', text: 'honey syrup, to taste' },
          { id: 'sparkling', text: '250–300 ml sparkling water' },
          { id: 'ice', text: 'ice cubes' },
          { id: 'mint', text: 'optional: mint for garnish' },
        ],
      },
    ],
    counter: 'ready',
    cta: "Everything ready? Let's begin.",
  },
  /* Nine steps. Durations only where they help. Pasta timing follows the package. */
  steps: [
    {
      title: "let's get ready",
      role: 'Together',
      lines: [
        'Wash the strawberries and pat them dry.',
        'Mince the garlic, grate the parmesan, and portion the fettuccine.',
        "Cut the beef bacon into short strips. If we're using mushrooms, slice them too.",
        'Set everything out before turning on the stove.',
      ],
      tip: 'Having everything within reach keeps the sauce calm later.',
    },
    {
      title: 'our signature drinks',
      role: 'Ai',
      duration: 'about 5 min',
      lines: [
        'Muddle the strawberries with the lemon juice and honey syrup in a glass.',
        'Add ice, then top with sparkling water.',
        'Stir gently and garnish with mint or a strawberry slice.',
        'Taste together and adjust the sweetness.',
      ],
      tip: "Mix the drinks before the stove gets busy. They'll stay cold while the pasta cooks.",
      prompt: 'Chef Ai, official taste tester. What’s the verdict?',
    },
    {
      title: 'make it crispy',
      role: 'Na',
      duration: 'about 5–7 min',
      lines: [
        'Cook the beef bacon in a dry pan over medium heat until browned and crisp.',
        'Lift it out and set it aside on a plate.',
        'Keep the pan and the bacon fat. The sauce starts here.',
      ],
    },
    {
      title: 'pasta time',
      role: 'Together',
      duration: 'about 8–11 min, per the package',
      lines: [
        'Bring a pot of well-salted water to a boil and start the fettuccine.',
        "While the pasta cooks, go straight on to the sauce in the next step. Don't wait for the pasta to finish first.",
        "Check the package for the cooking time and taste early. Fettuccine is ready when it's al dente.",
        'Before draining, scoop out a mug of pasta water and keep it.',
        "Drain as soon as the pasta is al dente. If the sauce needs another moment, keep the drained pasta in the warm pot with a splash of reserved water, then toss it into the sauce promptly.",
      ],
      tip: "The pasta water is the sauce's best friend. Keep more than you think you need.",
    },
    {
      title: 'the creamy part',
      role: 'Na',
      duration: 'about 6–8 min',
      lines: [
        "If we're using mushrooms, add them to the bacon pan first and sauté over medium heat until golden and soft. Set them aside with the bacon.",
        'Lower the heat to medium-low and melt the butter in the same pan.',
        'Add the garlic and cook gently until fragrant, not browned.',
        'Reserve a little parmesan for plating. Pour in the cooking cream, lower the heat, and stir in the remaining parmesan a little at a time.',
        "Add a splash of pasta water to loosen the sauce. Keep it barely simmering. Don't let it boil hard.",
      ],
      tip: 'If the sauce tightens while the pasta finishes, a spoon of pasta water brings it back.',
    },
    {
      title: 'a little truffle magic',
      role: 'Ai',
      lines: [
        'Turn off the heat under the sauce.',
        'Add a few drops of truffle oil and stir gently. Start small, the flavour is strong.',
        'Taste together and adjust the salt and black pepper.',
      ],
      tip: 'Truffle oil loses its perfume in high heat, so it goes in last, off the stove.',
      prompt: 'Who do you think is the better chef?',
    },
    {
      title: 'bring it together',
      role: 'Together',
      lines: [
        'Tip the drained fettuccine into the pan and toss it through the sauce.',
        'Reserve a little crispy bacon for plating. Fold in the rest, and the mushrooms if we used them.',
        'Add a little reserved pasta water if the sauce needs to loosen and turn silky.',
      ],
      prompt: 'Rate our teamwork from 1 to 10 ♡',
    },
    {
      title: 'plate our masterpiece',
      role: 'Together',
      lines: [
        'Twirl the pasta into two shallow bowls or plates.',
        'Finish with the crispy bacon, more parmesan, and freshly cracked black pepper.',
        "Take a photo of the finished dish if we'd like.",
      ],
      prompt: 'Quick photo before we eat?',
    },
    {
      title: 'dinner is served',
      role: 'Together',
      lines: [
        'Bring the pasta and the sparklers to the table.',
        "Sit down together. That's the whole point.",
      ],
      big: 'We made this. Together.',
      next: "Let's eat ♡",
    },
  ],
  stepLabels: {
    previous: 'previous step',
    next: 'next step',
    skipPrompt: 'skip this',
  },
  completion: {
    label: 'A PRIVATE DINNER FOR TWO',
    title: "Na & Ai's Little Kitchen",
    subtitle: "Tonight's creations",
    dishes: ['Fettuccine Truffle Cream', 'Strawberry Lemon Sparkler'],
    note: 'Prepared together, with a little love.',
    footer: '24 October 2026 · Menteng',
    soundtrack: 'our soundtrack',
    restart: 'start the workshop again',
  },
  reset: {
    title: 'start the workshop again?',
    text: 'This clears the ingredient checklist and the cooking progress saved on this device. The kitchen stays unlocked for this session.',
    cancel: 'keep going',
    confirm: 'start again',
  },
};
