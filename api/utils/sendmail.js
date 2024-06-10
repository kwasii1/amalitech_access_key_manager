const nodemailer = require('nodemailer');

const sendEmail = async (req,res,email,subject,text,title) => {
    var mailconfig;
    var transporter = nodemailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        host:process.env.EMAIL_HOST,
        secure:process.env.EMAIL_SECURE,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'clarissa.okon97@ethereal.email',
    //         pass: 'QBFS6db3DfqK2wM2dh'
    //     }
    // });

    var mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        text: 'That was easy!',
        html: `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body>
                <h1>${title}</>
                <p>If you did not request for this then ignore the mail</p>
                <a href='${text}'>Click the link to proceed></a>
          </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.status(500).json({message:"There was a problem sending the email"})
        } else {
            return res.status(200).json({message:"Email sent"})
        }
    });
}


module.exports = {
    sendEmail
}