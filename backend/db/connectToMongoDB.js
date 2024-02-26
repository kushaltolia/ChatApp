import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to mongo db");
    } catch (error) {
        console.log("Error connecting");
    }
}

export default connectToMongoDB;