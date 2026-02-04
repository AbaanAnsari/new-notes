
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Get Users
export async function getAllUsers(req, res) {
    try {
        const users = await User.find().sort({ createdAt: -1 });  //sort({ createdAt: -1 }) to get latest users first
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers Controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error generating tokens"
        })
    }
}


//Create Account
export async function createAccount(req, res) {
    const { fullName, email, password } = req.body;
    if (
        [fullName, email, password].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.status(409).json({
            error: true,
            message: "User already exist"
        })
    }

    const user = await User.create({
        fullName,
        email,
        password,
    });
};


//Login User
export async function loginUser(req, res) {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            error: true,
            message: "Email is required"
        })
    }

    const userInfo = await User.findOne({
        email: email
    });

    if (!userInfo) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await userInfo.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            error: true,
            message: "Invalid password"
        })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userInfo._id)

    const loggedInUser = await User.findById(userInfo._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            user: loggedInUser,
            accessToken,
            refreshToken,
            message: "Login Successful"
        });
};


//Logout User
export async function LogoutUser(req, res) {
    await User.findByIdAndUpdate(req.userInfo._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "Logout Successful",
        })
};

// Refresh Access Token
export async function refreshAccessToken(req, res) {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({
            message: "Refresh token is required"
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const userInfo = await User.findById(decodedToken?._id)

        if (!userInfo) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (incomingRefreshToken !== userInfo?.refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(userInfo._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                {
                    accessToken,
                    refreshToken: newRefreshToken,
                    message: "Access token refreshed"
                })
    } catch (error) {
        return res.status(401).json({
            error: true,
            message: "Invalid refresh token"
        })
    }

}


