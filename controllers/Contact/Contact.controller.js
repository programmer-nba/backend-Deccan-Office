const Contact = require('../../model/Contact/Contact');

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        return res.json({
            message: 'Successfully retrieved all contacts',
            status: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error getting contacts:', error);
        return res.status(500).json({
            message: 'Failed to get contacts',
            status: false,
            error: error.message
        });
    }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Successfully retrieved contact',
            status: true,
            data: contact
        });
    } catch (error) {
        console.error('Error getting contact by ID:', error);
        return res.status(500).json({
            message: 'Failed to get contact',
            status: false,
            error: error.message
        });
    }
};

// Add new contact
exports.addContact = async (req, res) => {
    try {
        const contactData = req.body;
        const newContact = new Contact(contactData);
        await newContact.save();
        return res.status(201).json({
            message: 'Contact added successfully',
            status: true,
            data: newContact
        });
    } catch (error) {
        console.error('Error adding contact:', error);
        return res.status(500).json({
            message: 'Failed to add contact',
            status: false,
            error: error.message
        });
    }
};

// Update contact
exports.updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactData = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
        if (!updatedContact) {
            return res.status(404).json({
                message: 'Contact not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Contact updated successfully',
            status: true,
            data: updatedContact
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return res.status(500).json({
            message: 'Failed to update contact',
            status: false,
            error: error.message
        });
    }
};

// Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({
                message: 'Contact not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Contact deleted successfully',
            status: true,
            data: deletedContact
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({
            message: 'Failed to delete contact',
            status: false,
            error: error.message
        });
    }
};
