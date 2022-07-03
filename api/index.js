const app = require('express')();
const cors = require("cors");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

console.log("yes");

app.use(cors());

app.post('/api/sendMail', jsonParser, async (req,res)=> {
    const {addresses, subject, htmlSrc} = req.body;
    try {

        const OAuth2 = google.auth.OAuth2;

        const OAuth2Client = new OAuth2(
            process.env.GOOGLE_GMAIL_CLIENT_ID,
            process.env.GOOGLE_GMAIL_CLIENT_SECRET,
        )

        OAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN
        });

        const accessToken = OAuth2Client.getAccessToken();

        transporter = nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: 'inflatedemails@gmail.com',
                clientId: process.env.GOOGLE_GMAIL_CLIENT_ID,
                accessToken: accessToken,
                clientSecret: process.env.GOOGLE_GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_GMAIL_REFRESH_TOKEN
            }
        })
        const mail_options = {
            from: `inflatedemails@gmail.com`,
            to: addresses,
            subject: subject,
            html: htmlSrc
        }

        transporter.sendMail(mail_options, function(error, result) {
            if(error) res.status(400);
            else res.send(result);
            console.log(result);
            transporter.close;
        })

    } catch (error) {
        res.status(400);
        console.log(error);
    }
})

module.exports = app;