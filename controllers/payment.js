const { Event } = require('../models/index');
const midtransClient = require('midtrans-client');
class paymentController {
  static async generateToken(req, res, next) {
    try {
      const { amount } = req.body;
      console.log(amount);
      if (amount != 100000) throw { name: "Only Accept 100k" };

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY
      });
      let parameter = {
        "transaction_details": {
          "order_id": "TRANSACTION" + Math.floor(1000000 + Math.random() * 9000000),
          "gross_amount": amount
        },
        "credit_card": {
          "secure": true
        },
        "customer_details": {
          "name": req.user.name,
          "email": req.user.email,
        }
      };
      const data = await snap.createTransaction(parameter);
      res.status(200).json(data);

    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = paymentController;