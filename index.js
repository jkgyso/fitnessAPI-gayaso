const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://admin:admin1234@gysodb.nijqxz1.mongodb.net/Fitness-App?retryWrites=true&w=majority&appName=gysoDB');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log(`We're now connected to MongoDb Atlas`));

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

if(require.main === module) {
	app.listen(process.env.PORT || port, () => console.log(`API is now online on port ${process.env.PORT || port}`))
}

module.exports = {app, mongoose}