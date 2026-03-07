import * as userService from "./user.service.js";
import { registerSchema, loginSchema } from "./user.validation.js";
import { generateToken } from "../../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const user = await userService.registerUser(validated);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user:{
        name: user.name,
        email: user.email,
        
      },
      token
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await userService.loginUser(validated);

    const token = generateToken(user);

    res.json({
      success: true,
      token
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const registerAdmin = async(req,res) =>{
   try {
    const validated = registerSchema.parse(req.body);

    const user = await userService.registerAdmin(validated);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user:{
        name: user.name,
        email: user.email,
        
      },
      token
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
