import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Verify if user has role 'admin' in Supabase 'users' table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    // Attach user to req
    (req as any).user = user;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
