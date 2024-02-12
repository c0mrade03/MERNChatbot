import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL as string);
  }
  catch (error) {
    throw new Error("Cannot connect to database");

  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  }
  catch (error) {
    throw new Error("couldn't disconnect to database");
  }
}

export { connectToDatabase, disconnectFromDatabase };