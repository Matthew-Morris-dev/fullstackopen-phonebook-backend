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

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.sendStatus(404);
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    console.log(person);
    if (person) {
        persons = persons.map((person) => person.id !== id);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
