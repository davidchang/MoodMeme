var path           = require('path')
  , templatesDir   = path.join(__dirname, 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer = require('nodemailer');


module.exports.sendEmail = function(toWhom, subject) {
    emailTemplates(templatesDir, function(err, template) {

    var transport = nodemailer.createTransport("SMTP", {
          service: "Gmail",
          auth: {
            user: "dchang.me@gmail.com",
            pass: "lgzxdovuexmwmoei"
          }
        });

      template('invite', {}, function(err, html, text) {
        if (err) {
            console.log(err);
          } else {
            transport.sendMail({
              from: 'MoodMeme <team@moodmeme.com>',
              to: 'dchang.me@gmail.com',
              subject: subject,
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }
            });
          }
      });

    });

}
