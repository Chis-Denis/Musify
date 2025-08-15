class CreateDialog {
    elements = {
        dialog: '.add-song-dialog-container',
        nameInput: 'input[name="name"]',
        typeSelect: 'mat-select[name="type"]',
        publicOption: 'mat-option[value="public"]',
        privateOption: 'mat-option[value="private"]',
        saveButton: 'button:contains("Save")',
        cancelButton: 'button:contains("Cancel")',
    };

}

export default new CreateDialog();
