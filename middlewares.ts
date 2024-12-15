import jwt from "jsonwebtoken";
import type { Request, NextFunction, Response } from "express";

export function Authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.headers?.["Authorization"];

    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }

    jwt.verify(token as string, process.env.JWT_SECRET!, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden" });
        next();
    });
}
