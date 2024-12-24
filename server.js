
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect('mongodb://localhost/santa-app', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const letterSchema = new mongoose.Schema({
  childName: String,
  childEmail: String,
  letterText: String,
  toyRequested: String,
  deliveryStatus: String
});

const toySchema = new mongoose.Schema({
  toyName: String,
  toyDescription: String,
  quantityAvailable: Number
});

const deliverySchema = new mongoose.Schema({
  letterId: mongoose.Types.ObjectId,
  toyId: mongoose.Types.ObjectId,
  deliveryDate: Date,
  deliveryStatus: String,
  senderName: String,
  receiverName: String
});

const User = mongoose.model('User', userSchema);
const Letter = mongoose.model('Letter', letterSchema);
const Toy = mongoose.model('Toy', toySchema);
const Delivery = mongoose.model('Delivery', deliverySchema);

app.use(express.json());

app.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ name: req.body.name, email: req.body.email, password: hashedPassword });
  await user.save();
  res.send(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('User not found');
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(401).send('Invalid password');
  const token = jwt.sign({ _id: user._id }, 'secretkey');
  res.send({ token });
});

app.post('/letters', async (req, res) => {
  const letter = new Letter(req.body);
  await letter.save();
  res.send(letter);
});

app.get('/letters', async (req, res) => {
  const letters = await Letter.find();
  res.send(letters);
});

app.patch('/letters/:id', async (req, res) => {
  const letter = await Letter.findByIdAndUpdate((link unavailable), req.body, { new: true });
  res.send(letter);
});

app.post('/toys', async (req, res) => {
  const toy = new Toy(req.body);
  await toy.save();
  res.send(toy);
});

app.get('/toys', async (req, res) => {
  const toys = await Toy.find();
  res.send(toys);
});

app.post('/deliveries', async (req, res) => {
  const delivery = new Delivery(req.body);
  await delivery.save();
  res.send(delivery);
});

app.get('/deliveries', async (req, res) => {
  const deliveries = await Delivery.find();
  res.send(deliveries);
});

app.get('/santa-deliveries', async (req, res) => {
  const deliveries = await Delivery.find({ senderName: 'Santa' });
  res.send(deliveries);
});

app.get('/santa-received-letters', async (req, res) => {
  const letters = await Letter.find({ receiverName: 'Santa' });
  res.send(letters);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
