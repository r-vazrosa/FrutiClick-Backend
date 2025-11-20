// server.js
const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json()); // <-- parse JSON bodies

const mongoose = require("mongoose");

//testdb is name of database, it will automatically make it
mongoose
  .connect("mongodb+srv://rvaz:12341234@cluster0.hiqu0cx.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const schema = new mongoose.Schema({
  name: String,
});

async function createMessage() {
  const result = await message.save();
  console.log(result);
}

//this creates a Message class in our app
const Message = mongoose.model("Message", schema);
const message = new Message({
  name: "Hello World",
});

createMessage();

// in-memory items array (moved outside handlers so POST can push into it)
const items = [
  {
    id: 1,
    name: "Flimsy CD",
    description:
      "A Flimsy CD you bought from a random guy you found on the street who said had mystic properties, instead it was a text file saying thanks for the money.",
    value: 1,
    cost: 20,
    type: "click",
    image: "images/item-img-1.png",
  },
  {
    id: 2,
    name: "Mr. Click's Hand",
    description:
      "Mr.Click was a good man, but ever since people found the power his hand held they sought it too. Buying this while knowing this makes you a monster.",
    value: 10,
    cost: 300,
    type: "second",
    image: "images/item-img-2.png",
  },
  {
    id: 3,
    name: "Joystick of DOOOMMM",
    description:
      "THIS IS THE JOYSTICK OF DOOMMM, IT HAS THE POWER TO DESTROY THE WORLDDD. WAIT, DON'T TOUCH ITT. oh, nothing happened.",
    value: 20,
    cost: 1000,
    type: "click",
    image: "images/item-img-3.png",
  },
  {
    id: 4,
    name: "Importance",
    description:
      "The essence of an excalmation mark trapped in form. A mad scientist wanted to show his idea to the world and created this to force people to care.",
    value: 200,
    cost: 50000,
    type: "second",
    image: "images/item-img-4.png",
  },
  {
    id: 5,
    name: "Mr. Smiley",
    description:
      "Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend.",
    value: 1000,
    cost: 200000,
    type: "click",
    image: "images/item-img-5.png",
  },
  {
    id: 6,
    name: "WFO",
    description:
      "So you're seriously telling me you actually saw a WFO? A wonderful flying object? You know those aren't real right, you're always lying to me.",
    value: 10000,
    cost: 1000000,
    type: "click",
    image: "images/item-img-6.png",
  },
  {
    id: 7,
    name: "GameMan",
    description:
      "The GameMan is a machine where your most wild imaginations can be emulated on it. Dreams, aspirations, and even evil can be shown on it's screen. This is not supposed to be anything else...",
    value: 300000,
    cost: 60000000,
    type: "second",
    image: "images/item-img-7.png",
  },
  {
    id: 8,
    name: "Starite",
    description:
      "This is where all the starries come from, the final frontier of stardom. To be the starite is a blessing that none of us will recieve, a fate most crushing.",
    value: 100000000,
    cost: 900000000,
    type: "second",
    image: "images/item-img-8.png",
  },
];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Return the items array
app.get("/api/items", (req, res) => {
  res.json(items);
});

// Joi schema for validating incoming new items
const itemSchema = Joi.object({
  id: Joi.forbidden(), // client should not provide id
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  value: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  type: Joi.string().valid("click", "second").required(),
  image: Joi.string().allow("").optional(),
});

// Create new item
app.post("/api/items", (req, res) => {
  const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // return first message and a 400 status
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((d) => ({ field: d.path.join("."), message: d.message })),
    });
  }

  // assign id and push
  const newId = items.length ? items[items.length - 1].id + 1 : 1;
  const newItem = {
    id: newId,
    name: value.name,
    description: value.description,
    value: value.value,
    cost: value.cost,
    type: value.type,
    image: value.image ? value.image : "images/item-img-1.png", // fallback if empty
  };

  items.push(newItem);

  return res.status(201).json({ success: true, item: newItem });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});