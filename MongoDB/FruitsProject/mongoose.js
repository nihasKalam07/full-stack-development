
const mongoose = require('mongoose');

// To avoid deprecation warning
mongoose.set("strictQuery", false);

// Here the "/fruitsDB" in the Url is the name of the database that
// we want to create or connect to. And if it doesn't exist, then it will
// create this brand new database.
mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');

// The first thing we have to do is to create a new schema.
// And this is basically a blueprint or the structure of our data that 
// we're going to save into our MongoDB database.
//  Inside the mongoose schema, we add a new Javascript object.
// Now in this schema, we basically scaffold out how we want data 
// in a particular collection to be structured.
const fruitsSchema = mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

// After we create the schema, we use the schema to create a Mongoose model.
// The function has two parameters. The first one is, what is going to be the 
// name of the collection that is going to comply with this particular schema.
// Now the Mongoose way of doing things is to specify the singular name 
// of your collection. Mongoose will very cleverly convert this string into 
// a pluralize form to create your collection. Behind the scenes, it's actually
// using Lodash to achieve it. So, in terminal we have to like use db.fruits. 
// In our case, the collection name "Fruit" will be converted to 
// "Fruits" by the mongoose. By doing this you will have created a new collection 
// called fruits and those fruits have to stick to the structure that 
// we've specified in the fruit schema.
const Fruit = mongoose.model("Fruit", fruitsSchema);

// CREATE
// And now and only now are we ready to create a new fruit document.
const apple = new Fruit({
    name: 'Apple',
    rating: 9,
    review: "Pretty solid as a fruit."
});

// And this calls the save method in Mongoose to save this fruit document into 
// a fruit collection inside our fruitsDB. And that replaces our insertDocuments method from
// the Mongo client.
// apple.save().then(() => console.log('Fruit saved'));


//Add a collection called People
const peopleSchema = mongoose.Schema({
    name: String,
    age: Number
});

const People = mongoose.model("People", peopleSchema);

const people = new People({
    name: "Nihas",
    age: 34
});

// people.save().then(() => { console.log("People saved.") });


// Add multiple documents 

const banana = new Fruit({
    name: "Banana",
    rating: 5,
    review: "A good fruit"
});

const plums = new Fruit({
    name: "Plums",
    rating: 8,
    review: "Very Yummy!"
});

const orange = new Fruit({
    name: "Orange",
    rating: 7,
    review: "Too sour for me!"
});
const fruits = [banana, plums, orange];

// Fruit.insertMany(fruits, (error, fruits) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(fruits);
//     }
// });

// READ
// Read data using mongoose. Here "Fruit" is the model
Fruit.find((err, fruits) => {
    if (err) {
        console.log(err);
    } else {
        // close the connection after retrieving the data.
        mongoose.connection.close();

        fruits.forEach((fruit) => {
            console.log(fruit.name);
        });
    }
});

// UPDATE
// Fruit.updateOne({name: "Apple"}, {rating: 10}, (err) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log("successfully updated the document");
//     }
// });

// Fruit.updateMany({name: "Peaches"}, {review: "Peaches are so yummy!"}, (err) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log("successfully updated the document");
//     }
// });

// DELETE
Fruit.deleteOne({ name: "Banana" }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("successfully deleted the document");
    }
});

// People.deleteMany({ name: "Nihas", age: {$gte: 6} }, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("successfully deleted the document");
//     }
// });
