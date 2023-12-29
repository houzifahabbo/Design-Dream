const mongoose = require("mongoose");

// Retrieve the MongoDB connection URI from the environment variables
// const mongoURI = process.env.MONGO_URI;
// const mongoURI_TEST = process.env.MONGODB_TEST_URI;
const mongoURI = "mongodb://localhost:27017/arch";
const mongoURI_TEST = "mongodb://localhost:27017/arch_test";

const dbURI = process.env.NODE_ENV === "test" ? mongoURI_TEST : mongoURI;

//TODO: remove the localhost connection string
// Establish a connection to the database
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for the connection events
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

module.exports = mongoose;