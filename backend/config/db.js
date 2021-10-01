import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true,
    });

    console.log(conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
