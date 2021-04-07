const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://learning-user:${password}@cluster0.uzzja.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const phonebookSchema = new mongoose.Schema({
    Name: String,
    Number: String
});

const Person = mongoose.model("Person", phonebookSchema);

if (process.argv.length === 5) {
    const person = new Person({
        Name: process.argv[3],
        Number: process.argv[4]
    });

    person.save().then((result) => {
        console.log(`added ${result.Name} number ${result.Number} to phonebook`);
        mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        console.log("Phonebook:");
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else {
    console.log(`Unexpected number of arguments`);
    mongoose.connection.close();
}
