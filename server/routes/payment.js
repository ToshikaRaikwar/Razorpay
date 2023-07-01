const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = new Razorpay({
    key_id: 'rzp_test_RHkbnq3KbCLC6C',
  });
router.get("/orders", (req, res) => {
  // Handle the GET request for /api/payment/orders here
  res.send("This is the GET /api/payment/orders endpoint");
});

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
        key_id: "rzp_test_RHkbnq3KbCLC6C",
        key_secret: "58QTgcT4SOakUCYTcwxAEmPO",
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body; 
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const signature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(text)
      .digest("hex");

    if (signature === razorpay_signature) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
