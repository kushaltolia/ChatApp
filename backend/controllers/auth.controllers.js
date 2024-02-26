import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokeAndSetCookie from "../utils/generateToken.js";

export async function login(req, res) {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect) {
            return res.status(400).json({
                error : "Invalid credentials"
            })
        }
        generateTokeAndSetCookie(user._id, res);
        res.status(201).json({
            _id : user._id,
            fullName : user.fullName,
            username : user.username,
            profilePic : user.profilePic
        })
    } catch(error) {
        console.log("Error in logging in");
        res.status(500).json({
            error : "Internal Server error"
        })
    }
}

export function logout(req, res) {
    try {
        res.cookie("jwt", "" ,{maxAge : 0});
        res.status(200).json({
            message : "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            Error : "Error in loging out"
        })
    }
}

export async function signup(req, res) {
    console.log("signup user");
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if(password !== confirmPassword) {
            return res.status(400).json({
                error : "Passwords dont match"
            })
        }
        const user = User.findOne({username});
        if(user.username) {
            return res.status(400).json({
                error : `Username ${username} already exist`
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        })
        generateTokeAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            username : newUser.username,
            profilePic : newUser.profilePic
        })
    } catch (error) {
        console.log("Error signing up the user");
        res.status(500).json({
            Error : "Internal server error"
        })
    }
}