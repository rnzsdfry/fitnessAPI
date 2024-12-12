const Workout = require("../models/Workout");
const User = require("../models/User")

const {errorHandler} = require("../auth.js");

module.exports.addWorkout = (req, res) => {

        let newWorkout = new Workout({
            userId: req.user.id,
            name : req.body.name,
            duration : req.body.duration
        });


        return Workout.findOne({name: req.body.name}).then(existingWorkout => {
            if(existingWorkout){
                return res.status(409).send({ message:'Workout already exists' });
            }else{
                return newWorkout.save().then(result => res.status(201).send(newWorkout
                )).catch(error => errorHandler(error, req, res));
            }
        })
        .catch(error => errorHandler(error, req, res));
      
}; 

module.exports.getMyWorkouts = (req, res) => {
    return Workout.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({ message : "No workouts found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res)=>{

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
    .then(workout => {
        if (workout) {
            res.status(200).send({
                message : 'Workout updated successfully',
                updatedWorkout: workout
            });
        } else {
            res.status(404).send({message : 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkout = (req, res) => {
  const workoutId = req.params.workoutId;

  Workout.findByIdAndUpdate(
    workoutId,
    { status: "completed" },
    { new: true, runValidators: true }
  )
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).send({ message: "Workout not found" });
      }
      return res.status(200).send({
        message: "Workout status updated successfully",
        updatedWorkout,
      });
    })
    .catch((err) => errorHandler(err, req, res));
};




module.exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.workoutId;

    return Workout.findByIdAndDelete(workoutId)
        .then(deletedWorkout => {
            if (deletedWorkout) {
                return res.status(200).send({
                    message: 'Workout successfully deleted'
                });
            } else {
                return res.status(404).send({ message: 'Workout not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};