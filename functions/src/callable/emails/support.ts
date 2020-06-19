const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

const username = functions.config().gmail.email;
const password = functions.config().gmail.password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
      user: username,
      pass: password
  }
});

export const contactus = functions.https.onRequest((req: any, res: any) => {
  cors(req, res, () => {
      const email = req.body.email;
      const subject = req.body.subject;
      const body = req.body.body;

      const mailOptions = {
          from: `Support <${email}>`,
          to: 'willkoua@gmail.com',
          subject: subject,
          html: `<p>Vous avez été contacté par ${email}</p>
          <p>
          Son message est:
          <blockquote style='white-space:pre'>${body}</blockquote>
          </p>
          `
      };

      // returning result
      return transporter.sendMail(mailOptions, (erro: any, info: any) => {
          if(erro){
              return res.send(erro.toString());
          }
          return res.send('Sended');
      });
  });
});
