const brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendOrderDeliveredEmailPI(receiverEmail, subject, data) {

  const apiClient = brevo.ApiClient.instance;
  const apiKeyAuth = apiClient.authentications["api-key"];
  apiKeyAuth.apiKey = apiKey;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
  <html lang="en">
  
  <body>
  <p>Hi ${data.name},</p>
    <p>Congratulations! Your packaging order ${data.orderId} has been successfully delivered. We hope it meets your expectations. Thank you for choosing Prem Industries India Limited.</p>

    <p><strong>Please note:</strong></p>
    <ul>
        <li>The invoice for this shipment is enclosed for your reference.</li>
        <li>If there are any other shipments that are part of this order, you will receive a separate email just like this one.</li>
        <li>We never request your banking or credit card details via phone calls. Please refrain from sharing your information with fraudulent individuals falsely representing Prem Industries.</li>
        <li>Need assistance or have questions? Explore our website at <a href="https://prempackaging.com">https://prempackaging.com</a></li>
        <li>Have feedback on your shopping experience? Call us at +91 8447247227 or email us at <a href="mailto:ecommerce@premindustries.in">ecommerce@premindustries.in</a>. Our team would be glad to help you!</li>
    </ul>

    <br />

    <p style={{fontWeight:"700"}}>Team Prem Industries India Limited</p>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    name: "Prem Industries India Ltd",
    email: "ecommerce@premindustries.in",
  };

  sendSmtpEmail.to = [{ email: receiverEmail, name: `${data.name}` }];

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

module.exports = sendOrderDeliveredEmailPI;
