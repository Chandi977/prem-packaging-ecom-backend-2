const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendOrderDeliveredEmail(receiverEmail, subject, data) {
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
  <div>
        <p>Hello Team,</p>
        <p>Exciting news! Order <strong>${data.orderId}</strong> of <strong>${data.name}</strong> has been successfully delivered. Ensure customer satisfaction regarding our packaging quality and be available for any post-delivery support. Contact the customer after a few days for their feedback and repeat orders.</p>
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
      console.log(
        "Transactional email sent successfully. Returned data: " +
          JSON.stringify(data)
      );
    })
    .catch(function (error) {
      console.error("Error sending transactional email:", error);
    });
}

module.exports = sendOrderDeliveredEmail;
