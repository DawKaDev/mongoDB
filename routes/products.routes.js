const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/products', async (req, res) => {
  try {
    res.json(await Product.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const prd = await Product.findOne().skip(rand);
    if(!prd) res.status(404).json({message: 'Not found'});
    else res.json(emp);
  }
  catch(err) {
    res.status(500).json({message: err});
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const prd = await Product.findById(req.params.id);
    if(!prd) res.status(404).json({message: 'Not found'});
    else res.json(prd);
  }
  catch(err) {
    res.status(500).json({message: err});
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name: name, client: client});
    await newProduct.save();
    res.json({message: 'OK'});
  } catch(err) {
    res.status().json({message: err});
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  try {
    const prd = await(Product.findById(req.params.id));
    if(prd) {
      await Product.updateOne({_id: req.params.id}, {$set: { name: name, client: client}});
      res.json({message: 'OK'});
    }
    else res.status(404).json({message: 'Not found'});
  }
  catch(err) {
    res.status(500).json({message: err});
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const prd = await(Product.findById(req.params.id));
    if(prd) {
      await Product.deleteOne({_id: req.params.id});
      res.json({message: 'OK'});
    }
    else res.status(404).json({message: 'Not found'});
  }
  catch(err) {
    res.status(500).json({messgae: err});
  }
});

module.exports = router;