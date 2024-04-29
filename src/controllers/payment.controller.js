

exports.createPaymentSession = async (req,res) => {
  try {
    // Make API call to Payrexx to initialize payment session
    const payrexxResponse = await axios.post('https://api.payrexx.com/v1/transactions', {
        amount: req.body.amount, // Amount to be paid
        currency: req.body.currency, // Currency (e.g., 'USD', 'EUR')
        referenceId: req.body.referenceId, // Your reference ID for the transaction
        ...req.body.extraParams // Any additional parameters required by Payrexx API
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYREXX_ACCESS_TOKEN}`
        }
    });

    // Extract relevant data from Payrexx response
    const paymentSessionData = payrexxResponse.data;

    // Send payment session data back to frontend
    res.json(paymentSessionData);
} catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}