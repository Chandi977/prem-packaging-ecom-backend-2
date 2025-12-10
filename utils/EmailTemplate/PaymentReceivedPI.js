const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendPaymentReceivedPI(receiverEmail, subject, data) {
  const apiClient = brevo.ApiClient.instance;
  const apiKeyAuth = apiClient.authentications["api-key"];
  apiKeyAuth.apiKey = apiKey;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  const createdAt = new Date(data.createdAt);
  const formattedDate = `${createdAt.getDate()}/${
    createdAt.getMonth() + 1
  }/${createdAt.getFullYear()}`;
  sendSmtpEmail.htmlContent = `
  <html lang="en">
    
  <body>
    <h1>${subject}</h1>
    <p>Hi ${data.name},</p>
    <p>Thanks for your order!</p>
    <p>Congratulations! We've received your payment for order #${data.orderId}. Your packaging items are now being prepared for shipment.</p>
    <p>Thank you for your purchase!</p>
    <p><span style:"fontWeight:"600">Order ID</span>: ${data.orderId}</p>
    <p><span style:"fontWeight:"600">Order placed on</span> ${formattedDate}</p>
    <p><span style:"fontWeight:"600">UTR no: </span>${data.utrNumber}</p>
    <p><span style:"fontWeight:"600">Total Amount:</span> ${data.totalOrderValue}</p>
    <br/>
    <h2>Billing Address:</h2>
    <p>${data.name} ,</p>
    <p>${data.address},</p>
    <p>${data.town},</p>
    <p>${data.state},</p>
    <p>${data.pincode}.</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [
    {
      email: receiverEmail,
      name: `${data.user.first_name} ${data.user.last_name}`,
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

module.exports = sendPaymentReceivedPI;
