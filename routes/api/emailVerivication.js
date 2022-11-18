// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require("@sendgrid/mail");

const getVerificationUrl = (req, verificationToken) => {
  return (
    req.protocol +
    "://" +
    req.headers.host +
    "api/users/verify/:verificationToken" +
    "/?=" +
    verificationToken
  );
};

const sendVerificationMail = (email, verificationToken) => {
  const msg = {
    to: email, // Change to your recipient
    from: process.env.VERIFIED_SENDER, // Change to your verified sender
    subject: "Email verification from phonebook",
    text: "By clicking on the following link, you are confirming your email address.",
    html: `<Button type="Button"><a href="${verificationToken}" target="_blank" rel="noopener noreferrer">Confirm email address/a></Button>`,
  };
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail.send(msg);
};

module.exports = { getVerificationUrl, sendVerificationMail };
