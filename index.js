const express = require("express");
const app = express();

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get("/info", (req, res) => {
    const timeNow = new Date();
    res.send(`
    <div>
        <h4>Phonebook has info for ${persons.length} people</h4>
        <h4>${timeNow}</h4>
    </div>
    `);
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
