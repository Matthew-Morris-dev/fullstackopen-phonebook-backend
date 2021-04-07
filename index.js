const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("custom", function (req) {
    return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :custom"));

app.get("/info", (req, res) => {
    const timeNow = new Date();
    Person.estimatedDocumentCount().then((count) => {
        res.send(`
        <div>
            <h4>Phonebook has info for ${count} people</h4>
            <h4>${timeNow}</h4>
        </div>
        `);
    });
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    if (body.name === null || body.name === undefined) {
        res.status(400).send({ error: `data must contain the field 'name'` });
    }
    if (body.number === null || body.number === undefined) {
        res.status(400).send({ error: `data must contain the field 'number'` });
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

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            res.json(person);
        })
        .catch((error) => {
            next(error);
        });
});

app.put("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true, runValidators: true })
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return resizeTo.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }

    next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
