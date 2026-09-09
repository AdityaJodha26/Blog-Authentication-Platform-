import Mailgen from "mailgen" 
import nodemailer from "nodemailer"

const sendMail = async(options)=>{
    const mailGenerator = new Mailgen({
        theme: "default" , 
        product:{
            name: "blog Authentication Platform" ,
            link: "http://blogAuthenticationPlatformlink.com"
        }

    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenerator.generate(options.mailgenContent) ;
    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST , 
        port:process.env.MAILTRAP_SMTP_PORT , 
        auth:{user:process.env.MAILTRAP_SMTP_USERNAME , 
        pass:process.env.MAILTRAP_SMTP_PASSWORD , }
    })

    const mail = {
        from: "mail.blogPlatform@example.com",
        to:options.email , 
        subject:options.subject , 
        text: emailTextual ,
        html: emailHTML ,
    }

    try{
        const info = await transporter.sendMail(mail)
    }
    catch(error){
        console.error("email sending failed")
        console.error(error) ;
    }
}

const emailVerificationMailgenContent = (username, emailVerificationUrl) => {
    return {
        body: {
            name: username,

            intro: "This email is for verifying your email address.",

            action: {
                instructions: "Click the button below to verify your email.",

                button: {
                    text: "Verify Email",
                    color: "#343255",
                    link: emailVerificationUrl
                }
            },

            outro: "Thank you for verifying your email!"
        }
    };
};


const forgotPasswordMailgenContent = (username, forgotPasswordUrl) => {
    return {
        body: {
            name: username,

            intro: "You requested to reset your password.",

            action: {
                instructions: "Click the button below to reset your password.",

                button: {
                    text: "Reset Password",
                    color: "#343255",
                    link: forgotPasswordUrl
                }
            },

            outro: "If you didn't request this, you can safely ignore this email."
        }
    };
};

export {sendMail , emailVerificationMailgenContent , forgotPasswordMailgenContent}