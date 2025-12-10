const brevo = require("@getbrevo/brevo");
let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
const dotenv = require("dotenv");
dotenv.config();
apiKey.apikey = process.env.BREVO_API;
let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent =
  "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = {
  name: "Prem Industries India Ltd",
  email: "vipul@assertit.io",
};

sendSmtpEmail.to = [{ email: "vipulkhare2000@gmail.com", name: "Vipul Khare" }];
sendSmtpEmail.replyTo = {
  email: "vipul@assertit.io",
  name: "Prem Industries India Ltd",
};
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = {
  parameter: "My param value",
  subject: "common subject",
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    //console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  },
  function (error) {
    console.error(error);
  }
);
