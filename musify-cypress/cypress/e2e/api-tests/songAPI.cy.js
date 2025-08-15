describe('Song API Tests with Auth', () => {

  let songId;

  beforeEach(function () {
    cy.loginAPI('userForApiTest')
      .then(() => {
        cy.get('@authToken').then(token => {
          this.authToken = token;
        });
      });
  });

  it('GET /api/Song - should return list of songs with valid token', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/Song`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    }
  }).then(response => {
    expect(response.status).to.eq(200);
    cy.log('Response body first item:', JSON.stringify(response.body[0]));
    expect(response.body).to.be.an('array');
    if (response.body.length > 0) {
      expect(response.body[0]).to.include.keys('id', 'title', 'artistsStageName', 'duration', 'creationDate', 'artistIds');
    }
  });
});


  it('POST /api/Song - should create a new song with valid data', function () {
    const newSong = {
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 240
    };

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/Song`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      body: newSong,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq(newSong.title);
      songId = response.body.id; 
    });
  });

  it('GET /api/Song/{id} - should fetch a song by ID', function () {
  expect(songId).to.exist;

  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/Song/${songId}`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.eq(200);

    expect(response.body).to.include.keys('id', 'title', 'artistsStageName', 'duration', 'creationDate', 'artistIds');
    expect(response.body.id).to.eq(songId);
  });
});


  it('PUT /api/Song/{id} - should update a song by ID', function () {
    expect(songId).to.exist;

    const updatedSong = {
      id: songId,
      title: 'Updated Test Song',
      artist: 'Updated Artist',
      album: 'Updated Album',
      duration: 300
    };

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/api/Song/${songId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      body: updatedSong,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(204); // sau 200 în funcție de API
    });
  });

  it('PUT /api/Song/{id}/titles-alternative - should add titles with languages to song', function () {
  expect(songId).to.exist;

  const payload = {
    title: ['Alternative Title 1', 'Alternative Title 2'],
    language: ['en', 'fr']
  };

  cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/api/Song/${songId}/titles-alternative`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    body: payload,
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.eq(204); // sau 200 în funcție de API
  });
});

it('GET /api/Song/search - should return songs matching the name', function () {
  const searchName = 'Test'; 
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/Song/search`,
    qs: {
      name: searchName
    },
    headers: {
      Authorization: `Bearer ${this.authToken}`
    }
  }).then(response => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');

    if (response.body.length > 0) {
      response.body.forEach(song => {
        expect(song.title.toLowerCase()).to.include(searchName.toLowerCase());
      });
    }
  });
});

it('GET /api/Song/trending - should return a list of trending songs', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/Song/trending`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    }
  }).then(response => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');

    if (response.body.length > 0) {
      response.body.forEach(song => {
        expect(song).to.include.keys('id', 'title', 'artistsStageName', 'duration', 'creationDate', 'artistIds');
      });
    }
  });
});

it('GET /api/Song/artist/{artistId} - should return songs for a given artist ID', function () {
  const artistId = 2; 

  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/Song/artist/${artistId}`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    failOnStatusCode: false
  }).then(response => {
    expect([200, 404]).to.include(response.status);

    if (response.status === 200) {
      expect(response.body).to.be.an('array');
      response.body.forEach(song => {
        expect(song).to.include.keys('id', 'title', 'artistsStageName', 'duration', 'creationDate', 'artistIds');
        expect(song.artistIds).to.include(artistId);
      });
    } else {
      cy.log(`No songs found for artist ID ${artistId}`);
    }
  });
});



  it('DELETE /api/Song/{id} - should delete a song by ID', function () {
    expect(songId).to.exist;

    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/api/Song/${songId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(204);
    });
  });

});
