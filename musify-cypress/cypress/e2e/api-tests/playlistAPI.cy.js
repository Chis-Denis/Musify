describe('API Tests with Auth', () => {

  it('GET /api/Playlist - should return list of playlists with valid token', function () {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/Playlist`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.log('Playlists fetched:', JSON.stringify(response.body))
      expect(response.body).to.be.an('array')
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.all.keys(
          'id', 'name', 'userId','type' ,'createdAt', 'updatedAt'
        )
      }
    })
  });

  it('POST /api/Playlist + DELETE /api/Playlist/{id} - should create + delete a new playlist with valid token', function () {
    const newPlaylist = {
      name: 'New Playlist',
      userId: 1,
      type: 'public'
    }

    const playlistId = null;

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/Playlist`,
      body: newPlaylist
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.all.keys(
        'id', 'name', 'userId', 'type', 'createdAt', 'updatedAt'
      )
      expect(response.body.name).to.eq(newPlaylist.name)

      const playlistId = response.body.id;

    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.be.oneOf([200, 204]);
    });
    })
  });

    it('GET /api/Playlist/{id} - should return a specific playlist with valid token', function () {
        const playlistId = 1; 
    
        cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}`,
        }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys(
            'id', 'name', 'userId', 'type', 'createdAt', 'updatedAt'
        )
        expect(response.body.id).to.eq(playlistId)
        })
    });

    it('PUT /api/Playlist/{id} - should update a playlist with valid token', function () {  
        const playlistId = 2; 
        const updatedName = 'Updated Playlist Name';
        const originalName = 'Evening Chill';

        cy.request({
            method: 'PUT',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/name`,
            body: `"${updatedName}"`,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(204)
        });
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}`,
        }).then((getResponse) => {
            expect(getResponse.status).to.eq(200)
            expect(getResponse.body.name).to.eq(updatedName)
        });
        cy.request({
            method: 'PUT',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/name`,
            body:`"${originalName}"`,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(204)
        });

    });

    it('GET /api/Playlist/search -should search playlists)', function () {
        const searchQuery = 'Chill';
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/search?name=${searchQuery}`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            if (response.body.length > 0) {
                response.body.forEach(playlist => {
                    expect(playlist.name.toLowerCase()).to.include(searchQuery.toLowerCase())
                });
            }
        })
    });

    it('GET /api/Playlist/public - should get public playlists)', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/public`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            response.body.forEach(playlist => {
                expect(playlist.type).to.eq('public')
            });
        })
    });

    it('GET /api/Playlist/private - should get private playlists)', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/private`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            response.body.forEach(playlist => {
                expect(playlist.type).to.eq('private')
            });
        })
    });

    it('GET /api/Playlist/followed/{id} - should get followed playlists)', function () {
        const userId = 1;
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/followed/${userId}`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            response.body.forEach(playlist => {
                expect(playlist.type).to.eq('public')
            });
        })
    });

    it('GET /api/Playlist/{id}/songs - should be empty', function () {
        const playlistId = 1; 
    
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/songs`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body).to.be.empty
        })
    });

    it('GET /api/Playlist/{id}/songs - should not be empty', function () {
        const playlistId = 5; 
    
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/songs`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body).to.not.be.empty
            response.body.forEach(song => {
                expect(song).to.have.all.keys(
                    'songId', 'position', 'songTitle'
                )
            });
        })
    });

    it('POST /api/Playlist/{id}/songs + DELETE /api/Playlist/{playlistId}/songs/{songId} - should add + remove a song from a playlist', function () {
        const playlistId = 5;
        const songId = 20;

        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/songs`,
            body: JSON.stringify(songId),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(204)
        });
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/songs/${songId}`,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(204)
        });
    });

    it('POST /api/Playlist/{playlistId}/follow/{userId} + POST /api/Playlist/{playlistId}/unfollow/{userId} - should follow + unfollow a playlist', function () {
        const playlistId = 3;
        const userId = 5;

        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/follow/${userId}`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message', 'Playlist followed successfully.')
        });
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/api/Playlist/${playlistId}/unfollow/${userId}`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message', 'Playlist unfollowed successfully.')
        });
    });

}); 
    