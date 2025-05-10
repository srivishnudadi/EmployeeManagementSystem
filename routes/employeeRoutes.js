// routes/employeeRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db/db.js'); // Adjust the path as necessary

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to handle employee updates
router.post('/edit/:id', upload.single('photo'), (req, res) => {
  const id = req.params.id;
  const { name, designation, company_name, validity_date, group } = req.body;

  // Format validity_date to MySQL compatible format (YYYY-MM-DD)
  const formattedDate = new Date(validity_date).toISOString().split('T')[0];

  // Prepare data for the update query
  const data = {
    name,
    designation,
    company_name,
    validity_date: formattedDate,
    group
  };

  // If a new photo is uploaded, include it in the update
  if (req.file) {
    data.photo = `/uploads/${req.file.filename}`;
  }

  // Update the employee record in the database
  db.query('UPDATE employees SET ? WHERE id = ?', [data, id], (err) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/');
  });
});

module.exports = router;
