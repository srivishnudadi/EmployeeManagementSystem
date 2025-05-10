const express = require('express');
const router = express.Router();
const db = require('../db/db');
const multer = require('multer');
const path = require('path');

// 🔐 Middleware to check login
function isLoggedIn(req, res, next) {
  if (req.session.loggedin) next();
  else res.redirect('/login');
}

// 📂 Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 📄 GET: Login Page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// 🔐 POST: Handle Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.loggedin = true;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });
});

// 🚪 Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 🏠 GET: Dashboard (Public view)
router.get('/', (req, res) => {
  const group = req.query.group || '';
  const search = req.query.search || '';
  let query = 'SELECT * FROM employees WHERE 1=1';
  let params = [];

  if (group) {
    query += ' AND `group` = ?';
    params.push(group);
  }

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.render('dashboard', {
      employees: results,
      loggedin: req.session.loggedin,
      search,
      group
    });
  });
});

// 🆕 POST: Add Employee (Requires Login)
router.post('/add', isLoggedIn, upload.single('photo'), (req, res) => {
  const { name, designation, company_name, validity_date, group } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  db.query('INSERT INTO employees SET ?', {
    name,
    designation,
    company_name,
    validity_date,
    group,
    photo
  }, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// 📝 POST: Update Employee
router.post('/edit/:id', isLoggedIn, upload.single('photo'), (req, res) => {
  const id = req.params.id;
  const { name, designation, company_name, validity_date, group } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const data = { name, designation, company_name, validity_date, group };
  if (photo) data.photo = photo;

  db.query('UPDATE employees SET ? WHERE id = ?', [data, id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// ❌ GET: Delete Employee
router.get('/delete/:id', isLoggedIn, (req, res) => {
  db.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;


