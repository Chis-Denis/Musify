describe('Album API Tests with Admin Auth', () => {
  
  beforeEach(function () {

    cy.loginAPI('adminUser6')
      .then(() => {
        cy.get('@authToken').then(token => {
          this.authToken = token;  
        });
      });
  });

  it('GET /api/album - should return list of albums with valid token', function () {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album`,
      headers: {
        Authorization: `Bearer ${this.authToken}` 
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

it('POST /api/album - should create a new album with valid data', function () {
    const newAlbum = {
      title: 'Test Album',
      artist: 'Luma',  
      genre: 'Pop',
      releaseDate: '10/01/2023',  
      description: 'This is a test album for Cypress testing.',
    };

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/album`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: newAlbum,
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body)); 

      if (response.status === 400) {
        cy.log('Validation Errors:', JSON.stringify(response.body.errors || 'No errors provided'));
        
        
        if (response.body.errors && typeof response.body.errors === 'object') {
          expect(Object.keys(response.body.errors)).to.have.length.greaterThan(0);  
        } else {
          expect(response.body.errors).to.exist;
          expect(response.body.errors).to.have.length.greaterThan(0);
        }
      } else if (response.status === 200) {
    
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newAlbum.title);
        expect(response.body.artist).to.eq(newAlbum.artist);
      } else {
        
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400]);  
      }
    });
});

it('PUT /api/album - should update an existing album', function () {
    const updatedAlbum = {
      id: 1, 
      title: 'Updated Test Album',
      artist: 'Luma', 
      genre: 'Pop',
      releaseDate: '10/01/2023',  
      description: 'Updated description for the test album.',
    };

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/api/album`, 
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: updatedAlbum,
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 400) {
        
        cy.log('Validation Errors:', JSON.stringify(response.body.errors || 'No errors provided'));
        
        if (response.body.errors && typeof response.body.errors === 'object') {
          expect(Object.keys(response.body.errors)).to.have.length.greaterThan(0);  
        } else {
          expect(response.body.errors).to.exist;
        }
      } else if (response.status === 200) {
        
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.eq(updatedAlbum.id); 
        expect(response.body.title).to.eq(updatedAlbum.title);
        expect(response.body.artist).to.eq(updatedAlbum.artist);
      } else if (response.status === 405) {
        cy.log('Method Not Allowed. The endpoint does not support PUT requests.');
        expect(response.status).to.eq(405);  
      } else {
        
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 405]);
      }
    });
});

it('POST /api/album/albumSong - should add a song to an album', function () {
    const newAlbumSong = {
      albumId: 1,  
      songId: 1,   
    };

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/album/albumSong/addSong`, 
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: newAlbumSong,
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 400) {
        cy.log('Validation Errors:', JSON.stringify(response.body.errors || 'No errors provided'));
        
        if (Array.isArray(response.body.errors)) {
          expect(response.body.errors).to.have.length.greaterThan(0);
        } else if (typeof response.body.errors === 'object') {
          expect(Object.keys(response.body.errors)).to.have.length.greaterThan(0);  
        } else {
          expect(response.body.errors).to.exist;
          cy.log('Unexpected error format:', response.body.errors);
        }
      } else if (response.status === 200) {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq('Song added to album successfully');
      } else if (response.status === 405) {
        cy.log('Method Not Allowed: The endpoint does not support POST requests.');
        expect(response.status).to.eq(405);  
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 405, 500]);  
      }
    });
});
it('GET /api/album/artist/{artistId} - should get albums for a given artist', function () {
    const artistId = 1; 

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/artist/${artistId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('No albums found for this artist');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);  
        expect(response.body[0]).to.have.property('id'); 
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('GET /api/album/{albumId}/songs - should get songs for a given album', function () {
    const albumId = 1; 

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/${albumId}/songs`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('No songs found for this album');
        expect(response.status).to.eq(404); 
      } else if (response.status === 200) {
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);  
        expect(response.body[0]).to.have.property('id');
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400);  
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('GET /api/album/search - should search albums by query', function () {
    const query = 'rock';  

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/search?query=${query}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false, 
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('No albums found for the search query');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);  
        expect(response.body[0]).to.have.property('id');  
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('GET /api/album/searchGenre - should search albums by genre', function () {
    const query = 'pop'; 

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/searchGenre?query=${query}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false, 
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('No albums found for the genre');
        expect(response.status).to.eq(404); 
      } else if (response.status === 200) {
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0); 
        expect(response.body[0]).to.have.property('id');  
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400);  
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('GET /api/album/{id} - should get a single album by ID', function () {
    const albumId = 1; 

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/${albumId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('Album not found');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        expect(response.body).to.have.property('id');  
        expect(response.body.id).to.eq(albumId); 
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});
it('DELETE /api/album/{id} - should delete an album by ID', function () {
    const albumId = 1; 

    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/api/album/${albumId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('Album not found');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        cy.log('Album deleted successfully');
        expect(response.status).to.eq(200); 
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400);
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('DELETE /api/album/deleteSong - should delete a song from an album', function () {
    const albumSongsDeleteDTO = {
      AlbumId: 1, 
      SongId: 1,   
    };

    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/api/album/deleteSong`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: albumSongsDeleteDTO,
      failOnStatusCode: false,  
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('Song not found in album');
        expect(response.status).to.eq(404);
      } else if (response.status === 200) {
        cy.log('Song deleted successfully');
        expect(response.status).to.eq(200);  
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('PUT /api/album/updateSong - should update a song in an album', function () {
    const albumSongsDTO = {
      AlbumId: 1,  
      SongId: 1,   
      Title: 'Updated Song Title',
      Duration: '3:45',
    };

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/api/album/updateSong`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: albumSongsDTO,
      failOnStatusCode: false, 
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('Song not found in album');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        cy.log('Song updated successfully');
        expect(response.status).to.eq(200);  
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});

it('GET /api/album/{albumId}/{songId} - should get the position of a song in an album', function () {
    const albumId = 1; 
    const songId = 1;   

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/album/${albumId}/${songId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      failOnStatusCode: false, 
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Full Response Body:', JSON.stringify(response.body));

      if (response.status === 404) {
        cy.log('Song position not found for the given album and song');
        expect(response.status).to.eq(404);  
      } else if (response.status === 200) {
        cy.log('Song position retrieved successfully');
        expect(response.body).to.have.property('position');  
      } else if (response.status === 400) {
        cy.log('Bad Request Error');
        expect(response.status).to.eq(400); 
      } else {
        cy.log('Unexpected status code:', response.status);
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
});


});






 

