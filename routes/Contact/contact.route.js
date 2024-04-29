const express = require('express');
const router = express.Router();
const ContactController = require('../../controllers/Contact/Contact.controller');

// Get all contacts
router.get('/', ContactController.getAllContacts);

// Get contact by ID
router.get('/byid/:id', ContactController.getContactById);

// Add new contact
router.post('/add', ContactController.addContact);

// Update contact
router.put('/update-contact/:id', ContactController.updateContact); //ทดสอบเฉยๆระบบจริงไม่มี

// Delete contact
router.delete('/delete-contact/:id', ContactController.deleteContact); 

module.exports = router;
