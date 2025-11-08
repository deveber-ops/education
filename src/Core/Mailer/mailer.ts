import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

export async function sendVerificationEmail(userEmail: string, verificationCode: string) {
    try {
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: userEmail,
            subject: 'Код подтверждения регистрации',
            html: `
                <h1>Добро пожаловать в BLOGGERS PLATFORM!</h1>
                <a href='https://edu.deveber.site/registration-confirmation?code=${verificationCode}'>Подтвердить регистрацию</a>
                <p>Или введите его вручную. Код подтверждения: ${verificationCode}</p>
                <p>Код действителен в течение ${process.env.CONFIRMATION_CODE_EXPERIES_MINUTES} минут.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});