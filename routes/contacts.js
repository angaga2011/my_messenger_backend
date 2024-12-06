const express = require('express');
const { addContact } = require('../controllers/userContactsController');
const router = express.Router();

router.post('/addContact', addContact);

module.exports = router;