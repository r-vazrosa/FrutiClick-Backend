const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/items", (req, res)=>{
    const items = [
        {
            "id": 1,
            "name": "Flimsy CD",
            "description": "A Flimsy CD you bought from a random guy you found on the street who said had mystic properties, instead it was a text file saying thanks for the money.",
            "value": 1,
            "type": "click",
            "image": "images/item-img-1.png"
        },
        {
            "id": 2,
            "name": "Mr. Click's Hand",
            "description": "Mr.Click was a good man, but ever since people found the power his hand held they sought it too. Buying this while knowing this makes you a monster.",
            "value": 10,
            "type": "second",
            "image": "images/item-img-2.png"
        },
        {
            "id": 3,
            "name": "Joystick of DOOOMMM",
            "description": "THIS IS THE JOYSTICK OF DOOMMM, IT HAS THE POWER TO DESTROY THE WORLDDD. WAIT, DON'T TOUCH ITT. oh, nothing happened.",
            "value": 20,
            "type": "click",
            "image": "images/item-img-3.png"
        },
        {
            "id": 4,
            "name": "Importance",
            "description": "The essence of an excalmation mark trapped in form. A mad scientist wanted to show his idea to the world and created this to force people to care.",
            "value": 200,
            "type": "second",
            "image": "images/item-img-4.png"
        },
        {
            "id": 5,
            "name": "Mr. Smiley",
            "description": "Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend. Mr. Smiley is always smiling, he is your friend.",
            "value": 1000,
            "type": "click",
            "image": "images/item-img-5.png"
        },
        {
            "id": 6,
            "name": "WFO",
            "description": "So you're seriously telling me you actually saw a WFO? A wonderful flying object? You know those aren't real right, you're always lying to me.",
            "value": 10000,
            "type": "click",
            "image": "images/item-img-6.png"
        },
        {
            "id": 7,
            "name": "GameMan",
            "description": "The GameMan is a machine where your most wild imaginations can be emulated on it. Dreams, aspirations, and even evil can be shown on it's screen. This is not supposed to be anything else...",
            "value": 300000,
            "type": "second",
            "image": "images/item-img-7.png"
        },
        {
            "id": 8,
            "name": "Starite",
            "description": "This is where all the starries come from, the final frontier of stardom. To be the starite is a blessing that none of us will recieve, a fate most crushing.",
            "value": 100000000,
            "type": "second",
            "image": "images/item-img-8.png"
        }
    ];
    res.send(items);
})

app.listen(3002, () => {
    console.log("I'm listening");
})



