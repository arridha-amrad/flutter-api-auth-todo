const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

app.use(express.json({ extended: false }));

app.use("/api/user", require("./routes/user-api"));

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log("MongoDB connected 🚀");
		return app.listen(PORT);
	})
	.then(() => console.log(`Server running from port ${PORT}🚀`))
	.catch(err => console.log(err));
