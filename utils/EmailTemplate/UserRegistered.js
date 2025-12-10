const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendUserRegistrationEmail(receiverEmail, subject, data) {
  const apiClient = brevo.ApiClient.instance;
  const apiKeyAuth = apiClient.authentications["api-key"];
  apiKeyAuth.apiKey = apiKey;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
  <html lang="en">
  
  <body>
  <p>Dear ${data.first_name},</p>
    <p>Welcome to Prem Industries India Limited! We're thrilled to have you on board. Your login credentials are as follows:</p>
    <ul>
        <li><strong>Username:</strong> ${data.email_address}</li>
        
    </ul>
    <p>Start exploring our wide range of packaging solutions to elevate your business.</p>
    <p>Happy Shopping!</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    { email: receiverEmail, name: `${data.first_name} ${data.last_name}` },
  ];

  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log(
        "Transactional email sent successfully. Returned data: " +
          JSON.stringify(data)
      );
    })
    .catch(function (error) {
      console.error("Error sending transactional email:", error);
    });
}

module.exports = sendUserRegistrationEmail;
