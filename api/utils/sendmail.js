const nodemailer = require('nodemailer');

const sendEmail = async(req,res,email,subject,text) => {
    var transporter = nodemailer.createTransport({
        service:"smtp",
        port:1025,
        host:"localhost",
        secure:false,
        auth:{
            user:"",
            pass:""
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
        from: 'hello@example.com',
        to: email,
        subject: subject,
        text: 'That was easy!',
        html: `<a href='${text}'>Click here to reset your password</a>`
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