
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');


//Fruit collection
const fruitsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A name is required for the fruit."]
    },
    rating: {
        type: Number,
        min: 1,
        max: [10, "Rate something between 1 to 10"]
    },
    review: String
});

const Fruit = mongoose.model("Fruit", fruitsSchema);

const pineapple = new Fruit({
    name: 'Pineapple',
    rating: 7,
    review: "Pineapples are so sweet!"
});
pineapple.save().then((fruit) => {
    console.log(fruit.name + " saved")
});

//Person collection
const personSchema = mongoose.Schema({
    name: String,
    age: Number,
    // This tells Mongoose that we are embedding a fruit document 
    // inside this property called favouriteFruit
    favouriteFruit: fruitsSchema
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: "Amy",
    age: 18,
    // Add the pineapple as an embedded document in this new person.
    favouriteFruit: pineapple
});

person.save().then((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Person saved.")
    }
});



