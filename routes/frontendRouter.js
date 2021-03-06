const express = require("express");
const paymentModel = require("../models/paymentModel");
const moviesInfo = require("../models/movieModel");
const pdf = require("html-pdf");
const fs = require("fs");
const qrcode = require("qrcode");
const { verify } = require("jsonwebtoken");
const userModel = require("../models/userModel");
const frontendRoute = express.Router();
require("dotenv").config();

frontendRoute.get("/", async (req, res) => {
  res.render("loginPage");
});
frontendRoute.get("/movies", (req, res) => {
  res.render("movies/moviesList");
});
frontendRoute.get("/movies1", (req, res) => {
  res.render("movies/moviesList1");
});
frontendRoute.get("/register", async (req, res) => {
  res.render("registerPage");
});
frontendRoute.get("/home", async (req, res) => {
  res.render("home");
});
frontendRoute.get("/changepassword", (req, res) => {
  res.render("changePassword");
});
frontendRoute.get("/userlist", (req, res) => {
  res.render("userListPage");
});
frontendRoute.get("/newticket", (req, res) => {
  res.render("tickets/newTicket");
});
frontendRoute.get("/ticketlist", (req, res) => {
  res.render("tickets/ticketList");
});
frontendRoute.get("/ticketbookedlist", (req, res) => {
  res.render("tickets/userBookedTicket");
});
frontendRoute.get("/paymentlist", (req, res) => {
  res.render("payments/paymentList");
});
frontendRoute.get("/newpayment", (req, res) => {
  res.render("payments/newPayment");
});
frontendRoute.get("/order/:id", async (req, res) => {
  const data = await paymentModel.findOne({ _id: req.params.id });
  // console.log(data);
  res.render("payments/payment", {
    order: data.paymentId,
    Id: data._id,
    amount: Number(data.amount) * 100,
  });
});
frontendRoute.get("/export", async (req, res) => {
  const data = await moviesInfo.find();
  res.render("pdfconvert", { data: data }, (err1, html) => {
    const path = Date.now() + "_report.pdf";
    pdf.create(html).toFile("./public/export/" + path, function (err, result) {
      if (err) {
        console.log(err);
      }
      var dataFile = fs.readFileSync("./public/export/" + path);
      res.header("Content-Type", "application/pdf");
      res.send(dataFile);
    });
  });
});
frontendRoute.get("/qrcode", async (req, res) => {
  const id = verify(req.query.data, process.env.secretKey);
  const data = await userModel.findById(id.userid);
  const present = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    isAdmin: data.isAdmin,
    dob: String(data.dob).split("T")[0],
  };
  let img = await qrcode.toDataURL(JSON.stringify(present));
  res.render("qrCode", { img });
});
module.exports = frontendRoute;
