import emailjs from 'emailjs-com';

// Function to generate a simple confirmation code (could be improved)
const generateConfirmationCode = (id) => {
  return id.slice(0, 8).toUpperCase();
};

// Placeholder for SMS sending - you would need to integrate Twilio or Clickatell SDK or API here
// For example, you might create a backend API endpoint to send SMS and call it from here

export const sendEmailConfirmation = async (transactionData) => {
  try {
    const confirmationCode = generateConfirmationCode(transactionData.id);
    const templateParams = {
      to_email: transactionData.contactEmail,
      event_title: transactionData.ticketTitle,
      ticket_type: transactionData.ticketType,
      quantity: transactionData.quantity,
      confirmation_code: confirmationCode,
      // Add other event details as needed
    };

    // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_USER_ID' with your EmailJS credentials
    const result = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_USER_ID'
    );
    console.log('Email sent successfully:', result.text);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// Placeholder function for sending SMS
export const sendSmsConfirmation = async (phoneNumber, message) => {
  // Implement SMS sending via Twilio or Clickatell API here
  // This might involve calling a backend API endpoint that handles SMS sending
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
};
