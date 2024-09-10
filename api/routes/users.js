const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.email, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }

        if (result) {
          res.status(200).json({
            message: "Auth Successfull",
          });
        }
      });
      res.status(401).json({
        message: "Auth Failed",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "This email is already teken.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result),
                  res.status(201).json({
                    message: "User Created.",
                  });
              })
              .catch((err) => {
                res.status(500).json({
                  message: err,
                });
              });
          }
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
module.exports = router;
