import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db } from './FirebaseConfig';

const SubscribeForm = ({ lotId, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "subscriptions"), {
        lotId,
        phoneNumber,
      });
      alert("You have successfully subscribed to notifications!");
      onClose();
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Failed to subscribe.");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "white", border: "1px solid #ccc" }}>
      <h3>Subscribe to Notifications</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Subscribe</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SubscribeForm;
