const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;   
function sendUserRegistrationEmailPI(receiverEmail, subject, data) {
  const apiClient = brevo.ApiClient.instance;
  const apiKeyAuth = apiClient.authentications["api-key"];
  apiKeyAuth.apiKey = apiKey;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
  <html lang="en">
  
  <body>
  <h1>${subject}</h1>
  <p>Hi team,</p>
  <p>We have a new member! Welcome <strong>${data.first_name} ${data.last_name}</strong> to our platform.
   Let's ensure a warm introduction and provide any assistance needed. Together, let's make their packaging journey remarkable.</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    { email: "ecommerce@premindustries.in", name: "Prem Industries India Ltd" },
  ];

  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      //console.log('Transactional email sent successfully. Returned data: ' + JSON.stringify(data));
    })
    .catch(function (error) {
      console.error("Error sending transactional email:", error);
    });
}

module.exports = sendUserRegistrationEmailPI;
