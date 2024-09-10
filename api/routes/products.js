const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  // business logic
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product added successfully",
        prdouct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get individual product

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc, "yes");
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "Invalid Entry!!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Patch request
router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated successfully",
        result: result,
      });

      res.status(404).json({
        message: "Product not found or no changes made",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

//Delete Request
router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product is deleted",
          result: result,
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
