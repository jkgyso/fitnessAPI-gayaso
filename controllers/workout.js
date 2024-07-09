const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId: req.user.id,
        name: req.body.name,
        duration: req.body.duration
    });

    newWorkout.save()
        .then(savedWorkout => res.status(201).send(savedWorkout))
        .catch(saveErr => {
            console.error("Error in adding the workout: ", saveErr);
            return res.status(500).send({ error: 'Failed to save the workout' });
        });
};


module.exports.getMyWorkouts = (req, res) => {

    Workout.find({ userId: req.user.id })
        .then(workouts => {
            if (workouts.length > 0) {
                return res.status(200).send({ workouts });
            } else {
                return res.status(200).send({ message: 'No workouts found.' });
            }
        })
        .catch(err => res.status(500).send({ error: 'Error finding workouts.' }));
};

module.exports.updateWorkout = (req, res) => {

    let workoutId = req.params.id;

    let workoutUpdates = {
        name: req.body.name,
        duration: req.body.duration
    };

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: req.user.id },
        workoutUpdates,
        { new: true } 
    )
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or unauthorized.' });
        }

        return res.status(200).send({ 
            message: 'Workout updated successfully', 
            updatedWorkout: {
                ...updatedWorkout.toObject(),
                userId: req.user.id
            }
        });
    })
    .catch(err => {
        console.error("Error in updating the workout : ", err);
        return res.status(500).send({ error: 'Error in updating the workout.' });
    });
};

module.exports.deleteWorkout = (req, res) => {

    return Workout.deleteOne({ _id: req.params.id})
    .then(deletedResult => {

        if (deletedResult < 1) {

            return res.status(400).send({ error: 'No Workout deleted' });

        }

        return res.status(200).send({ 
        	message: 'Workout deleted successfully'
        });

    })
    .catch(err => {
		console.error("Error in deleting the Workout : ", err)
		return res.status(500).send({ error: 'Error in deleting the Workout.' });
	});
};


module.exports.completeWorkoutStatus = (req, res) => {
    let workoutId = req.params.id;

    Workout.findOne({ _id: workoutId, userId: req.user.id })
        .then(existingWorkout => {
            if (!existingWorkout) {
                return res.status(404).send({ error: 'Workout not found or unauthorized.' });
            }

            if (existingWorkout.status === 'completed') {
                return res.status(400).send({ error: 'Workout is already completed.' });
            }

            existingWorkout.status = 'completed';

            return existingWorkout.save()
                .then(updatedWorkout => {
                    return res.status(200).send({
                        message: 'Workout status updated successfully',
                        updatedWorkout: {
                            ...updatedWorkout.toObject(),
                            userId: req.user.id
                        }
                    });
                })
                .catch(saveErr => {
                    console.error("Error in saving updated workout : ", saveErr);
                    return res.status(500).send({ error: 'Error in saving updated workout.' });
                });

        })
        .catch(err => {
            console.error("Error in finding workout : ", err);
            return res.status(500).send({ error: 'Error in finding workout.' });
        });
};