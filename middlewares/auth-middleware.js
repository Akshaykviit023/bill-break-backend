// auth-middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const userVerification = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    //const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ status: false, message: 'Access Denied: No Token Provided' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(data.id);
        console.log(user);
        if (!user) {
            return res.status(401).json({ status: false, message: 'Access Denied: User Not Found' });
        }
        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ status: false, message: 'Invalid Token' });
    }
};
