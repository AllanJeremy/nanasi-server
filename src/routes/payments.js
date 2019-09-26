const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/checkAuth");
const payment = require("../modules/payments/payments");

// Checkout
router.post("/checkout", CheckAuth.buyerLoggedIn, (req, res, next) => {

    payment.buyerCheckout(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Withdraw funds
router.post("/withdraw", CheckAuth.merchantLoggedIn, (req, res, next) => {
    // Enter amount
    // Billing id

    /* 
        response:
        {
            ok: true
            message: "Successfully withdrew ${amount} through ${paymentMethod}",
            data: {
                amount: ,
                billing:{
                    paymentMethod: ,
                    details: {

                    }
                } 
                date: ${date}
                status: "success|pending|failed"
                message: "Successful | Pending | (Insufficient funds | Technical error)"
            }
        }
    */
});

// Get the current merchant's withdrawals
router.get("/withdrawals", CheckAuth.merchantLoggedIn, (req, res, next) => {
    /* 
      data: {
          count: x,
          totalValue: x,
          withdrawals:[{
              billing: {
                  paymentMethod:
                  details: 
              },
              amount: x,
              date: x,
              status: "success|pending|failed"
    }]
      }
    */
});


module.exports = router;