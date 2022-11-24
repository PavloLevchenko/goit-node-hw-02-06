// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require("@sendgrid/mail");

const getVerificationUrl = (req, verificationToken) => {
  return (
    req.protocol +
    "://" +
    req.headers.host +
    "/api/users/verify/" +
    verificationToken
  );
};

const sendVerificationMail = (email, verificationUrl) => {
  const msg = {
    to: email, // Change to your recipient
    from: process.env.VERIFIED_SENDER, // Change to your verified sender
    subject: "Email verification from phonebook",
    html: `<div style="text-align:center;">
      <p>By clicking on the following link, you are confirming your email address.</p>
      <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">
        <Button type="Button">Confirm email address</Button>
      </a>
    </div>`,
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
      openTracking: {
        enable: false,
      },
    },
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail.send(msg);
};

module.exports = { getVerificationUrl, sendVerificationMail };
