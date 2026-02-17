import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
   
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
},
    {
        timestamps:true,
    }





)

const user = mongoose.model("user", userschema);
export default user;
