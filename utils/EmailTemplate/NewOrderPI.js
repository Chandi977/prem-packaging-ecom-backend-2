const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendNewOrderPlacedEmail(receiverEmail, subject, data) {
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
  <p>Exciting news! A new order <span style={{fontWeight:"700"}}>${data.orderId}</span> of <span style={{fontWeight:"700"}}>${data.name}</span> has been placed. Let's gear up for a seamless packaging process.</p>
  <p>Next step, check for the payment received mail for this order ID and in case it doesn’t come in the next 2 working days, contact the customer for the same. Ensure stock availability and make due arrangements for that to give the customer timely delivery.</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    { email: "vipul.khare11@gmail.com", name: `${data.name}` },
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

module.exports = sendNewOrderPlacedEmail;
