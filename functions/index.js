const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dyasmine335@gmail.com", // ton Gmail
    pass: "cmqj vbxy jnkv dlir", // mot de passe d'application
  },
});

exports.sendEmailNotification = functions.firestore
    .document("messages/{messageId}")
    .onCreate((snap) => {
      const data = snap.data();

      const mailOptions = {
        from: `"Portfolio Sonna" <dyasmine335@gmail.com>`,
        to: "dyasmine335@gmail.com",
        subject: `Nouveau message de ${data.nom}`,
        text: `
Sujet : ${data.sujet}
Nom : ${data.nom}
Email : ${data.email}
Message : ${data.message}
      `,
      };

      return transporter
          .sendMail(mailOptions)
          .then(() => console.log("✅ Email envoyé"))
          .catch((error) => {
            console.error("❌ Erreur lors de l'envoi :", error);
          });
    });
