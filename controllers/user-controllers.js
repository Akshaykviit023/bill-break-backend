import express from "express";
import { hash, compare } from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/token-manager.js";

 export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser)
            return res.status(401).send("user already signed up");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.clearCookie("auth_token");

        const token = createToken(user._id.toString(), user.email, "30d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        res.cookie("auth_token", token, {
            withCredentials: true,
            httpOnly: true,
            expires,
        })

        return res.status(201).json({ message: "OK", id: user._id.toString(), token });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message })
    }
 }

 export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).send("User not registered");
        }

        const isPasswordCorrect = await compare(password, user.password);

        if(!isPasswordCorrect)
            return res.status(403).send("incorrect Password");

        res.clearCookie("auth_token");

        const token = createToken(user._id.toString(), user.email, "30d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        res.cookie("auth_token", token, {
            withCredentials: true,
            httpOnly: true,
            expires,
        })


        return res.status(200).json({ message: "OK", id: user._id.toString(), token })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
 }