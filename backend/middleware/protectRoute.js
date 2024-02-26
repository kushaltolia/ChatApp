import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export default async function protectRoute (req, res, next) {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                error : "Unauthorized - no Token provided"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({
                error : "Unauthorized - Invalid Token provided"
            })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user) {
            return res.status(404).json({
                error : "Unauthorized - User not found"
            })
        }
        req.user = user;
        next();
    } catch(error) {
        console.log("Error in protectionRoute middlewware");
        res.status(500).json({
            error : "Internal Server Error"
        })
    }
}