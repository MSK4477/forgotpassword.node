import { model, Schema } from "mongoose";

const userSchema = new Schema({
  id: {
    type: "string",
  },
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
});

const User = model("Users", userSchema);

export default User;
