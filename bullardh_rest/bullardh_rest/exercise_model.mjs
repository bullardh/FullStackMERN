import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
/**
 * Define a Schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 1 }, 
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: ['kgs', 'lbs']},
    date: {type: String, required: true, validate: {validator: function isDateValid(date) {
        // Test using a regular expression. 
        // To learn about regular expressions see Chapter 6 of the text book
        const format = /^\d\d-\d\d-\d\d$/;
        return format.test(date);
    }, message: props => `${props.value} is not a valid number`} 
}
});

/**
 * Compile the model from the schema. This must be done after defining the Schema
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
 * Create a user
 * @param {String} name
 * @param {Number} reps
 * @param {Number} weight
 * @param {String} unit
 * @param {String} date
 * @returns A promise. Resolves to the Javascript object for the document created by calling save
 */

const createExercise = async (name, reps, weight, unit, date) => {
    
    const exercise = new Exercise({ name: name, reps: reps, weight: weight, unit: unit, date: date });
    return exercise.save();
}


const findExercise = async (filter) => {
   const query = Exercise.find(filter);
   return query.exec();
}

/** find an exercise by ID
 * @param {String} _id
 * @returns
*/
const findExerciseByID = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

const replaceExercise = async (id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({_id: id}, {name: name, reps: reps, weight: weight, unit: unit, date: date}, {runValidators: true});
    return result.modifiedCount;
}

const deleteById = async (id) => {
    const dele = await Exercise.deleteOne({_id: id});
    return dele.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export { createExercise, findExercise, findExerciseByID, replaceExercise, deleteById};