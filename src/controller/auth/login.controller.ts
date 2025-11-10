import { Request, Response } from "express";
import { pool } from "../../db/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

/**
 * Controller: login
 * Description: Validates user credentials and returns JWT token.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 🔹 Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    // 🔹 Fetch user from database
    const result = await pool.query(
      `SELECT * FROM "OOMiddleware"."users" WHERE user_name = $1`,
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "No user found with this username" });
    }

    // 🔹 Validate password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 🔹 Generate JWT
    const token = jwt.sign(
      {
        user_code: user.user_code,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // 1 day expiration
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_code: user.user_code,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
