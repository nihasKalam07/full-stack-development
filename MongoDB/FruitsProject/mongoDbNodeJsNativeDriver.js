
const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Now everything that you see that is related to assert be it on 
// Node.js applications or iOS applications, it's always to do with testing.
const assert = require('assert');

// Connection URL. The important thing to note here is that when you're working with MongoDB the port that they use is pretty much always 27017. And this is just, some sort of arbitrary number that they've decided upon.
const url = 'mongodb://127.0.0.1:27017';

//create a new Mongo client which is going to connect to our MOngoDB database.
const client = new MongoClient(url);

// Database Name.if a fruitsDB doesn't exist then it will create it.
const dbName = 'fruitsDB';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    // this code will create a new collection called "fruits" inside our fruitsDB. 
    // And this is equivalent to when we used our new database and then we said db.fruits.insert.
    const collection = db.collection('fruits');

    // the following code examples can be pasted here...
    // await insertFruits(collection, (insertResult) => {
    //     console.log('Inserted documents =>', insertResult);
    // });

    await findFruits(collection, (fruits) => {
        console.log(fruits)
    });

    return 'done.';
}

//Insert documents to collection.
const insertFruits = async function (collection, callback) {
    // So as we saw before in the Mono shell whenever you see a pair of  curly brackets that's going to be an individual document or an individual record. And in our case we're going to insert three fruits.
    const insertResult = await collection.insertMany(
        [
            {
                name: "Apple",
                score: 8,
                review: "Great Fruit"
            },
            {
                name: "Orange",
                score: 6,
                review: "Kinda sour"
            }, {
                name: "Plums",
                score: 10,
                review: "Great Fruit"
            }
        ]
    );
    callback(insertResult);
}

// Read method return result as a Javascript object. So if we now have access to these living Javascript objects inside an array in our app.js then we can use our Javascript code and Node.js to do whatever it is that we wish with it. 
const findFruits = async function (collection, callback) {
    const findResult = await collection.find({}).toArray();
    callback(findResult);
}

main()
    .then(console.log)
    .catch(handleError(console.error))
    .finally(() => client.close());// once we are done with the connection, we close the connection.

function handleError(error) {
    assert.equal(console.error, error);
}