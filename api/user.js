const express = require("express");
const router = express.Router();
const userOperations = require("../operations/users");
const userServices = require("../services/db services/users");
const { verifyRefreshTokens } = require("../middleware/token");
const { confirmation, confirmationSocial, confirmationSocialFacebook } = require("../middleware/token");

router.post("/signUp", (req, res) => {
  userOperations.signUp(req).then(response => {
    res.send(response);
  });
});

router.post("/login", (req, res) => {
  userOperations.signIn(req, res).then(response => {
    res.send(response);
  });
});

router.get("/confirmation/:token", confirmation, (req, res) => {
  userOperations
    .confirmation(req.user.email)
    .then(response => {
      res.redirect("http://localhost:8080/"); //
    })
    .catch(err => {
      res.status(500).send(err);
      console.log(err);
    });
});

router.post("/login/social", confirmationSocial, async (req, res) => {
  var verificationEmail = await userOperations.verificationEmail(req.userInfo.email);
  if (!verificationEmail) {
    var newUser = {
      firstName: req.userInfo.given_name,
      lastName: req.userInfo.family_name,
      email: req.userInfo.email,
      password:
        Math.random()
          .toString(36)
          .substring(2, 16) +
        Math.random()
          .toString(36)
          .substring(2, 15),
      isActive: true
    };
    //we need to add googleId to user schema
    userOperations.addUserInfoSocial(newUser).then(response => {
      // res.redirect('https://localhost:5000/')
    });
  } else {
    res.send({ status: true });
    // res.redirect('https://localhost:5000/productDetails')
  }
});

router.post("/login/socialF", confirmationSocialFacebook, async (req, res) => {
  var verificationEmail = await userOperations.verificationEmail(req.userInfo.email);
  if (!verificationEmail) {
    var newUser = {
      firstName: req.userInfo.first_name,
      lastName: req.userInfo.last_name,
      email: req.userInfo.email,
      password:
        Math.random()
          .toString(36)
          .substring(2, 16) +
        Math.random()
          .toString(36)
          .substring(2, 15),
      isActive: true
    };
    userOperations.addUserInfoSocial(newUser).then(response => {
      res.send({ status: true });
      // res.redirect('https://localhost:5000/')
    });
  } else {
    res.send({ status: true });
    // res.redirect('http://localhost:5000/')
  }
});

//need to add the middleware to get the id
router.get("/wishlist", verifyRefreshTokens, async (req, res) => {
  try {
    console.log(req.user);
    const id = "5e3aa7b4ec4d353da80dbd7c";
    const wishlist = await userServices.getWishlist(id);
    res.status(200).json(wishlist.wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

//need to add the middleware to get the id
router.put("/wishlist", async (req, res) => {
  try {
    const id = "5e3aa7b4ec4d353da80dbd7c";
    const wishlist = await userServices.addToWishlist(id, req.body.product);
    res.status(200).json(wishlist.wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

//need to add the middleware to get the id
router.delete("/wishlist", async (req, res) => {
  try {
    const id = "5e3aa7b4ec4d353da80dbd7c";
    const wishlist = await userServices.removeFromWishlist(id, req.body.product);
    res.status(200).json(wishlist.wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
