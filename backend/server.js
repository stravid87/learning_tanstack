// Import the Express.js library
const express = require('express');
const cors = require('cors');

// Create an instance of the Express application
const app = express();

// Define the port the server will listen on.
const PORT = process.env.PORT || 3000;

// Hardcoded array of poem objects
const poems = [
  {
    id: 1,
    title: "Ozymandias",
    author: "Percy Bysshe Shelley",
    lines: [
      "I met a traveller from an antique land,",
      "Who said—'Two vast and trunkless legs of stone",
      "Stand in the desert....Near them, on the sand,",
      "Half sunk a shattered visage lies, whose frown,",
      "And wrinkled lip, and sneer of cold command,",
      "Tell that its sculptor well those passions read",
      "Which yet survive, stamped on these lifeless things,",
      "The hand that mocked them, and the heart that fed;",
      "And on the pedestal these words appear:",
      "\"My name is Ozymandias, King of Kings;",
      "Look on my Works, ye Mighty, and despair!\"",
      "Nothing beside remains. Round the decay",
      "Of that colossal wreck, boundless and bare",
      "The lone and level sands stretch far away."
    ]
  },
  {
    id: 2,
    title: "The Road Not Taken",
    author: "Robert Frost",
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "",
      "Then took the other, as just as fair,",
      "And having perhaps the better claim,",
      "Because it was grassy and wanted wear;",
      "Though as for that the passing there",
      "Had worn them really about the same,",
      "",
      "And both that morning equally lay",
      "In leaves no step had trodden black.",
      "Oh, I kept the first for another day!",
      "Yet knowing how way leads on to way,",
      "I doubted if I should ever come back.",
      "",
      "I shall be telling this with a sigh",
      "Somewhere ages and ages hence:",
      "Two roads diverged in a wood, and I—",
      "I took the one less traveled by,",
      "And that has made all the difference."
    ]
  },
  {
    id: 3,
    title: "Sonnet 18",
    author: "William Shakespeare",
    lines: [
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate:",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date:",
      "Sometime too hot the eye of heaven shines,",
      "And often is his gold complexion dimm'd;",
      "And every fair from fair sometime declines,",
      "By chance, or nature's changing course, untrimm'd;",
      "But thy eternal summer shall not fade,",
      "Nor lose possession of that fair thou owest;",
      "Nor shall Death brag thou wander'st in his shade,",
      "When in eternal lines to time thou growest:",
      "So long as men can breathe, or eyes can see,",
      "So long lives this, and this gives life to thee."
    ]
  },
  {
    id: 4,
    title: "Still I Rise",
    author: "Maya Angelou",
    lines: [
      "You may write me down in history",
      "With your bitter, twisted lies,",
      "You may trod me in the very dirt",
      "But still, like dust, I'll rise.",
      "",
      "Does my sassiness upset you?",
      "Why are you beset with gloom?",
      "’Cause I walk like I’ve got oil wells",
      "Pumping in my living room.",
      // ... (actual poem is longer, truncated for example)
      "Bringing the gifts that my ancestors gave,",
      "I am the dream and the hope of the slave.",
      "I rise",
      "I rise",
      "I rise."
    ]
  },
  {
    id: 5,
    title: "Invictus",
    author: "William Ernest Henley",
    lines: [
      "Out of the night that covers me,",
      "Black as the pit from pole to pole,",
      "I thank whatever gods may be",
      "For my unconquerable soul.",
      "",
      "In the fell clutch of circumstance",
      "I have not winced nor cried aloud.",
      "Under the bludgeonings of chance",
      "My head is bloody, but unbowed.",
      "",
      "Beyond this place of wrath and tears",
      "Looms but the Horror of the shade,",
      "And yet the menace of the years",
      "Finds and shall find me unafraid.",
      "",
      "It matters not how strait the gate,",
      "How charged with punishments the scroll,",
      "I am the master of my fate,",
      "I am the captain of my soul."
    ]
  }
];

// Middleware to parse JSON bodies from incoming requests.
app.use(express.json());
app.use(cors());
// --- Routes for Poems ---

// GET all poems
app.get('/api/poems', (req, res) => {
  res.json(poems);
});

// GET a single poem by ID
app.get('/api/poems/:id', (req, res) => {
  const poemId = parseInt(req.params.id, 10); // Convert ID from string to integer
  const poem = poems.find(p => p.id === poemId);

  if (poem) {
    res.json(poem);
  } else {
    // If no poem is found with the given ID, send a 404 Not Found response
    res.status(404).json({ message: 'Poem not found' });
  }
});

// --- Existing Routes ---

// Define a basic route for the root URL ('/').
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the boilerplate Express.js server with poems!' });
});

// Start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
  console.log(`View all poems at: http://localhost:${PORT}/api/poems`);
  console.log(`View a single poem (e.g., ID 1) at: http://localhost:${PORT}/api/poems/1`);
});

// Basic error handling middleware (optional but recommended for production)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
