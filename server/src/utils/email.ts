import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendClientBookingConfirmation = async (email: string, clientName: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping client email.');
    return;
  }

  const mailOptions = {
    from: `"POG EVENTS and TRADING LTD" <${process.env.SMTP_USER}>`,
    to: email,
    replyTo: process.env.SMTP_USER,
    subject: 'Booking Request Received - POG Events',
    text: `Thank you for your booking request, ${clientName}!\n\nWe have successfully received your event booking request.\nOur team is currently reviewing your details, and we will get back to you within 24 hours to confirm your booking and discuss the next steps.\n\nBest regards,\nPowers of Grace Events & Trading Ltd.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>Thank you for your booking request, ${clientName}!</h2>
        <p>We have successfully received your event booking request.</p>
        <p>Our team is currently reviewing your details, and we will get back to you within 24 hours to confirm your booking and discuss the next steps.</p>
        <br />
        <p>Best regards,<br /><strong>Powers of Grace Events & Trading Ltd.</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send client email:', error);
  }
};

export const sendAdminBookingNotification = async (bookingDetails: any) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping admin email.');
    return;
  }

  const adminEmail = 'banksymir@gmail.com';
  const assistantEmail = 'am.yusif530@gmail.com';
  
  const dashboardUrl = 'https://admin.pogeventsandtradingltd.org';

  const mailOptions = {
    from: `"POG EVENTS and TRADING LTD" <${process.env.SMTP_USER}>`,
    to: [adminEmail, assistantEmail].join(','),
    replyTo: bookingDetails.email || process.env.SMTP_USER,
    subject: `New Booking Request: ${bookingDetails.event}`,
    text: `New Booking Request Received\n\nClient: ${bookingDetails.client}\nEvent: ${bookingDetails.event}\nDate: ${new Date(bookingDetails.date).toLocaleDateString()}\nLocation: ${bookingDetails.location}\nPackage: ${bookingDetails.budget}\nPhone: ${bookingDetails.phone || 'N/A'}\nEmail: ${bookingDetails.email || 'N/A'}\n\nView in Admin Dashboard: ${dashboardUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #d97706;">New Booking Request Received</h2>
        <p>A new booking request has been submitted on the website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Client:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.client}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Event:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.event}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(bookingDetails.date).toLocaleDateString()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.location}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Package:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.budget}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingDetails.email || 'N/A'}</td></tr>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${dashboardUrl}" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            View in Admin Dashboard
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
  }
};
