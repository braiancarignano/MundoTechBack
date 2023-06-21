const nodemailer = require("nodemailer");
const config = require("../config/config.js");

const getMail = async (req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      service: config.MAIL_SERVICE,
      port: config.MAIL_PORT,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `MUNDOTECH <${config.MAIL_USER}>`, // dirección de envío
      to: `${req.purcharser}`, // lista de destinatarios
      subject: `Su compra en MUNDOTECH`, // asunto
      html: `<div style="font-family: 'Inter', Arial, sans-serif; background: linear-gradient(to top right, #1e40af, #7e22ce); color: #ffffff; text-align: center; padding: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 500px;">
                <h1 style="font-size: 24px;">Gracias por su compra en MUNDOTECH</h1>
                <p style="margin-bottom: 10px;">Usuario: <span style="color: #ffffff;">${req.purcharser}</span></p>
                <p style="margin-bottom: 10px;">Código de compra: <strong>${req.code}</strong></p>
                <p style="margin-bottom: 10px;">Fecha: ${req.purchase_datetime}</p>
                <p style="margin-bottom: 0;">Monto: $ ${req.amount}</p>
              </div>`,
    });
  } catch (error) {
    req.logger.error(
      `${req.method} en ${req.url}- ${new Date().toLocaleTimeString()}`
    );
    throw error;
  }
};

module.exports = { getMail };
