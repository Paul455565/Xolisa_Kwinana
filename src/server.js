require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Use environment variables for credentials and URLs
const merchant_id = process.env.PAYFAST_MERCHANT_ID || "29854715";
const merchant_key = process.env.PAYFAST_MERCHANT_KEY || "d6rabflnonsww";
const passphrase = process.env.PAYFAST_PASSPHRASE || ""; // Optional

const return_url = process.env.PAYFAST_RETURN_URL || "https://your-frontend-domain.com/payment-success";
const cancel_url = process.env.PAYFAST_CANCEL_URL || "https://your-frontend-domain.com/payment-cancel";
const notify_url = process.env.PAYFAST_NOTIFY_URL || "https://your-backend-domain.com/api/payfast-notify";

// Helper to generate Payfast signature
const generateSignature = (data) => {
  const queryString = Object.entries(data)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");

  const signatureBase = passphrase
    ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}`
    : queryString;

  return crypto.createHash("md5").update(signatureBase).digest("hex");
};

app.post("/api/create-payment", (req, res) => {
  const { amount, item_name, buyer_email } = req.body;

  if (!amount || !item_name || !buyer_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const paymentData = {
    merchant_id,
    merchant_key,
    return_url,
    cancel_url,
    notify_url,
    amount: parseFloat(amount).toFixed(2),
    item_name,
    email_address: buyer_email,
  };

  const signature = generateSignature(paymentData);
  const finalQueryString = Object.entries(paymentData)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");

  const paymentUrl = `https://www.payfast.co.za/eng/process?${finalQueryString}&signature=${signature}`;

  return res.status(200).json({ paymentUrl });
});

// Payfast IPN (Instant Payment Notification) handler with basic validation
app.post("/api/payfast-notify", (req, res) => {
  const receivedData = req.body;

  // TODO: Implement signature verification and IP validation for production

  console.log("Received Payfast IPN:", receivedData);

  // Respond with 200 OK to acknowledge receipt
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
