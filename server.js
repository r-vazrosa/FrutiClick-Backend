const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rvaz:12341234@cluster0.hiqu0cx.mongodb.net/?appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect to mongodb...", err));

const itemMongooseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ["click", "second"], required: true },
  image: { type: String, default: "" }
}, { timestamps: true });

const Item = mongoose.model("Item", itemMongooseSchema);

const seedItemsArray = [
  {
    id: 1,
    name: "Flimsy CD",
    description:
      "A Flimsy CD you bought from a random guy you found on the street who said had mystic properties, instead it was a text file saying thanks for the money.",
    value: 1,
    cost: 20,
    type: "click",
    image: "/images/item-img-1.png"
  },
  {
    id: 2,
    name: "Mr. Click's Hand",
    description:
      "Mr.Click was a good man, but ever since people found the power his hand held they sought it too. Buying this while knowing this makes you a monster.",
    value: 10,
    cost: 300,
    type: "second",
    image: "/images/item-img-2.png"
  },
  {
    id: 3,
    name: "Joystick of DOOOMMM",
    description:
      "THIS IS THE JOYSTICK OF DOOMMM, IT HAS THE POWER TO DESTROY THE WORLDDD. WAIT, DON'T TOUCH ITT. oh, nothing happened.",
    value: 20,
    cost: 1000,
    type: "click",
    image: "/images/item-img-3.png"
  },
  {
    id: 4,
    name: "Importance",
    description:
      "The essence of an excalmation mark trapped in form. A mad scientist wanted to show his idea to the world and created this to force people to care.",
    value: 200,
    cost: 50000,
    type: "second",
    image: "/images/item-img-4.png"
  },
  {
    id: 5,
    name: "Mr. Smiley",
    description:
      "Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend.",
    value: 1000,
    cost: 200000,
    type: "click",
    image: "/images/item-img-5.png"
  },
  {
    id: 6,
    name: "WFO",
    description:
      "So you're seriously telling me you actually saw a WFO? A wonderful flying object? You know those aren't real right, you're always lying to me.",
    value: 10000,
    cost: 1000000,
    type: "click",
    image: "/images/item-img-6.png"
  },
  {
    id: 7,
    name: "GameMan",
    description:
      "The GameMan is a machine where your most wild imaginations can be emulated on it. Dreams, aspirations, and even evil can be shown on it's screen. This is not supposed to be anything else...",
    value: 300000,
    cost: 60000000,
    type: "second",
    image: "/images/item-img-7.png"
  },
  {
    id: 8,
    name: "Starite",
    description:
      "This is where all the starries come from, the final frontier of stardom. To be the starite is a blessing that none of us will recieve, a fate most crushing.",
    value: 100000000,
    cost: 900000000,
    type: "second",
    image: "/images/item-img-8.png"
  }
];

async function seedIfEmpty() {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      await Item.insertMany(seedItemsArray);
      console.log("Seeded items into MongoDB");
    }
  } catch (e) {
    console.error("Seeding error", e);
  }
}

mongoose.connection.on("open", () => {
  seedIfEmpty();
});

const imagesDir = path.join(__dirname, "public", "images");
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safe}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed."));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const itemJoiSchema = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  value: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  type: Joi.string().valid("click", "second").required(),
  image: Joi.string().allow("").optional()
});

function validateItemPayload(payload) {
  const normalized = {
    name: payload.name,
    description: payload.description,
    value: Number(payload.value),
    cost: Number(payload.cost),
    type: payload.type,
    image: payload.image || ""
  };
  return itemJoiSchema.validate(normalized, { abortEarly: false });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/items", async (req, res) => {
  try {
    const docs = await Item.find().sort({ id: 1 }).lean();
    return res.json(docs);
  } catch (err) {
    console.error("GET /api/items error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/items", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required. Upload an image using the 'image' form field."
      });
    }
    const payload = {
      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      cost: req.body.cost,
      type: req.body.type
    };
    const { error, value } = validateItemPayload(payload);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => ({ field: d.path.join("."), message: d.message }))
      });
    }
    const maxItem = await Item.findOne().sort({ id: -1 }).lean();
    const newId = maxItem ? (maxItem.id + 1) : 1;
    const imagePath = "/images/" + req.file.filename;
    const newItem = new Item({
      id: newId,
      name: value.name,
      description: value.description,
      value: value.value,
      cost: value.cost,
      type: value.type,
      image: imagePath
    });
    await newItem.save();
    return res.status(201).json({ success: true, item: newItem.toObject() });
  } catch (err) {
    console.error("POST /api/items error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/items/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid id parameter" });
    }
    const existing = await Item.findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    const payload = {
      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      cost: req.body.cost,
      type: req.body.type
    };
    const { error, value } = validateItemPayload(payload);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => ({ field: d.path.join("."), message: d.message }))
      });
    }
    existing.name = value.name;
    existing.description = value.description;
    existing.value = value.value;
    existing.cost = value.cost;
    existing.type = value.type;
    if (req.file) {
      existing.image = "/images/" + req.file.filename;
    }
    await existing.save();
    return res.status(200).json({ success: true, item: existing.toObject() });
  } catch (err) {
    console.error("PUT /api/items/:id error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid id parameter" });
    }
    const deleted = await Item.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    return res.status(200).json({ success: true, item: deleted.toObject() });
  } catch (err) {
    console.error("DELETE /api/items/:id error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
