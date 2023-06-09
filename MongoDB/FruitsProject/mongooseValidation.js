
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');

const fruitsSchema = mongoose.Schema({
    name: {
        type: String,
        // Made name field required. The validation error will be thrown  
        // and the error message that we have provided here will ne shown
        // if it has not been added while creating the fruit document.
        required: [true, "A name is required for the fruit."]
    },
    rating: {
        type: Number,
        // creates a validator that checks if the value is greater than or equal to the given minimum.
        min: 1,
        // creates a validator that checks if the value is less than or equal to the given maximum.
        max: [10, "Too much fruits!"]
    },
    review: String
});


const Fruit = mongoose.model("Fruit", fruitsSchema);

const apple = new Fruit({
    name: 'Peaches',
    rating: 10,
    review: "Peaches are so yummy!"
}); 

apple.save().then((fruit) => {
    mongoose.connection.close();
    console.log(fruit.name + " saved")
});

