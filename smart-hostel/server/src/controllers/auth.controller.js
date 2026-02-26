import { loginUser } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.json({
      success: true,
      user,
      token
    });

  } catch (error) {
    res.status(401).json({
      message: error.message
    });
  }
};