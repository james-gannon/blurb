const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'No subscription provided' });
  }

  try {
    // Get user from auth cookie
    const supabase = createClient(
      'https://fxozalrulpenxeqfqkcn.supabase.co',
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // You'll need to extract the user ID from the request
    // This depends on how you're handling authentication
    const userId = req.headers.authorization.split(' ')[1]; // Simplified example
    
    // Store the subscription in your database
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscription,
        created_at: new Date()
      });

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
};