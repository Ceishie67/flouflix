const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('videoFile'), (req, res) => {
  res.redirect('/videos');
});

app.get('/videos', (req, res) => {
  const files = fs.readdirSync('uploads/');
  res.render('videos', { files });
});

app.get('/player/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.render('player', { filename: req.params.filename, filePath });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));