import { schedule } from 'node-cron';
import { sendEmail } from '../email/email.js';

/**
 * Schedules a cron job to send an email every minute.
 */
export const job = () => {
  schedule('* * * * *', async () => {
    try {
      await sendEmail(); // Send an email
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
    
    console.log('Running a task every minute');
  });
};
