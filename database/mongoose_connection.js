import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const clusterName = process.env.DB_CLUSTER_NAME;
const dbName = process.env.DB_NAME;
const cloudMongoUrl = `mongodb+srv://${userName}:${password}@${clusterName}/${dbName}?retryWrites=true&w=majority`;
const dbToConnect = async () => {
  try {
    await connect(cloudMongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected successfully");
  } catch (err) {
    console.log("error in connecting DB", err);
  }
};
export default dbToConnect;
