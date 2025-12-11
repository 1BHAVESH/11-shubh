import nodemailer from "nodemailer";

export const mailSend = async (req, res) => {
  const { name, email, phone, message, projectType } = req.body;

  console.log(name, email, phone, message, projectType);

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    let htmlTemplate = "";

    //  CASE 1: Project Selected (projectType exists)
    if (projectType) {
      htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f7f7f7;">
        <div style="max-width: 600px; margin: auto; background:#ffffff; padding: 20px; border-radius: 10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

          <h2 style="color:#C29A2D; margin-bottom: 15px;">📩 New Project Enquiry</h2>

          <p style="font-size: 15px; color:#333;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 15px; color:#333;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 15px; color:#333;"><strong>Phone:</strong> ${phone}</p>

          <p style="font-size: 15px; color:#333;"><strong>Selected Project:</strong> ${projectType}</p>

          <div style="margin-top: 15px; padding:15px; background:#fafafa; border-left: 4px solid #C29A2D;">
            <p style="font-size: 15px; color:#333; margin:0;"><strong>Message:</strong></p>
            <p style="font-size: 15px; color:#555; white-space:pre-line;">${message}</p>
          </div>

          <p style="margin-top: 25px; font-size:13px; color:#777;">
            — This email was sent automatically from the Website Project Enquiry Form.
          </p>

        </div>
      </div>`;
    }

    //  CASE 2: No project (Normal Enquiry)
    else {
      htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f7f7f7;">
        <div style="max-width: 600px; margin: auto; background:#ffffff; padding: 20px; border-radius: 10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

          <h2 style="color:#C29A2D; margin-bottom: 15px;">📩 New General Enquiry</h2>

          <p style="font-size: 15px; color:#333;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 15px; color:#333;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 15px; color:#333;"><strong>Phone:</strong> ${phone}</p>

          <div style="margin-top: 15px; padding:15px; background:#fafafa; border-left: 4px solid #C29A2D;">
            <p style="font-size: 15px; color:#333; margin:0;"><strong>Message:</strong></p>
            <p style="font-size: 15px; color:#555; white-space:pre-line;">${message}</p>
          </div>

          <p style="margin-top: 25px; font-size:13px; color:#777;">
            — This email was sent automatically from the Website Contact Form.
          </p>

        </div>
      </div>`;
    }

    //  Send Email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "1bhaveshjaswani1@gmail.com",
      subject: projectType ? `Enquiry - ${projectType}` : "General Enquiry",
      html: htmlTemplate,
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.log(error, "SMTP Error");
    res.status(500).json({ success: false, message: "Error sending email", error });
  }
};
