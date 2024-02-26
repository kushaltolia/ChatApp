import jwt from "jsonwebtoken";

const generateTokeAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : '25d'
    })
    res.cookie("jwt", token, {
        maxAge : 25 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "strict"
    })
}

export default generateTokeAndSetCookie;
