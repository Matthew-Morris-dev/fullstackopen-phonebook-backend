const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("custom", function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :custom"));

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// app.get("/info", (req, res) => {
//     const timeNow = new Date();
//     res.send(`
//     <div>
//         <h4>Phonebook has info for ${persons.length} people</h4>
//         <h4>${timeNow}</h4>
//     </div>
//     `);
// });

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (body.name === null || body.name === undefined) {
        res.status(400).send({ error: `data must contain the field 'name'` });
        return;
    }
    if (body.number === null || body.number === undefined) {
        res.status(400).send({ error: `data must contain the field 'number'` });
        return;
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson);
        })
        .catch((error) => {
            next(error);
        });
});

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then((person) => {
            res.json(person);
        })
        .catch((error) => {
            next(error);
        });
});

app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then((deletedPerson) => {
            if (deletedPerson) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((error) => {
            next(error);
        });
});

PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
