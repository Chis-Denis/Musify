export const NotificationMessages = {

  auth: {
    loginSuccess: 'You have logged in successfully.',
    loginError: 'Invalid email or password.',
    registerSuccess: 'Your account has been created successfully.',
    registerError: 'This email address is already associated with an account.',
    forgotPasswordSuccess: 'Password reset link sent. Please check your email.',
    forgotPasswordError: 'This email is not registered.',
    resetPasswordSuccess: 'Your password has been reset successfully.',
    resetPasswordError: 'Failed to reset password. Invalid or expired token.',
    emailRequired: 'You must enter a value',
    emailInvalid: 'Not a valid email',
    allFieldsRequired: 'All fields are required'
  },

  user: {
    createSuccess: 'User created successfully.',
    createError: 'This email address is already associated with an account.',
    deleteSuccess: 'User deleted successfully.',
    updateSuccess: 'User updated successfully.',
    notFound: 'User not found.',
    changePasswordSuccess: 'Password changed successfully.',
    changePasswordError: 'Failed to change password.'
  },

  admin: {
    activateSuccess: 'User account activated successfully.',
    deactivateSuccess: 'User account deactivated successfully.',
    activateError: 'Failed to activate user account.',
    deactivateError: 'Failed to deactivate user account.',
    changeRoleSuccess: 'User role updated successfully.',
    changeRoleError: 'Failed to update user role.',
    invalidRole: 'Invalid role specified.',
    userNotFound: 'User not found.'
  },

  song: {
    createSuccess: 'Song created successfully.',
    createError: 'Failed to create song.',
    updateSuccess: 'Song updated successfully.',
    updateError: 'Failed to update song.',
    notFound: 'Song not found.',
    deleteSuccess: 'Song deleted successfully.',
    deleteError: 'Song could not be deleted.',
    searchNoResults: 'No songs matched your search.',
    trendingError: 'Failed to load trending songs.',
    addAlternativeSuccess: 'Alternative titles added successfully.',
    addAlternativeError: 'Failed to add alternative titles.',
    duplicateAlternative: 'This alternative title already exists.',
    linkCopied: 'Link copied to clipboard!',
    artistSongsError: 'Failed to load artists songs.'
  },

  album: {
    // create
    createSuccess: 'Album created successfully.',
    createError: 'Failed to create album.',

    // update
    updateSuccess: 'Album updated successfully.',
    updateError: 'Failed to update album.',

    // delete
    deleteSuccess: 'Album deleted successfully.',
    deleteError: 'Failed to delete album.',
    deleteQuestion: 'Are you sure you want to delete this album?',

    // load
    notFound: 'Album not found.',
    detailsLoadError: 'Failed to load album details.',
    loadError: 'Failed to load albums.',

    // album artist
    artistNotFound: 'Artist not found.',
    artistLoadError: 'Failed to load artist information.',

    // album songs
    songNotFound: 'Songs not found.',
    songLoadError: 'Failed to load album songs.',
    searchNoResults: 'No albums matched your search.',
    genreSearchNoResults: 'No albums found for this genre.',
    songAddedToAlbum: 'Song added to album.',
    songAddError: 'Failed to add song to album.',
    songOrderUpdated: 'Song order updated successfully.',
    songOrderUpdateError: 'Failed to update song order.',
    songAlreadyInAlbum: 'This song is already in the album.',
    positionTaken: 'This position is already taken in the album.',
    songRemoved: 'Song removed from album.',
    songRemoveError: 'Failed to remove song from album.',
    songNotInAlbum: 'The song is not part of the album.',
    updateAlbumSongSuccess: 'Song updated in album successfully.',
    updateAlbumSongError: 'Failed to update song in album.'
  },

  playlist: {
    createSuccess: 'Playlist created successfully.',
    songAddError: 'Failed to add song to playlist.',
    createError: 'Failed to create playlist.',
    updateNameSuccess: 'Playlist name updated successfully.',
    updateNameError: 'Failed to update playlist name.',
    deleteSuccess: 'Playlist deleted successfully.',
    deleteError: 'Failed to delete playlist.',
    notFound: 'Playlist not found.',
    alreadyFollowing: 'You are already following this playlist.',
    followSuccess: 'You are now following this playlist.',
    unfollowSuccess: 'You have unfollowed the playlist.',
    followError: 'Failed to follow playlist.',
    unfollowError: 'Failed to unfollow playlist.',
    notPublic: 'Playlist exists but is not public.',
    songAdded: 'Song added to playlist.',
    songRemoved: 'Song removed from playlist.',
    reorderSuccess: 'Playlist song order updated.',
    reorderError: 'Provided song list is invalid.',
    albumAdded: 'Album songs added to playlist.',
    albumOrPlaylistMissing: 'Album or playlist does not exist.',
    albumHasNoSongs: 'Album has no songs.',
    albumDuplicateSongs: 'One or more songs from the album already exist in the playlist.',
    privateLoadError: 'Failed to load private playlists.',
    publicLoadError: 'Failed to load public playlists.',
    searchNoResults: 'No playlists matched your search.',
    albumRemoved: 'Album removed from playlist.',
    albumRemoveError: 'Failed to remove album from playlist.',
    duplicateSongError: 'This song is already in the playlist.',
    addAlbumError: 'Failed to add album to playlist.',
    duplicateAlternative: 'This song is already in the playlist.'
  },

  artist: {
    createSuccess: 'Artist added successfully.',
    createError: 'Failed to add artist.',
    updateSuccess: 'Artist updated successfully.',
    updateError: 'Failed to update artist.',
    deleteSuccess: 'Artist deleted successfully.',
    deleteError: 'Failed to delete artist.',
    notFound: 'Artist not found.',
    isNull: 'Artist is null.',
    typeMismatch: 'Artist type does not match the existing record.',
    bandOrMemberMissing: 'Band or member is null.',
    addMemberSuccess: 'Member added to band.',
    removeMemberSuccess: 'Member removed from band.',
    memberError: 'Failed to modify band members.',
    searchNoResults: 'No artists matched your search.',
    loadError: 'Failed to load artists.',
    addMemberError: 'Failed to add member to band.',
    removeMemberError: 'Failed to remove member from band.'
  },

  validation: {
    passwordPolicy: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    requiredFields: 'All fields are required.'
  }
};
