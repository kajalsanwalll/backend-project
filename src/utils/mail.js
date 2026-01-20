import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Task Manager",
                link: "https://taskmanagerlink.com"
            }

    })

    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent)

    const emailHTML = mailGenerator.generate(
        options.mailgenContent)


    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    }) 
    
    const mail = {
        from: "kajalsanwal777@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.log("Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file");
        console.error("Error:", error);
    }

}


const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body:{
            name: username,
            intro: "Welcome to our App! We're excited to have you on board! Lessgo!!",
            action: {
                instructions: "Click on the button below to verify your email",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl
                }
            },
            outro: "Have questions? Just reply to this mail, we'd love to help!"
        }
    };
}

const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body:{
            name: username,
            intro: "We got a request to reset password for your account!",
            action: {
                instructions: "Click on the button below to reset your password",
                button: {
                    color: "#2253bc",
                    text: "Reset Password",
                    link: passwordResetUrl
                }
            },
            outro: "Have questions? Just reply to this mail, we'd love to help!"
        }
    };
}
 

export {
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent,
    sendEmail,
}