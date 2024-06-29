const nodemailer = require("nodemailer");

const contactUs = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            message: 'Provide All Required Feilds',
            ["exp."]: {
                name: "string",
                email: "string",
                message: "string",
            }
        });
    };

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.email",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GOOGLE_USERID,
                pass: process.env.GOOGLE_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: '"QuizWiz App" <quizwiz@gmail.com>',
            to: "dhru33170@gmail.com",
            subject: "Alert Someone Contact You",
            html: `
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="margin-bottom: 20px; color: #333;">Contact Information</h2>
                <div style="margin-bottom: 15px;">
                    <span style="font-weight: bold; color: #666;">Name:</span>
                    <span style="color: #333;">${name}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <span style="font-weight: bold; color: #666;">Email:</span>
                    <span style="color: #333;">${email}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <span style="font-weight: bold; color: #666;">Message:</span>
                    <p style="margin: 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; color: #333;">
                        ${message}
                    </p>
                </div>
            </div>
        `,
        });

        return res.status(200).json({
            message: 'Information Sent Successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error,
        });
    };
};

module.exports = {
    contactUs
};