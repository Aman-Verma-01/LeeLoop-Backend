import  nodemailer  from "nodemailer"

import dotenv from "dotenv";
dotenv.config();



export const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "HomeLoc Solutions ",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
   
    return info;
  } catch (error) {
    console.log(error.message);
  }
};


