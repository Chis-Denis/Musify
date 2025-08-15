class EditDialog {
    elements = {
        dialog: '.add-song-dialog-container',
        nameInput: 'input[name="name"]',
        saveButton: 'button:contains("Save")',
        cancelButton: 'button:contains("Cancel")',
    };
}

export default new EditDialog();
