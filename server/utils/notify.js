/**
 * Sends the admin a notice whenever someone books a training.
 *
 * EMAIL (recommended, works out of the box once configured):
 *   1. npm install nodemailer   (inside server/)
 *   2. In server/.env set:
 *        NOTIFY_EMAIL_TO=warco.mail@example.com   (WARCO's inbox)
 *        SMTP_HOST=smtp.gmail.com
 *        SMTP_PORT=465
 *        SMTP_USER=your-sending-address@gmail.com
 *        SMTP_PASS=your-app-password
 *   If SMTP_* is not set, the booking is still saved to the database and
 *   shown in Admin → Training → Bookings — it just won't also be emailed.
 *
 * WHATSAPP / SMS (optional, needs a paid Twilio account — a website cannot
 * send WhatsApp/SMS on its own without a provider like this):
 *   1. npm install twilio   (inside server/)
 *   2. In server/.env set:
 *        TWILIO_SID=...
 *        TWILIO_AUTH_TOKEN=...
 *        TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   (Twilio sandbox/number)
 *        NOTIFY_WHATSAPP_TO=whatsapp:+91XXXXXXXXXX    (WARCO admin's number)
 *   If these are not set, WhatsApp/SMS sending is silently skipped.
 */

let nodemailerLib = null;
try {
  nodemailerLib = require("nodemailer");
} catch {
  // not installed yet — email notifications will be skipped until it is
}

let twilioLib = null;
try {
  twilioLib = require("twilio");
} catch {
  // not installed yet — WhatsApp/SMS notifications will be skipped until it is
}

async function sendBookingNotification(booking) {
  const lines = [
    "New WARCO INDIA training booking request",
    `Name: ${booking.name}`,
    `Department: ${booking.department}`,
    booking.designation ? `Designation: ${booking.designation}` : null,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    booking.location ? `Location: ${booking.location}` : null,
    booking.preferredDate ? `Preferred date: ${booking.preferredDate}` : null,
    booking.message ? `Message: ${booking.message}` : null,
    `Received: ${new Date().toLocaleString("en-IN")}`,
  ].filter(Boolean);
  const text = lines.join("\n");

  // -- Email -----------------------------------------------------------
  if (nodemailerLib && process.env.SMTP_HOST && process.env.NOTIFY_EMAIL_TO) {
    try {
      const transporter = nodemailerLib.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) !== 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.NOTIFY_EMAIL_TO,
        subject: `New training booking — ${booking.name} (${booking.department})`,
        text,
      });
    } catch (err) {
      console.error("Booking email notification failed:", err.message);
    }
  } else {
    console.log("[notify] Email not configured — skipped. Booking saved to database.");
  }

  // -- WhatsApp / SMS (Twilio) ------------------------------------------
  if (
    twilioLib &&
    process.env.TWILIO_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM &&
    process.env.NOTIFY_WHATSAPP_TO
  ) {
    try {
      const client = twilioLib(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.NOTIFY_WHATSAPP_TO,
        body: text,
      });
    } catch (err) {
      console.error("Booking WhatsApp notification failed:", err.message);
    }
  } else {
    console.log("[notify] WhatsApp/SMS not configured — skipped. Booking saved to database.");
  }
}

module.exports = { sendBookingNotification };
