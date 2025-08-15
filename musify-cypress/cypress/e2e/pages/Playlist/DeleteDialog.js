class DeleteDialog {
    elements = {
        deleteDialog: 'mat-dialog-content',
        deleteMessage: 'Are you sure you want to delete this playlist?',
        deleteButton: 'button:contains("Delete")',
        cancelButton: 'button:contains("Cancel")',
    };
}

export default new DeleteDialog();