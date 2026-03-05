const User = require("../model/User");
const bcrypt = require("bcryptjs");

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  return user;
};

const getAllUsers = async () => {
  // Return all users, excluding passwords
  return await User.find().select("-password");
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
