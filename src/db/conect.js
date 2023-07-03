import { connect } from "mongoose";
const connectDB = (url) => {
  console.log("DB connected", url);
  return connect(url);
};
export default connectDB;
