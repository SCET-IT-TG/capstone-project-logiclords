import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
{
  // AUTO GENERATED STUDENT ID
  student_id:{
    type:String,
    required:true,
    unique:true
  },

  // ENROLLMENT NUMBER
  enrollment_no:{
    type:String,
    required:true,
    unique:true
  },

  // NAME
  first_name:{
    type:String,
    required:true
  },

  middle_name:{
    type:String,
    default:""
  },

  last_name:{
    type:String,
    required:true
  },

  // DOB
  date_of_birth:{
    type:Date,
    required:true
  },

  // AGE (Derived)
  age:{
    type:Number
  },

  // GENDER
  gender:{
    type:String,
    enum:["Male","Female","Other"],
    required:true
  },

  // ADDRESS
  permanent_address:{
    type:String,
    required:true
  },

  // MOBILE NUMBERS
  student_mobile:{
    type:String,
    required:true
  },

  parent_mobile:{
    type:String,
    required:true
  },

  // EMAIL
  email:{
    type:String,
    required:true,
    unique:true
  },

  // PASSWORD
  password:{
    type:String,
    required:true
  },

  // MEDICAL ISSUES
  medical_issues:{
    type:String,
    default:""
  },

  // ADMISSION DATE
  admission_date:{
    type:Date,
    required:true
  },

  // ROOM NUMBER (DISPLAY)
  room_no:{
    type:String
  },

  // ROOM REFERENCE (Optional if using room collection)
  room_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Room"
  },

  // FEE STATUS
  fee_status:{
    type:String,
    enum:["pending","partial","paid"],
    default:"pending"
  },

  // TOTAL FEE
  total_fee:{
    type:Number,
    default:0
  },

  // PAID AMOUNT
  paid_amount:{
    type:Number,
    default:0
  },

  // QR CODE
  qr_code:{
    type:String
  },

  // PROFILE PHOTO
  profile_photo:{
    type:String,
    default:"uploads/default-avatar.png"
  },

  // ROLE
  role:{
    type:String,
    default:"student"
  }

},
{timestamps:true}
);

// VIRTUAL FIELD → DUE AMOUNT
studentSchema.virtual("due_amount").get(function(){
  return this.total_fee - this.paid_amount;
});

export default mongoose.model("Student",studentSchema);