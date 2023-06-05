import { connect } from "mongoose";
const connectDB = (url) => {
  console.log("hellooo", url);
  return connect(url);
};
export default connectDB;
