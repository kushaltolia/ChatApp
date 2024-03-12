import User from "../models/user.model.js";

export async function getUserForSideBar(req, res) {
    try {
        const loggedInUserId = req.user._id;
        const allUsers = await User.find({_id : { $ne : loggedInUserId}}).select("-password");
        res.status(200).json(allUsers)
    } catch {
        console.log("Error getting all the users");
        res.status(400).json({
            error : "Internal Server error"
        })
    }
}