import mongoose from 'mongoose';

// Establish database connection
export const dbConnection = mongoose.connect(
  "mongodb+srv://ahmed99:MRSM2xiT5BZUbo9A@cluster0.hsx7vm8.mongodb.net/Commerce", 
  {
    // Options can be added here if needed (e.g., useNewUrlParser, useUnifiedTopology)
  }
)
  .then(() => {
    console.log("Database connected..."); // Log success message on successful connection
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message); // Log error message on failure
  });
