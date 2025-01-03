require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const { initializeApp } = require('firebase/app');
const { getFirestore, query, collection, where, getDocs } = require('firebase/firestore');



// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoint to send an SMS
app.post('/send-notification', async (req, res) => {
  const { lotId, message } = req.body;

  try {
    // Query Firebase to get all subscribed phone numbers for the given lotId
    const q = query(collection(db, 'subscriptions'), where('lotId', '==', lotId));
    const querySnapshot = await getDocs(q);

    const recipients = querySnapshot.docs.map((doc) => doc.data().phoneNumber);

    // Send SMS to all recipients
    const sendMessages = recipients.map((phoneNumber) =>
      client.messages.create({
        body: message,
        from: twilioNumber,
        to: phoneNumber,
      })
    );

    await Promise.all(sendMessages);

    res.status(200).send({ success: true, message: 'Notifications sent successfully!' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
