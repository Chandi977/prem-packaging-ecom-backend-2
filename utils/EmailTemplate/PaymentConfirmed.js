const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendPaymentConfirmationEmail(receiverEmail, subject, data) {
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
  <p>Hello Team,</p>
  <div>
  <p>Dear Team,</p>

  <p>We've successfully confirmed order <strong>${data.orderId}</strong> of <strong>${data.name} </strong> by confirming the payment with our accounts team. Dispatch the order within 2 working days and update tracking ID and delivery partner on the portal. Let's proceed with care and precision to ensure an impeccable packaging process. Stand ready for any customer queries or support needed.</p>
</div>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    { email: "ecommerce@premindustries.in", name: "Prem Industries India Ltd" },
    { email: "ishita.goel@premindustries.in", name: "Ishita Goel" },
    { email: "raghav.goel@premindustries.in", name: "Raghav Goel" },
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

module.exports = sendPaymentConfirmationEmail;
