export const loginService = async (email, password) => {
  console.log("Entered Email:", email);

  const admin = await Admin.findOne({ email });
  const student = await Student.findOne({ email });
  const warden = await Warden.findOne({ email });

  console.log("Admin:", admin);
  console.log("Student:", student);
  console.log("Warden:", warden);

  const user = admin || student || warden;

  if (!user) throw new Error("User not found");

  console.log("Stored Password:", user.password);

  const match = await bcrypt.compare(password, user.password);
  console.log("Password Match:", match);

  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role || "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};