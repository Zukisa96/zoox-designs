const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/quote', async (req, res) => {
  console.log('Quote received:', req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'zoox19966@gmail.com',
      subject: `New Quote: ${req.body.service} - ${req.body.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Phone:</b> ${req.body.phone}</p>
        <p><b>Service:</b> ${req.body.service}</p>
        <p><b>Message:</b> ${req.body.message}</p>
      `
    });
    console.log('✅ Email sent');
    res.json({ ok: true });
  } catch (err) {
    console.log('❌ Email failed:', err.message);
    res.json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server live on ${PORT} - Email ready for ${process.env.EMAIL_USER}`));