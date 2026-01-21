import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-errors.js";
import { emailVerificationMailGenContent, sendEmail } from "../utils/mail.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});  // saved to database
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token."
        )
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const {email, username, password, role} = req.body

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(409, "User with this email or username already exists!", [])

    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    })

    const {unHashedToken , hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false}); // cuz ik what im doing!

    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email!",
            mailgenContent: emailVerificationMailGenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,

            ),
        }
    );

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res
     .status(201)
     .json(
        new ApiResponse(
            200,
            {user: createdUser},
            "User registered successfully & Verification mail has been sent to your mail :)"
        )
     )
});

const login = asyncHandler(async (req, res)=> {
     const {email, password, username} = req.body;

    if( !email){
        throw new ApiError(400, "email is required!");
    } 
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400, "User doesn't exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "invalid credentials!")
    }   

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully!"
        )
     )

});

const logoutUser = asyncHandler( async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:""
            }
        },
        {
            new: true
        }
    );
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
     .status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(
        new ApiResponse(
            200, {}, "User logged out!"
        )
     )
})

export {registerUser, login, logoutUser};