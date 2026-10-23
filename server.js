require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve your frontend files (index.html, images, css, etc.)
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err) => {
  if(err) console.log('❌ Email config error:', err.message);
  else console.log('✅ Email ready for', process.env.EMAIL_USER);
});

app.post('/api/quote', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  try{
    await transporter.sendMail({
      from: `"ZooX Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Quote: ${service} - ${name}`,
      html: `<h3>New Quote Request</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Service:</b> ${service}</p><p><b>Message:</b><br>${message}</p>`,
      replyTo: email
    });
    console.log(`✅ Email sent for ${name} - ${service}`);
    res.json({ ok: true });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Serve index.html for homepage and any other page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));