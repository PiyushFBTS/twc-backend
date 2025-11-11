import { Request, Response } from "express";
import { pool } from "../../db/index";
import { editUserSchema } from "../../schema/userSchema"; // we’ll reuse your Zod validation schema

/**
 * Controller: updateUser
 * Description: Updates an existing user's details.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: "Database connection not available" });
    }

    // ✅ Parse and validate input using Zod
    const parseResult = editUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error,
      });
    }

    const { role_code, user_code, user_name, first_name, last_name, password } =
      req.body;

    // ✅ Ensure user_code exists
    if (!user_code) {
      return res.status(400).json({ error: "user_code is required" });
    }

    // ✅ Build dynamic SQL query (if password is being updated)
    let query = `
      UPDATE "OOMiddleware"."users"
      SET role_code = $1,
          user_name = $2,
          first_name = $3,
          last_name = $4
      WHERE user_code = $5
    `;
    const values: any[] = [role_code, user_name, first_name, last_name, user_code];

    // 🔹 Optional: If password is present, update it too
    if (password && password.length >= 5) {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE "OOMiddleware"."users"
        SET role_code = $1,
            user_name = $2,
            first_name = $3,
            last_name = $4,
            password = $5
        WHERE user_code = $6
      `;
      values.splice(4, 0, hashedPassword); // insert before user_code
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
