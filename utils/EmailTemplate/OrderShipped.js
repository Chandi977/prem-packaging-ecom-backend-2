const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendOrderShippedEmail(receiverEmail, subject, data) {
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
  <p>Hi ${data.name},</p>

    <p>Exciting news! Your packaging order <strong>${data.orderId}</strong> has been shipped. Track your package with the provided details and expect it to arrive soon. The order tracking id and delivery partner details are as follows:</p>

    <p>
        <strong>Tracking Id:</strong> ${data.trackingId}<br>
        <strong>Delivery Partner:</strong> ${data.deliveryPartner}
    </p>
  </body>
  </html>`;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    {
      email: receiverEmail,
      name: `${data.name}`,
    },
    // { email: "ishita.goel@premindustries.in", name: "Ishita Goel" },
    // { email: "raghav.goel@premindustries.in", name: "Raghav Goel" },
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

module.exports = sendOrderShippedEmail;
