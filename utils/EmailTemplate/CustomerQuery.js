const brevo = require('@getbrevo/brevo');
const dotenv = require("dotenv");
dotenv.config();
const apiKey = process.env.BREVO_API;
function sendCustomerQueryMainWebsiteEmail(receiverEmail, subject , data) {
  


  const apiClient = brevo.ApiClient.instance;
  const apiKeyAuth = apiClient.authentications['api-key'];
  apiKeyAuth.apiKey = apiKey;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
  <html><body><h1>Common: This is my transactional email with subject: ${subject}</h1>
  <h2>${data.name}</h2>
  <div class="container">
  <tbody>
    <tr>
      <td
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 24px;
          padding-right: 24px;
          padding-bottom: 24px;
          padding-left: 24px;
          background: black;
          background-color: ;
          color: #ffffff;
        "
      >
        <table
          cellspacing="0"
          cellpadding="0"
          style="
            width: 100%;
            margin-top: 0;
            margin-right: 0;
            margin-bottom: 0;
            margin-left: 0;
            padding-top: 0;
            padding-right: 0;
            padding-bottom: 0;
            padding-left: 0;
            border-collapse: collapse;
            border-spacing: 0;
          "
        >
          <tbody>
            <tr>
              <td
                style="
                  width: 70%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 24px;
                  padding-right: 24px;
                  padding-bottom: 24px;
                  padding-left: 24px;
                  background: black;
                  background-color: #eff4f7;
                  color: #ffffff;
                "
              >
                <a
                  href="https://prempackaging.com/"
                  title="PREM PACKAGING"
                  target="_blank"
                >
                  <img
                    style="vertical-align: middle"
                    src="https://prempackaging.com/img/logo.png"
                    width="150"
                    height="100"
                    alt="AJIO"
                    class="CToWUd"
                    data-bit="iit"
                  />
                </a>
              </td>
              <td
                style="
                  width: 80%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  background: black;
                  background-color: #eff4f7;
                  color: #ffffff;
                "
              >
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    width: 100%;
                    margin-top: 0;
                    margin-right: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 0;
                    padding-left: 0;
                    border-collapse: collapse;
                    border-spacing: 0;
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          /* text-align: right; */
                          font-size: 18px;
                          line-height: 1.28;
                          font-weight: 600;
                          background: black;
                          background-color: #eff4f7;
                          color: #000000;
                        "
                      >
                        Order Placed
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          /* text-align: right; */
                          font-size: 12px;
                          line-height: 1.25;
                          color: #000000;
                          font-weight: 300;
                        "
                      >
                        Order ID
                        <a
                          style="font-weight: 600; color: #00000"
                          href="#"
                          target="_blank"
                          >FN1346400461</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 42px;
          padding-right: 24px;
          padding-bottom: 0;
          padding-left: 24px;
          background: white;
        "
      >
        <table
          cellspacing="0"
          cellpadding="0"
          style="
            width: 100%;
            margin-top: 0;
            margin-right: 0;
            margin-bottom: 0;
            margin-left: 0;
            padding-top: 0;
            padding-right: 0;
            padding-bottom: 0;
            padding-left: 0;
            border-collapse: collapse;
            border-spacing: 0;
          "
        >
          <tbody>
            <tr>
              <td
                style="
                  width: 100%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  font-size: 14px;
                  font-weight: normal;
                  line-height: 1.29;
                  color: #202020;
                  text-align: left;
                "
              >
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    width: 100%;
                    margin-top: 0;
                    margin-right: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 0;
                    padding-left: 0;
                    border-collapse: collapse;
                    border-spacing: 0;
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          text-align: left;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          font-size: 14px;
                          font-weight: normal;
                          line-height: 1.29;
                          text-align: left;
                          color: #202020;
                        "
                      >
                        <p
                          style="
                            width: 100%;
                            margin-top: 15px;
                            margin-right: 0;
                            margin-bottom: 15px;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            font-size: 14px;
                            font-weight: normal;
                            line-height: 1.29;
                            text-align: left;
                            color: #202020;
                          "
                        >
                          Hi <strong>${data.name}</strong>,
                        </p>
                        <p
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 15px;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            font-size: 14px;
                            font-weight: normal;
                            line-height: 1.29;
                            text-align: left;
                            color: #202020;
                          "
                        >
                          Your order has been successfully Placed With Us.
                        </p>
                        <p
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            font-size: 14px;
                            font-weight: normal;
                            line-height: 1.29;
                            text-align: left;
                            color: #202020;
                          "
                        >
                          Meanwhile, stay bold, stay stylish!
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td
                style="
                  width: 100%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                "
              >
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    width: 100%;
                    margin-top: 42px;
                    margin-right: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 0;
                    padding-left: 0;
                    border-collapse: collapse;
                    border-spacing: 0;
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 20px;
                          padding-right: 20px;
                          padding-bottom: 20px;
                          padding-left: 20px;
                          background: #eff4f7;
                          border-radius: 12px;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            border-collapse: collapse;
                            border-spacing: 0;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  width: 100%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 12px;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  font-size: 20px;
                                  font-weight: 600;
                                  line-height: 1.25;
                                  color: #202020;
                                  text-align: left;
                                "
                              >
                                Your Order Details
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 100%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                "
                              >
                                <table
                                  cellspacing="0"
                                  cellpadding="0"
                                  style="
                                    width: 100%;
                                    margin-top: 12px;
                                    margin-right: 0;
                                    margin-bottom: 0;
                                    margin-left: 0;
                                    padding-top: 0;
                                    padding-right: 0;
                                    padding-bottom: 0;
                                    padding-left: 0;
                                    border-collapse: collapse;
                                    border-spacing: 0;
                                  "
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          width: 70%;
                                          margin-top: 0;
                                          margin-right: 0;
                                          margin-bottom: 0;
                                          margin-left: 0;
                                          padding-top: 0;
                                          padding-right: 0;
                                          padding-bottom: 0;
                                          padding-left: 0;
                                          text-align: left;
                                        "
                                      >
                                        <table
                                          cellspacing="0"
                                          cellpadding="0"
                                          style="
                                            width: 100%;
                                            margin-top: 0;
                                            margin-right: 0;
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            padding-top: 0;
                                            padding-right: 0;
                                            padding-bottom: 0;
                                            padding-left: 0;
                                            border-collapse: collapse;
                                            border-spacing: 0;
                                          "
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  width: 100%;
                                                  margin-top: 0;
                                                  margin-right: 0;
                                                  margin-bottom: 0;
                                                  margin-left: 0;
                                                  padding-top: 0;
                                                  padding-right: 0;
                                                  padding-bottom: 0;
                                                  padding-left: 0;
                                                  font-size: 12px;
                                                  line-height: 1.5;
                                                "
                                              >
                                                <span style="color: #6d6d6d"
                                                  >Order ID </span
                                                ><a
                                                  style="
                                                    color: #268cb9;
                                                    font-weight: 700;
                                                    text-decoration: none;
                                                  "
                                                  href="#"
                                                  target="_blank"
                                                  >FN1346400461</a
                                                >
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style="
                                                  width: 100%;
                                                  margin-top: 0;
                                                  margin-right: 0;
                                                  margin-bottom: 0;
                                                  margin-left: 0;
                                                  padding-top: 0;
                                                  padding-right: 0;
                                                  padding-bottom: 0;
                                                  padding-left: 0;
                                                  font-size: 12px;
                                                  line-height: 1.5;
                                                "
                                              >
                                                <span style="color: #6d6d6d"
                                                  >Order placed on </span
                                                ><span
                                                  style="
                                                    color: #202020;
                                                    font-weight: 700;
                                                  "
                                                  >Fri, 27 Oct, 2023</span
                                                >
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style="
                                                  width: 100%;
                                                  margin-top: 0;
                                                  margin-right: 0;
                                                  margin-bottom: 0;
                                                  margin-left: 0;
                                                  padding-top: 0;
                                                  padding-right: 0;
                                                  padding-bottom: 0;
                                                  padding-left: 0;
                                                  font-size: 12px;
                                                  line-height: 1.5;
                                                "
                                              >
                                                <span style="color: #6d6d6d"
                                                  >Order placed to </span
                                                ><span
                                                  style="
                                                    color: #202020;
                                                    font-weight: 700;
                                                  "
                                                  >Haris , GHAZIABAD -
                                                  201002</span
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style="
                                          width: 30%;
                                          text-align: center;
                                          margin: 0;
                                          border-radius: 7px;
                                          padding-left: 36px;
                                        "
                                      >
                                        <table>
                                          <tbody>
                                            <tr>
                                              <td
                                                style="
                                                  width: 100%;
                                                  background: #14254c;
                                                  padding: 12px;
                                                  margin: 0;
                                                  border-radius: 7px;
                                                "
                                              >
                                                <a
                                                  style="
                                                    margin: 0;
                                                    background: #14254c;
                                                    color: #ffffff;
                                                    text-align: center;
                                                    font-size: 14px;
                                                    font-weight: 600;
                                                    line-height: 2.14;
                                                    border-radius: 7px;
                                                    text-decoration: none;
                                                  "
                                                  href="#"
                                                  title="View Order"
                                                  target="_blank"
                                                  >View Order</a
                                                >
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
        "
      >
        <table
          cellspacing="0"
          cellpadding="0"
          style="
            width: 100%;
            margin-top: 12px;
            margin-right: 0;
            margin-bottom: 0;
            margin-left: 0;
            padding-top: 0;
            padding-right: 0;
            padding-bottom: 0;
            padding-left: 0;
            border-collapse: collapse;
            border-spacing: 0;
          "
        >
          <tbody>
            <tr>
              <td
                style="
                  width: 100%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 20px;
                  padding-right: 20px;
                  padding-bottom: 20px;
                  padding-left: 20px;
                  background: #eff4f7;
                  border-radius: 12px;
                "
              >
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    width: 100%;
                    margin-top: 0;
                    margin-right: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 0;
                    padding-left: 0;
                    border-collapse: collapse;
                    border-spacing: 0;
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 12px;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          font-size: 18px;
                          font-weight: 700;
                          line-height: 1.28;
                          color: #202020;
                          text-align: left;
                        "
                      >
                        Item(s) Placed
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 24px;
                          padding-right: 0;
                          padding-bottom: 16px;
                          padding-left: 0;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            border-collapse: collapse;
                            border-spacing: 0;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  width: 10%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  vertical-align: top;
                                "
                              >
                                <a
                                  style="
                                    margin-top: 0;
                                    margin-right: 0;
                                    margin-bottom: 0;
                                    margin-left: 0;
                                    padding-top: 0;
                                    padding-right: 0;
                                    padding-bottom: 0;
                                    padding-left: 0;
                                    display: block;
                                    text-decoration: none;
                                    width: 60px;
                                  "
                                  href="https://www.ajio.com/p/469418741001"
                                  title="Reptilian Pattern Duffle Bag"
                                  target="_blank"
                                >
                                  <img
                                    src="https://ci3.googleusercontent.com/proxy/c0Qcz0upffyPp5jpIwlIzGrmK4hJC9Qn9zs227-xJpkW72NLf3ie3hvLSiL7PFdHSdhe5_R5SzQHTj2Q0bDaGDqx3jrH0ODQZEZTOpiM7wohNhK20LkwGuSomF2miaUwwyulMgGxaeJzR2HLMtQ_qxP-tWdqze2EEmDSVo2_r65x7eiAAlk6jtAo7w=s0-d-e1-ft#https://assets.ajio.com/medias/sys_master/root/20221219/TwvV/63a07df6aeb269659cf2971d/-60Wx75H-469418741-black-MODEL.jpg"
                                    alt="Smiley face"
                                    width="60"
                                    height="74"
                                    class="CToWUd"
                                    data-bit="iit"
                                  />
                                </a>
                              </td>
                              <td
                                style="
                                  width: 70%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 12px;
                                  vertical-align: top;
                                  font-size: 12px;
                                  color: #202020;
                                  text-align: left;
                                "
                              >
                                <p
                                  style="
                                    margin-top: 0;
                                    margin-right: 0;
                                    margin-bottom: 0;
                                    margin-left: 0;
                                    padding-top: 0;
                                    padding-right: 0;
                                    padding-bottom: 8px;
                                    padding-left: 0;
                                    font-weight: 700;
                                  "
                                >
                                  <a
                                    href="https://www.ajio.com/p/469418741001"
                                    title="Reptilian Pattern Duffle Bag"
                                    style="
                                      margin-top: 0;
                                      margin-right: 0;
                                      margin-bottom: 0;
                                      margin-left: 0;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 0;
                                      font-weight: 700;
                                      color: #202020;
                                      text-decoration: none;
                                    "
                                    target="_blank"
                                    data-saferedirecturl="https://www.google.com/url?q=https://www.ajio.com/p/469418741001&amp;source=gmail&amp;ust=1699069761194000&amp;usg=AOvVaw1MogYQ1OW-ycRZm_LXFWxm"
                                    >Reptilian Pattern Duffle Bag</a
                                  >
                                </p>
                                <p
                                  style="
                                    margin-top: 0;
                                    margin-right: 0;
                                    margin-bottom: 0;
                                    margin-left: 0;
                                    padding-top: 0;
                                    padding-right: 0;
                                    padding-bottom: 8px;
                                    padding-left: 0;
                                  "
                                >
                                  <span style="color: #6d6d6d">Size</span>
                                  <span
                                    style="
                                      font-weight: 700;
                                      margin-right: 16px;
                                    "
                                    >OS</span
                                  ><span style="color: #6d6d6d">Qty</span>
                                  <span style="font-weight: 700">1</span
                                  ><span
                                    style="
                                      color: #6d6d6d;
                                      margin-left: 16px;
                                    "
                                    >Colour</span
                                  >
                                  <span style="font-weight: 700"
                                    >Black</span
                                  >
                                </p>
                                <p
                                  style="
                                    margin-top: 0;
                                    margin-right: 0;
                                    margin-bottom: 0;
                                    margin-left: 0;
                                    padding-top: 0;
                                    padding-right: 0;
                                    padding-bottom: 0;
                                    padding-left: 0;
                                  "
                                >
                                  <span style="color: #6d6d6d">Price</span>
                                  <span style="font-weight: 700"
                                    >₹5006.47</span
                                  >
                                </p>
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  vertical-align: top;
                                  font-size: 14px;
                                  color: #202020;
                                  font-weight: 700;
                                  line-height: 1.57;
                                  text-align: right;
                                "
                              >
                                ₹4999.00
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 100%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 15px;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          color: #202020;
                          border-top: 1px solid #c8c8c8;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            border-collapse: collapse;
                            border-spacing: 0;
                          "
                        >
                          <tbody>
                            <tr>
                              <!-- <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                Sub Total
                              </td> 
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                ₹4999.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                Convenience fees
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                ₹49.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                Gift Wrap
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                "
                              >
                                ₹0.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 20px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                Coupon Discount
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 20px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                - 4998.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 20px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                Bank Discount
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 20px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                - 0.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                Credits
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 12px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                - 0.00
                              </td>
                            </tr> -->
                            <tr>
                              <td
                                style="
                                  width: 80%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 15px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 16px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                Total Amount
                              </td>
                              <td
                                style="
                                  width: 20%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 15px;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 16px;
                                  line-height: 1.67;
                                  font-weight: 700;
                                "
                              >
                                ₹4999.00
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
        "
      >
        <table
          cellspacing="0"
          cellpadding="0"
          style="
            width: 100%;
            margin-top: 12px;
            margin-right: 0;
            margin-bottom: 32px;
            margin-left: 0;
            padding-top: 0;
            padding-right: 0;
            padding-bottom: 0;
            padding-left: 0;
            border-collapse: collapse;
            border-spacing: 0;
          "
        >
          <tbody>
            <tr>
              <td
                style="
                  width: 100%;
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 20px;
                  padding-right: 24px;
                  padding-bottom: 24px;
                  padding-left: 24px;
                  background: #eff4f7;
                  border-radius: 5px;
                "
              >
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="
                    width: 100%;
                    margin-top: 0;
                    margin-right: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    padding-top: 0;
                    padding-right: 0;
                    padding-bottom: 0;
                    padding-left: 0;
                    border-collapse: collapse;
                    border-spacing: 0;
                  "
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          width: 50%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          text-align: left;
                          vertical-align: top;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            border-collapse: collapse;
                            border-spacing: 0;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  width: 50%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 12px;
                                  padding-left: 0;
                                  text-align: left;
                                  font-size: 20px;
                                  font-weight: 700;
                                  color: #202020;
                                  line-height: 1.25;
                                "
                              >
                                Delivery Address
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 50%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 8px;
                                  padding-left: 0;
                                  text-align: left;
                                  font-size: 16px;
                                  font-weight: 700;
                                  color: #202020;
                                  line-height: 1.25;
                                "
                              >
                                Haris
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 50%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 0;
                                  padding-left: 0;
                                  text-align: left;
                                  font-size: 14px;
                                  color: #202020;
                                  line-height: 1.29;
                                "
                              >
                                Raj nagar,R-13/105,<br />near city super<br />GHAZIABAD,
                                UTTARPRADESH, India-201002<br />Mobile:
                                <strong>9410803617</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td
                        style="
                          width: 50%;
                          margin-top: 0;
                          margin-right: 0;
                          margin-bottom: 0;
                          margin-left: 0;
                          padding-top: 0;
                          padding-right: 0;
                          padding-bottom: 0;
                          padding-left: 0;
                          text-align: right;
                          vertical-align: top;
                        "
                      >
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            width: 100%;
                            margin-top: 0;
                            margin-right: 0;
                            margin-bottom: 0;
                            margin-left: 0;
                            padding-top: 0;
                            padding-right: 0;
                            padding-bottom: 0;
                            padding-left: 0;
                            border-collapse: collapse;
                            border-spacing: 0;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  width: 50%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 12px;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 20px;
                                  font-weight: 700;
                                  color: #202020;
                                  line-height: 1.25;
                                "
                              >
                                Mode of Payment
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  width: 50%;
                                  margin-top: 0;
                                  margin-right: 0;
                                  margin-bottom: 0;
                                  margin-left: 0;
                                  padding-top: 0;
                                  padding-right: 0;
                                  padding-bottom: 8px;
                                  padding-left: 0;
                                  text-align: right;
                                  font-size: 16px;
                                  font-weight: 600;
                                  color: #202020;
                                  line-height: 1.25;
                                "
                              >
                                Prepaid
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>

  <!-- <img
    src="https://ci5.googleusercontent.com/proxy/F4eqijuolg2Rvncq-oXnVea-AqIMzlabbt-LD00WdvNctO8fP74B4f1wSVr6ZLoLK_wOmIEfHqf-d0vMWSn2Lx85D5kzgUvB=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-app-banner.png"
    width="600"
    height="90"
    border="0"
    class="CToWUd"
    data-bit="iit"
  /> -->

  <tr>
    <td
      style="
        width: 100%;
        text-align: left;
        font-size: 10px;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        padding-top: 16px;
        padding-right: 24px;
        padding-bottom: 24px;
        padding-left: 24px;
      "
    >
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 12px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 600;
          color: #202020;
        "
      >
        Please note:
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 9px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        The invoice for this shipment is attached for your reference
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 9px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        If there are any other shipments that are part of this order, you
        will receive a separate email just like this one.
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 9px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        We do not demand your banking and credit card details verbally or
        telephonically. Please do not divulge your details to fraudsters and
        imposters falsely claiming to be calling on Pream Pacakaging behalf.
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 9px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        Have questions or queries? Visit us at
        <a
          style="color: #268cb9; text-decoration: none; font-weight: 600"
          href="https://prempackaging.com/"
          target="_blank">https://prempackaging.com</a
        >.
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 9px;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        Have feedback on your shopping experience? Ring us on
        <a
          style="color: #268cb9; text-decoration: none; font-weight: 600"
          href="tel:+91 84472 47227"
          title="Dail customer care number +91 84472 47227 "
          target="_blank"
          >+91 84472 47227</a
        >
        or e-mail us at
        <a
          style="color: #268cb9; text-decoration: none; font-weight: 600"
          href="mailto:ecommerce@premindustries.in"
          title="Email to customercare@ajio.com"
          target="_blank"
          >ecommerce@premindustries.in</a
        >. Our Customer Care Executives would be glad to help you!
      </p>
      <p
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          font-size: 10px;
          line-height: 1.3;
          color: #202020;
        "
      >
        Team PREM PACKAGING
      </p>
    </td>
  </tr>

  <tr>
    <td
      style="
        width: 100%;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        padding-top: 30px;
        padding-right: 0;
        padding-bottom: 30px;
        padding-left: 0;
        background: #202020;
        text-align: center;
      "
    >
      <table
        cellspacing="0"
        cellpadding="0"
        style="
          width: 100%;
          margin-top: 10px ;
          margin-right: auto;
          margin-bottom: 0;
          margin-left: auto;
          padding-top: 50px;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          border-collapse: collapse;
          border-spacing: 0;
          background-color: #202020;
        "
      >
        <tbody>
          <tr>
            <td
              style="
                width: 92px;
                margin-top: 0;
                margin-right: 0;
                margin-bottom: 0;
                margin-left: 0;
                padding-top: 20px;
                padding-right: 100px;
                padding-bottom: 20px;
                padding-left: 30px;
              "
            >
              <table
                cellspacing="0"
                cellpadding="0"
                style="
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  border-collapse: collapse;
                  border-spacing: 0;
                "
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        width: 34px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 0;
                        padding-bottom: 0;
                        padding-left: 0;
                      "
                    >
                      <img
                        style="vertical-align: middle"
                        src="https://ci5.googleusercontent.com/proxy/td0tMJhVsLA3dw4cp1r7nnftv745Tejyruo_zXkFUVc8LD4JZUkE6yVzVXj6IPLV6Murv4wdijUsiYfQ2Jk9HqLDTJA5jlIbxa8w7co=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-assured-quality.png"
                        width="34"
                        height="36"
                        border="0"
                        alt="Assured Quality"
                        class="CToWUd"
                        data-bit="iit"
                      />
                    </td>
                    <td
                      style="
                        width: 42px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 0;
                        padding-bottom: 0;
                        padding-left: 16px;
                        font-size: 10px;
                        color: #ffffff;
                        text-align: left;
                        vertical-align: middle;
                        font-weight: 600;
                      "
                    >
                      Assured<br />Quality
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td
              style="
                width: 110px;
                margin-top: 0;
                margin-right: 0;
                margin-bottom: 0;
                margin-left: 0;
                padding-top: 0;
                padding-right: 100px;
                padding-bottom: 0;
                padding-left: 0;
              "
            >
              <table
                cellspacing="0"
                cellpadding="0"
                style="
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  border-collapse: collapse;
                  border-spacing: 0;
                "
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        width: 34px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 0;
                        padding-bottom: 0;
                        padding-left: 0;
                      "
                    >
                      <img
                        style="vertical-align: middle"
                        src="https://ci3.googleusercontent.com/proxy/qCt8AK58VYjUZFZxIpMbnIcAnlmGh_53QtqqjHMxXIUGE5FF3d_V7Eh8l-U2Xss5somFF8hwEDVuw7F07JWs5uCpDIyq4rmS=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-handpicked.png"
                        width="34"
                        height="36"
                        border="0"
                        alt="100% Handpicked"
                        class="CToWUd"
                        data-bit="iit"
                      />
                    </td>
                    <td
                      style="
                        width: 60px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 0;
                        padding-bottom: 0;
                        padding-left: 16px;
                        font-size: 10px;
                        color: #ffffff;
                        text-align: left;
                        vertical-align: middle;
                        font-weight: 600;
                      "
                    >
                      100%<br />Handpicked
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td
              style="
                width: 85px;
                margin-top: 0;
                margin-right: 0;
                margin-bottom: 0;
                margin-left: 0;
                padding-top: 0;
                padding-right: 0;
                padding-bottom: 0;
                padding-left: 0;
              "
            >
              <table
                cellspacing="0"
                cellpadding="0"
                style="
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  border-collapse: collapse;
                  border-spacing: 0;
                "
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        width: 32px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 0;
                        padding-bottom: 0;
                        padding-left: 0;
                      "
                    >
                      <img
                        style="vertical-align: middle"
                        src="https://ci5.googleusercontent.com/proxy/RfAFR7-k60CXkPzg_qAavPec9FR4DEALe0lCV830HWrFzcTJi7xOWz5zZSPRCqsdRWMkUfziu_uDA1h5_pLeBMat0ssFCc53nsQ=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-easy-returns.png"
                        width="32"
                        height="32"
                        border="0"
                        alt="Easy returns"
                        class="CToWUd"
                        data-bit="iit"
                      />
                    </td>
                    <td
                      style="
                        width: 37px;
                        margin-top: 0;
                        margin-right: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        padding-top: 0;
                        padding-right: 30px;
                        padding-bottom: 0;
                        padding-left: 16px;
                        font-size: 10px;
                        color: #ffffff;
                        text-align: left;
                        vertical-align: middle;
                        font-weight: 600;
                      "
                    >
                      Easy<br />Returns
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>

  <tr>
    <td
      style="
        width: 100%;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        padding-top: 13px;
        padding-right: 24px;
        padding-bottom: 13px;
        padding-left: 24px;
        background: #f0f4f7;
      "
    >
      <table
        cellspacing="0"
        cellpadding="0"
        style="
          width: 100%;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
          padding-top: 0;
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          border-collapse: collapse;
          border-spacing: 0;
          background-color: #F0F4F7;
        "
      >
        <tbody>
          <tr>
            <td
              style="
                width: 50%;
                margin-top: 0;
                margin-right: 0;
                margin-bottom: 0;
                margin-left: 0;
                padding-top: 13px;
                padding-right: 24px;
                padding-bottom: 13px;
                padding-left: 24px;
                /* text-align: left; */
               
              "
            >
              <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                "
                href="https://www.facebook.com/PackagingAndInnovation/" class="fa fa-facebook"
                title="share with facebook"
                target="_blank">
                
                <!-- <img
                  src="https://ci6.googleusercontent.com/proxy/lE6GDGAMf8olatn2AoAEzyTJfNpUnVDPHSQWrnKq6RN3gDQZKG8e3LRpmVP4rFPW8yGgEVgjTU6XcoAw3ach0QBhECwMAw=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-facebook.png"
                  alt="share with facebook"
                  border="0"
                  class="CToWUd"
                  data-bit="iit"/> -->
            
            </a>
              <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                "
                href="#" class="fa fa-linkedin"
                title="share with twitter"
                target="_blank">
                <!-- <img
                  src="https://ci3.googleusercontent.com/proxy/uiX4Hp8fQqb2Glp4S47Ucrvted0DIjIK6jeQOhQRynWU3zqOlEk7d75wqtjIgKxc5oE891Myu9Glyg3s1IvyWqQnx5b5=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-twitter.png"
                  alt="share with twitter"
                  border="0"
                  class="CToWUd"
                  data-bit="iit"
              /> -->
            </a>
              <!-- <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                "
                href="#"
                title="share with pinterest"
                target="_blank"><img
                  src="https://ci5.googleusercontent.com/proxy/L3dww-YEnAw025fbzaazEg2piX3AV0pornjEvdIi9u5sOe0e4U_-K4izpofdh9IThx5109jJWV5ifYajwH_Y14klaxwYAK8=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-pinterest.png"
                  alt="share with pinterest"
                  border="0"
                  class="CToWUd"
                  data-bit="iit"
              /></a> -->
              <!-- <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                "
                href="#"
                title="share with google plus"
                target="_blank"><img
                  src="https://ci4.googleusercontent.com/proxy/AJJApWOAr_XpR7RnBs-Iwc0EvXxctdawncFN_kq1P3Td9_NBzz-hnTEL4POj76NT5agpsLByFSgxqxsXuSXbIUdF5AyrVK6GGA=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-google-plus.png"
                  alt="share with google plus"
                  border="0"
                  class="CToWUd"
                  data-bit="iit"
              /></a> -->
              <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                "
                href="https://www.instagram.com/prem_packaging/"
                title="share with instagram" class="fa fa-instagram"
                target="_blank">
                <!-- <img
                  src="https://ci4.googleusercontent.com/proxy/sRxpVKVahSVuKCTmZqWJ5Y5pIJsPgkl6xfvv1co-WOxuVz8oJ-QgK4if3lCNltOkD63KRN3iPKeRWu8RPSHcuhBMIUlXbeg=s0-d-e1-ft#https://assets.ajio.com/static/img/eml-instagram.png"
                  alt="share with instagram"
                  border="0"
                  class="CToWUd"
                  data-bit="iit"
              /> -->
            </a>
            </td>
            <td
              style="
                width: 50%;
                margin-top: 0;
                margin-right: 0;
                margin-bottom: 0;
                margin-left: 0;
                padding-top: 0;
                padding-right: 0;
                padding-bottom: 0;
                padding-left: 0;
                text-align: right;
              "
            >
              <a
                style="
                  margin-top: 0;
                  margin-right: 34px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                  color: #202020;
                  font-size: 10px;
                  font-weight: 600;
                "
                href="https://prempackaging.com/contact-us.php"
                title="Contact Us"
                target="_blank">Contact us</a
              >
              <a
                style="
                  margin-top: 0;
                  margin-right: 24px;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                  color: #202020;
                  font-size: 10px;
                  font-weight: 600;
                "
                href="https://prempackaging.com/"
                title="FAQ"
                target="_blank">FAQ</a
              >
              <a
                style="
                  margin-top: 0;
                  margin-right: 0;
                  margin-bottom: 0;
                  margin-left: 0;
                  padding-top: 0;
                  padding-right: 34px;
                  padding-bottom: 0;
                  padding-left: 0;
                  text-decoration: none;
                  color: #202020;
                  font-size: 10px;
                  font-weight: 600;
                "
                title="View in Browser"
                >View in Browser</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</div>
  </body></html>`;

  sendSmtpEmail.sender = { "name": "Your Sender Name", "email": "your_sender_email@example.com" };

  sendSmtpEmail.to = [
    { "email": receiverEmail, "name": "Recipient Name" }
  ];

  
  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      //console.log('Transactional email sent successfully. Returned data: ' + JSON.stringify(data));
    })
    .catch(function (error) {
      console.error('Error sending transactional email:', error);
    });
}

module.exports = sendCustomerQueryMainWebsiteEmail;
