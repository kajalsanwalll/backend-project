import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import {ApiError} from "../utils/api-errors.js";
import { emailVerificationMailGenContent, sendEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken";


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

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
     .status(200)
     .json(
        new ApiResponse(
            200, 
            req.user,
            "Current user fetched successfully!"
        )
     )
})

const verifyEmail = asyncHandler( async (req, res) => {
    const {verificationToken} = req.params

    if(!verificationToken){
        throw new ApiError(
            404, "email verification token is missing!"
        )
    }

    let hashedToken = crypto
     .createHash("sha256")
     .update(verificationToken)
     .digest("hex")
     
     const user = await User.findOne(
        {
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {$gt: Date.now()}
        })

      if(!user){
        throw new ApiError(
            400, "Token is invalid or expired!"
        )
      }
      
      user.emailVerificationToken = undefined
      user.emailVerificationExpiry = undefined

      user.isEmailVerified = true
      await user.save({validateBeforeSave: false})

      return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {
                isEmailVerified: true
            },
            "Email is verified!"
        )
      )

})

const resendEmailVerification = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(
            404, "User does not exist!"
        )
    }
    if(user.isEmailVerified){
        throw new ApiError(
            409, "Email is already verified!"
        )
    }

    // if user not yet verified: then repeat registering
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
    
    return res
     .status(200)
     .json(
        new ApiResponse(
            200, {},
            "Mail has been sent to your email id."
        )
     )

})
const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(
            401, "Unauthorized access!"
        )
    }

    try {
       const decodedToken = json.verify(incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET)

       const user = await User.findById(decodedToken?._id);

       if(!user){
        throw new ApiError(
            401, "Invalid refresh token!"
        )
       }

       if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired!")
       }
       
        // now setting things in cookies using options
        const options = {
            httpOnly: true,
            secure: true
        }

        //generate access token based on id
        const {accessToken, refreshToken: newRefreshToken} = await 
        generateAccessAndRefreshTokens(user._id)

        user.refreshToken = newRefreshToken;  // save to database
        await user.save();
        
        return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
            new ApiResponse(
                 200, {
                    accessToken, newRefreshToken
                }, 
                "Access token refreshed!"
            )
         )
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token!")
    }

})

const forgotPasswordRequest = asyncHandler( async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email}) // find user in database

    if(!user){
        throw new ApiError(
            404, "User does not exist!"
        )
    }

    const {unHashedToken, hashedToken, tokenExpiry} = 
    user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    await sendEmail(
        {
            email: user?.email,
            subject: "Password reset request!",
            mailgenContent: forgotPasswordMailGenContent(
                user.username,
                `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/$
                {unHashedToken}`,

            ),
        }
    );

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
             {},
             "Password reset mail has been sent to you!"
        )
     )

})
const resetForgotPassword = asyncHandler( async (req, res) => {
    const {resetToken} = req.params // url se 
    const {newPassword} = req.body

    // now hash the token 
    let hashedToken = crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken:hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}  // gt = greater than
    }) 

    if(!user){
        throw new ApiError(
            489, "Token is invalid or expired!"
        )
    }

    // if user is there, then clean up already existing values for password
    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    user.password = newPassword // already will be hashed because of pre- hook

    await user.save({validateBeforeSave: false})

    return res
     .status(201)
     .json(
        new ApiResponse(
            200, 
            {},
            "Password reset successfully!"
        )
     )

})   
const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(
            401,"Invalid old password."
        )
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully!"
        )
     )

})    

export {
   registerUser,
   login,
   logoutUser,
   getCurrentUser,
   verifyEmail,
   resendEmailVerification,
   refreshAccessToken,
   forgotPasswordRequest,
   changeCurrentPassword,
   resetForgotPassword
 };