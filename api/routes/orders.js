const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const order = require("../models/order");

router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        orders: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "Product not found.",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      console.log(result),
        res.status(200).json({
          message: "Order was created",
          order: result,
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderID", (req, res, next) => {
  Order.findById(req.params.orderID)
    .exec()
    .then((_order) => {
      res.status(200).json({
        message: "Order exist!!",
        order: _order,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//Delete Request
router.delete("/:orderID", (req, res, next) => {
  Order.findByIdAndDelete(req.params.orderID)
    .exec()
    .then((orders) => {
      res.status(200).json({
        message: "Order is deleted.",
        order: order,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: "Order is deleted",
  });
});

module.exports = router;
