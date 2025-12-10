const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendNotifyEmail(receiverEmails, subject, data) {
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
  <p>Great news! Our product ${data.name} ${data.model} is back in stock and ready for purchase! Get yours now before it sells out again!</p>
  <p>For more details, you can contact us on <a href="mailto:ecommerce@premindustries.com">ecommerce@premindustries.com</a> or call us at <a href="tel:+918447247227">+91 8447247227</a>.</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = receiverEmails.map((email) => ({
    email,
    name: `${data.name}`,
  }));

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

module.exports = sendNotifyEmail;
