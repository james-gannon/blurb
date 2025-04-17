const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, callSummary, phoneNumber } = req.body;
  if (!userId || !callSummary) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    // Get user's subscription from database
    const supabase = createClient(
      'https://fxozalrulpenxeqfqkcn.supabase.co',
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      throw new Error('No subscription found');
    }

    // Send push notification to the user
    const subscription = data[0].subscription;
    const notificationPayload = {
      title: 'New Call Summary',
      message: `Call from ${phoneNumber}: ${callSummary}`,
      url: '/inbox.html'
    };

    await webpush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload)
    );

    return res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
};