const nodemailer = require("nodemailer");
const dotenv = require("dotenv")


// !Load dotenv into process object
dotenv.config();

const sendAccountVerificationEmail = async(to, verificationToken)=>{
    try{
        //!create a transport object
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com", //? smtp => simple mail transfer protocall
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PWD
            }
        });
        //! create the message to the send 
        const message = {
            to,
            subject: "Account Verification Token",
            html:`You are receiving this email because you (or someone else) have requested to verify your account</p>

             <p>Please click on the following link, or paste this into your browser to complete the process:</p>

             <p>https://localhost:3000/reset-password/${verificationToken}</p>

             spolf you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };
        // !Send the mail
        await transport.sendMail(message);
    }catch(error){
        console.error(error);
        throw new Error("Email seding failed!")
    }
};
module.exports = sendAccountVerificationEmail;
