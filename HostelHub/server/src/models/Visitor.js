import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
{
  visitor_name:{
    type:String,
    required:true
  },

  mobile_number:{
    type:String,
    required:true
  },

  room_no:{
    type:String,
    default:null
  },

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    default:null
  },

  visit_date:{
    type:Date,
    required:true
  },

  purpose:{
    type:String
  },

  created_by:{
    type:mongoose.Schema.Types.ObjectId,
    refPath:"created_by_model"
  },

  created_by_model:{
    type:String,
    enum:["Student","Admin","Warden"]
  },

  approved:{
    type:Boolean,
    default:false
  },

  check_in:{
    type:Date,
    default:null
  },

  check_out:{
    type:Date,
    default:null
  },

  status:{
    type:String,
    enum:["PENDING","IN","OUT"],
    default:"PENDING"
  }

},
{timestamps:true}
);

export default mongoose.model("Visitor",visitorSchema);