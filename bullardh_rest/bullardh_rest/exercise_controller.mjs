import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercise from './exercise_model.mjs';
import { body, validationResult } from 'express-validator'


const app = express();

app.use(express.json())

const PORT = process.env.PORT;

app.post('/exercises', 
    body('name').isLength({ min: 1 }),
    body('reps').isInt({ min: 1 }),
    body('weight').isInt({ min: 1 }),
    body('unit').isIn(["kgs", "lbs"]),
    body('date').isDate("01-30-22", {format: 'MM-DD-YY', delimiter: ['-'], strictMode: true}),
    async (req, res) => {
        const errors = validationResult(req.body);
        if(!errors.isEmpty()) {
            return res.status(400).json({Error: 'Invalid Request'});
        }
    exercise.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Invalid Request' });
        });
});
/* Body: A JSON array containing the entire collection.
 *If the collection is empty, the response will be an empty array
 *Each document in the collection must be a JSON object with all the properties of the document including the ID.
*/

app.get("/exercises", asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query._id !== undefined) {
        filter._id = req.query._id;
    }
    if (req.query.reps !== undefined) {
        filter.reps = req.query.reps;
    }
    if (req.query.name !== undefined) {
        filter.name = req.query.name;
    }
    if (req.query.date !== undefined) {
        filter.date = req.query.date;
    }
    if (req.query.weight !== undefined) {
        filter.weight = req.query.weight;
    }
    if (req.query.unit !== undefined) {
        filter.unit = req.query.unit;
    }
    exercise.findExercise(filter)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Invalid Request' });
        });
}));

// Get by ID
app.get('/exercises/:id', (req, res) => {
    exercise.findExerciseByID(req.params.id)
        .then(exercise => {
            if(exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({Error: 'Not found'});
            }
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Invalid Request' });
        });
    })

//update by id

app.put('/exercises/:id', (req, res) => {
    exercise.replaceExercise(req.params.id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exerciseUpdated => {
            if(exerciseUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Invalid request' });
        });
});

app.delete('/exercises/:id', asyncHandler(async (req, res) => {
    exercise.deleteById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found'})
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed'});
        })
}))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});