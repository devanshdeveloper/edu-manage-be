const twilio = require('twilio');

class SMSHelper {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendSMS({ to, message }) {
    try {
      if (!to || !message) {
        throw new Error('Phone number and message are required');
      }

      // Format phone number to E.164 format if not already formatted
      const formattedPhone = this.formatPhoneNumber(to);

      const response = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming default is +1 for US)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // If number already has country code (starts with +)
    if (phone.startsWith('+')) {
      return phone;
    }
    
    throw new Error('Invalid phone number format');
  }
}

module.exports = SMSHelper;