import PlaylistPage from "../../pages/Playlist/PlaylistPage";
import PlaylistCategoriesPage from "../../pages/Playlist/PlaylistCategoriesPage";
import { login } from "../../utils/loginUtils";
import MyPlaylistPage from "../../pages/Playlist/MyPlaylistPage";
import CreateDialog from "../../pages/Playlist/CreateDialog";
import EditDialog from "../../pages/Playlist/EditDialog";
import DeleteDialog from "../../pages/Playlist/DeleteDialog";
import PlaylistDetailPage from "../../pages/Playlist/PlaylistDetailPage";

describe('Main Playlist Page Tests', () => {
    let users;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            PlaylistPage.visit();
            cy.url().should('include', '/home/playlists');
        });
    });


    it('should navigate to the playlist page', () => {
        cy.log('Visiting Playlist Page');
        cy.log('Base URL: ' + Cypress.config().baseUrl);
        cy.log('Playlist Page URL: ' + Cypress.config().baseUrl + '/home/playlists');
        cy.log('Playlist Page Elements: ' + JSON.stringify(PlaylistPage.getElements()));


        PlaylistPage.visit();

        cy.url().then((url) => {
        cy.log('Playlists page URL: ' + url);
        });

        cy.get(PlaylistPage.elements.playlists, { timeout: 10000 }).should('exist');

    });

    it('should render playlist categories section', () => {
        PlaylistPage.visit();
        cy.url().should('include', '/home/playlists');
        cy.get(PlaylistPage.elements.categories, { timeout: 10000 }).should('exist');
    });

    it('should render my playlists section', () => {
        PlaylistPage.visit();
        cy.url().should('include', '/home/playlists');
        cy.get(PlaylistPage.elements.myPlaylists, { timeout: 10000 }).should('exist');
    });

});

describe('Playlist Categories Page Tests', () => {
    let users;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            PlaylistPage.visit();
            cy.url().should('include', '/home/playlists');
        });
    });

    it('should see the playlist categories', () => {
         cy.get('body').then(($body) => {
        if ($body.find(PlaylistPage.elements.loadingSpinner).length > 0) {
            cy.log('Waiting for loading to complete');
            cy.get(PlaylistPage.elements.loadingSpinner).should('not.exist');
        }
        });
        cy.get(PlaylistPage.elements.categories, { timeout: 10000 }).should('exist');
    });

    it('should verify playlist categories page element', () => {
        cy.get(PlaylistCategoriesPage.elements.playlistCategoriesSection, { timeout: 10000 }).should('exist');
    });

     it('should have all buttons and search input', () => {
        cy.get(PlaylistCategoriesPage.elements.allButton, { timeout: 10000 }).should('exist');
        cy.get(PlaylistCategoriesPage.elements.publicButton, { timeout: 10000 }).should('exist');
        cy.get(PlaylistCategoriesPage.elements.privateButton, { timeout: 10000 }).should('exist');
        cy.get(PlaylistCategoriesPage.elements.createButton, { timeout: 10000 }).should('exist');
        cy.get(PlaylistCategoriesPage.elements.searchInput, { timeout: 10000 }).should('exist');    
    });

    it('should display all playlists when "All" is selected', () => {
        cy.get(PlaylistCategoriesPage.elements.allButton).click();
        cy.get(PlaylistCategoriesPage.elements.carousel).first().within(() => {
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist)
                .should('exist')
                .and('have.length.greaterThan', 0);
        });
    });

    it('should display only public playlists when "Public" is selected', () => {
        cy.get(PlaylistCategoriesPage.elements.publicButton).click();
        cy.get(PlaylistCategoriesPage.elements.carousel).first().within(() => {
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist)
                .should('exist')
                .and('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el).find('.playlist-type').should('contain.text', 'public');
                });
        });
    });

    it('should display only private playlists when "Private" is selected', () => {
        cy.get(PlaylistCategoriesPage.elements.privateButton).click();
        cy.get(PlaylistCategoriesPage.elements.carousel).first().within(() => {
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist)
                .should('exist')
                .and('have.length.greaterThan', 0)
                .each(($el) => {
                    cy.wrap($el).find('.playlist-type').should('contain.text', 'private');
                    cy.wrap($el).should('contain.text', 'Chloe Evans');
                });
        });
    });

    it('should display found playlists when searching', () => {
        const searchQuery = 'a';

        cy.get(PlaylistCategoriesPage.elements.searchInput)
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true })     
        .type(searchQuery, { delay: 100 });

        cy.get(PlaylistCategoriesPage.elements.carousel).first().within(() => {
        cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist)
            .should('exist')
            .and('have.length.greaterThan', 0)
            .each(($el) => {
            cy.wrap($el)
                .find('mat-card-title')
                .should('contain.text', searchQuery);
            });
        });

    });

    it('should display empty message when no playlists found', () => {
        const searchQuery = 'jklmnopqrstuvwxyz';

        cy.get(PlaylistCategoriesPage.elements.searchInput)
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true })     
        .type(searchQuery, { delay: 100 });

        cy.get(PlaylistCategoriesPage.elements.emptyCategoriesMessage, { timeout: 10000 })
            .should('exist')
            .and('contain.text', 'No playlists matched your search');
    });

    it('should not be empty when search is cleared', () => {
        cy.get(PlaylistCategoriesPage.elements.searchInput)
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true })     
        .clear();

        cy.get(PlaylistCategoriesPage.elements.carousel).first().within(() => {
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist)
                .should('exist')
                .and('have.length.greaterThan', 0);
        });
    });
});

describe('My Playlists Page Tests', () => {
    let users;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            PlaylistPage.visit();
            cy.url().should('include', '/home/playlists');
        });
    });

    it('should see the my playlists section', () => {
        cy.get(PlaylistPage.elements.myPlaylists, { timeout: 10000 }).should('exist');
    });

    it('should render section buttons', () => {
        cy.get(MyPlaylistPage.elements.followedButton, { timeout: 10000 }).should('exist');
        cy.get(MyPlaylistPage.elements.createdByMeButton, { timeout: 10000 }).should('exist');
    });

    it('should display followed playlists when "Followed" is selected', () => {
        cy.get(MyPlaylistPage.elements.followedButton).click();
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem)
                .should('exist')
                .and('have.length.greaterThan', 0);
            cy.get(MyPlaylistPage.elements.playlistItem).each(($el) => {
                cy.wrap($el).find(MyPlaylistPage.elements.followButton).should('exist');
            });
        });
    });

    it('should display created playlists when "Created by Me" is selected', () => {   
        cy.get(MyPlaylistPage.elements.createdByMeButton).click();
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem)
                .should('exist')
                .and('have.length.greaterThan', 0).each(($el) => {
                    cy.wrap($el).find(MyPlaylistPage.elements.editButton).should('exist');
                    cy.wrap($el).find(MyPlaylistPage.elements.deleteButton).should('exist');
                });
        });
    });

    it('should display empty message when no playlists found', () => {
        cy.intercept('GET', '**/api/Playlist/followed/**', {
            statusCode: 200,
            body: []
        }).as('getFollowedPlaylists');
        
        PlaylistPage.visit();
        cy.url().should('include', '/home/playlists');
        
        cy.get(MyPlaylistPage.elements.followedButton).click();
        
        cy.wait('@getFollowedPlaylists');
        
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem, { timeout: 10000 }).should('not.exist');
        });
        
        cy.get(MyPlaylistPage.elements.playlistEmptyMessage, { timeout: 10000 })
            .should('exist')
            .and('contain.text', 'No followed playlists');
    });

    it('should display empty message when no created playlists found', () => {
        cy.intercept('GET', '**/api/Playlist', {
            statusCode: 200,
            body: []
        }).as('getCreatedPlaylists');
        
        PlaylistPage.visit();
        cy.url().should('include', '/home/playlists');
        
        cy.get(MyPlaylistPage.elements.createdByMeButton).click();
        
        cy.wait('@getCreatedPlaylists');
        
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem, { timeout: 10000 }).should('not.exist');
        });
        
        cy.get(MyPlaylistPage.elements.playlistEmptyMessage, { timeout: 10000 })
            .should('exist')
            .and('contain.text', 'No created playlists');
    });
});

describe('Playlist Dialog Tests', () => { 
    let users;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            PlaylistPage.visit();
            cy.url().should('include', '/home/playlists');
        });
    });


    function createPlaylist(playlistName, isPublic = true) {
        cy.get(CreateDialog.elements.dialog).should('be.visible');
        cy.get(CreateDialog.elements.nameInput).type(playlistName);
        cy.get(CreateDialog.elements.typeSelect).click();
        if (isPublic) {
            cy.get(CreateDialog.elements.publicOption).click();
        } else {
            cy.get(CreateDialog.elements.privateOption).click();
        }
        cy.get(CreateDialog.elements.saveButton).click();
    }

    function deletePlaylist(playlistName) {
        
        cy.get(MyPlaylistPage.elements.createdByMeButton).click();
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
        cy.contains(MyPlaylistPage.elements.playlistItem, playlistName)
            .should('exist')
            .within(() => {
                cy.get(MyPlaylistPage.elements.deleteButton).click(); 
            });
        });
        
        cy.get(DeleteDialog.elements.deleteButton).click();
        
        cy.get(PlaylistPage.elements.myPlaylists, {timeout: 10000}).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem).should('not.contain.text', playlistName);
        });
        
    }

    it('should open + close create playlist dialog', () => {
        cy.get(PlaylistCategoriesPage.elements.createButton).click();
        cy.get(CreateDialog.elements.dialog, { timeout: 10000 }).should('be.visible');
        cy.get(CreateDialog.elements.cancelButton).click();
        cy.get(CreateDialog.elements.dialog).should('not.exist');
    });

    it('should open + close delete playlist dialog', () => {
        cy.get(MyPlaylistPage.elements.createdByMeButton).click();
        
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem).first().within(() => {
                cy.get('button mat-icon:contains("delete")').first().click();
            });
        });
        
        cy.get(DeleteDialog.elements.deleteDialog, { timeout: 10000 }).should('be.visible');
        cy.get(DeleteDialog.elements.deleteDialog).should('contain.text', 'Are you sure you want to delete this playlist?');
        cy.get(DeleteDialog.elements.cancelButton).click();
        cy.get(DeleteDialog.elements.deleteDialog).should('not.exist');
    });

    it('should open + close edit playlist dialog', () => {
        cy.get(MyPlaylistPage.elements.createdByMeButton).click();
        
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem).first().within(() => {
                cy.get('button mat-icon:contains("edit")').first().click();
            });
        });
        
        cy.get(EditDialog.elements.dialog, { timeout: 10000 }).should('be.visible');
        cy.get(EditDialog.elements.cancelButton).click();
        cy.get(EditDialog.elements.dialog).should('not.exist');
    });


    describe('CRUD Playlist Tests', () => {
        let playlistName;

        it('should create a public playlist', () => {
            playlistName = 'Test Playlist Public ' ;
            cy.get(PlaylistCategoriesPage.elements.createButton).click();
            createPlaylist(playlistName, true);
            
            cy.get(MyPlaylistPage.elements.createdByMeButton).click();
            
            cy.get(PlaylistPage.elements.myPlaylists).within(() => {
                cy.get(MyPlaylistPage.elements.playlistItem)
                    .should('contain.text', playlistName)
                    .and('contain.text', 'public');
            });
        });

        it('should create a private playlist', () => {
            playlistName = 'Test Playlist Private ' ;
            cy.get(PlaylistCategoriesPage.elements.createButton).click();
            createPlaylist(playlistName, false);
            
            cy.get(MyPlaylistPage.elements.createdByMeButton).click();
            
            cy.get(PlaylistPage.elements.myPlaylists).within(() => {
                cy.get(MyPlaylistPage.elements.playlistItem)
                    .should('contain.text', playlistName)
                    .and('contain.text', 'private');
            });
        });

        it('should delete a playlist', () => {
            playlistName = 'Test Playlist Delete ';
            cy.get(PlaylistCategoriesPage.elements.createButton).click();
            createPlaylist(playlistName, true);
            deletePlaylist(playlistName);
            playlistName = '';
        });

        it('should edit a playlist', () => {
            playlistName = 'Test Playlist Edit ';
            cy.get(PlaylistCategoriesPage.elements.createButton).click();
            createPlaylist(playlistName, true);
            cy.get(MyPlaylistPage.elements.createdByMeButton).click();
            cy.get(PlaylistPage.elements.myPlaylists).within(() => {
                cy.contains(MyPlaylistPage.elements.playlistItem, playlistName).should('exist').within(() => {
                    cy.get(MyPlaylistPage.elements.editButton).click();
                });
            });
            cy.get(EditDialog.elements.dialog, { timeout: 10000 }).should('be.visible');
            cy.get(EditDialog.elements.nameInput).should('have.value', playlistName);

            cy.get(EditDialog.elements.nameInput).clear().type('Edited Playlist Name');
            cy.get(EditDialog.elements.saveButton).click();

            cy.get(EditDialog.elements.dialog).should('not.exist');
            cy.get(MyPlaylistPage.elements.playlistItem)
                .should('contain.text', 'Edited Playlist Name')
                .and('contain.text', 'public');
            cy.then(() => {
                playlistName = 'Edited Playlist Name';
            });
        });

        afterEach(() => {
            if(playlistName && playlistName !== '') {
                deletePlaylist(playlistName);
                playlistName = ''; 
            }
        });
    });

});


describe('Playlist Follow/Unfollow Tests', () => {
     let users;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            PlaylistPage.visit();
            cy.url().should('include', '/home/playlists');
        });
    });

    it('should follow and unfollow a playlist', () => {
        let playlistName = 'Morning Motivations';

        // Here we test follow
        cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist, { timeout: 10000 })
            .contains('mat-card-title', playlistName) 
            .closest(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist) 
            .should('exist')
            .within(() => {
                cy.get(PlaylistCategoriesPage.elements.followButton).click();
            });

        cy.get(MyPlaylistPage.elements.followedButton).click();
        cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem)
            .contains('mat-card-title', playlistName)
            .should('exist');
        });

        // Here we test unfollow
        cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist, { timeout: 10000 })
            .contains('mat-card-title', playlistName) 
            .closest(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist) 
            .should('exist')
            .within(() => {
                cy.get(PlaylistCategoriesPage.elements.followButton).click();
            });

         cy.get(PlaylistPage.elements.myPlaylists).within(() => {
            cy.get(MyPlaylistPage.elements.playlistItem)
            .contains('mat-card-title', playlistName)
            .should('not.exist');
        });

    });
});

describe('Playlist detail page tests', () => {
    let users;
    let playlistName;

    before(() => {
        cy.fixture('users').then((usersData) => {
            users = usersData;
            const email = users.adminUser20?.email
            const password = users.adminUser20?.password
            login(email, password);
            
        });
    });

    describe('Playlist details - Non-owner user Tests', () => {
        before(() => {
            PlaylistPage.visit();   
            cy.url().should('include', '/home/playlists');
            playlistName = 'Morning Motivations';
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist, { timeout: 10000 })
            .contains(PlaylistCategoriesPage.elements.playlistTitle, playlistName) 
            .closest(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist) 
            .should('exist')
            .within(() => {
                cy.get(PlaylistCategoriesPage.elements.playlistTitle).first().click();
            });
        });

        it('should load playlist details page', () => {
            cy.get(PlaylistDetailPage.elements.releaseDetailsContainer).should('exist');
            cy.get(PlaylistDetailPage.elements.releaseTitle).should('be.visible').and('contain.text', playlistName);
            cy.get(PlaylistDetailPage.elements.releaseArtist).should('contain.text', 'person');
            cy.get(PlaylistDetailPage.elements.releaseGenre).should('be.visible');
            cy.get(PlaylistDetailPage.elements.releaseCount).should('contain.text', 'songs');
            cy.get(PlaylistDetailPage.elements.releaseDescription).should('be.visible');
            cy.get(PlaylistDetailPage.elements.releaseFooter).should('be.visible');
        });

        it('should not have actions for playlist owner', () => {
            
            cy.get(PlaylistDetailPage.elements.releaseHeaderActions).should('not.exist');
            
            cy.get(PlaylistDetailPage.elements.releaseTable).within(() => {
                cy.get(PlaylistDetailPage.elements.releaseTableRow).should('exist');
                cy.get(PlaylistDetailPage.elements.deleteButton).should('not.exist');
            });
        });

        it('should navigate to song page when song is clicked', () => {
            cy.get(PlaylistDetailPage.elements.releaseTableRow).first().click();
            cy.url().should('include', '/home/songs');
            cy.go('back');
        });
    });

    describe('Playlist details - Owner user Tests', () => {
        before(() => {
            PlaylistPage.visit();   
            cy.url().should('include', '/home/playlists');
            playlistName = 'chloe playlist private';
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist, { timeout: 10000 })
            .contains(PlaylistCategoriesPage.elements.playlistTitle, playlistName) 
            .closest(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist) 
            .should('exist')
            .within(() => {
                cy.get(PlaylistCategoriesPage.elements.playlistTitle).first().click();
            });
        });

        it('should load playlist details page', () => {
            cy.get(PlaylistDetailPage.elements.releaseDetailsContainer).should('exist');
            cy.get(PlaylistDetailPage.elements.releaseTitle).should('be.visible').and('contain.text', playlistName);
            cy.get(PlaylistDetailPage.elements.releaseArtist).should('contain.text', 'person');
            cy.get(PlaylistDetailPage.elements.releaseGenre).should('be.visible');
            cy.get(PlaylistDetailPage.elements.releaseCount).should('contain.text', 'songs');
            cy.get(PlaylistDetailPage.elements.releaseDescription).should('be.visible');
            cy.get(PlaylistDetailPage.elements.releaseFooter).should('be.visible');
        });

        it('should have actions for playlist owner', () => {
            cy.get(PlaylistDetailPage.elements.releaseHeaderActions).should('exist');
            
            cy.get(PlaylistDetailPage.elements.releaseTable).within(() => {
                cy.get(PlaylistDetailPage.elements.releaseTableRow).should('exist');
                cy.get(PlaylistDetailPage.elements.deleteButton).should('exist');
            });
        });

        it('should navigate to album page when album is clicked', () => {
            cy.get(PlaylistDetailPage.elements.albumsToggleButton).click();
            cy.get(PlaylistDetailPage.elements.releaseTableRow).first().click();
            cy.url().should('include', '/home/albums');
            cy.go('back');
        });
    });

    describe('Playlist CRUD Tests', () => {
        before(() => {
            PlaylistPage.visit();   
            cy.url().should('include', '/home/playlists');
            playlistName = 'chloe playlist public';
            cy.get(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist, { timeout: 10000 })
            .contains(PlaylistCategoriesPage.elements.playlistTitle, playlistName) 
            .closest(PlaylistCategoriesPage.elements.playlistCategoriesPlaylist) 
            .should('exist')
            .within(() => {
                cy.get(PlaylistCategoriesPage.elements.playlistTitle).first().click();
            });
        });

        function addSongToPlaylist(songName) {
            cy.get(PlaylistDetailPage.elements.addAllButton).should('exist').click();
            cy.get(PlaylistDetailPage.elements.addSongButton).should('exist').click();
            cy.get(PlaylistDetailPage.elements.songInput).should('be.visible').and('be.enabled');
            cy.get(PlaylistDetailPage.elements.songInput).type(songName);
            cy.get(PlaylistDetailPage.elements.songRadioButton).should('contain.text', songName).first().click();
            cy.get(PlaylistDetailPage.elements.addButton).click();
        }

        function deleteSongFromPlaylist(songName) {
            cy.get(PlaylistDetailPage.elements.releaseTable).within(() => {
                cy.get(PlaylistDetailPage.elements.releaseTableRow).should('contain.text', songName);
                cy.get(PlaylistDetailPage.elements.deleteButton).should('exist').click();
            });
            cy.get(DeleteDialog.elements.deleteButton).click();
        }

        function addAlbumToPlaylist(albumName) {
            cy.get(PlaylistDetailPage.elements.addAllButton).should('exist').click();
            cy.get(PlaylistDetailPage.elements.addAlbumButton).should('exist').click();
            cy.get(PlaylistDetailPage.elements.albumInput).should('be.visible').and('be.enabled');
            cy.get(PlaylistDetailPage.elements.albumInput).type(albumName);
            cy.get(PlaylistDetailPage.elements.albumRadioButton).should('contain.text', albumName).click();
            cy.get(PlaylistDetailPage.elements.addButton).click();
        }

        function deleteAlbumFromPlaylist(albumName) {
            cy.get(PlaylistDetailPage.elements.releaseTable).within(() => {
                cy.get(PlaylistDetailPage.elements.releaseTableRow).should('contain.text', albumName);
                cy.get(PlaylistDetailPage.elements.deleteAlbumButton).should('exist').click();
            });
            cy.get(DeleteDialog.elements.deleteButton).click();
        }

        it('should add a song to the playlist', () => {
            let songName= 'Nebula';
            addSongToPlaylist(songName);
            cy.get(PlaylistDetailPage.elements.releaseTableRow).should('contain.text', songName);
            deleteSongFromPlaylist(songName);
        });

        it('should delete a song from the playlist', () => {
            let songName = 'Desert Rose';
            addSongToPlaylist(songName);
            deleteSongFromPlaylist(songName); 
            cy.get(PlaylistDetailPage.elements.releaseTableRow).should('not.exist');
        });

        it('should add album to the playlist', () => {
            let albumName = 'Silver Lining';
            addAlbumToPlaylist(albumName);
            cy.get(PlaylistDetailPage.elements.albumsToggleButton).click();
            cy.get(PlaylistDetailPage.elements.releaseTableRow).should('contain.text', albumName);

            deleteAlbumFromPlaylist(albumName);
            cy.get(PlaylistDetailPage.elements.albumsToggleButton).click();
        });

        it('should delete album from the playlist', () => {
            let albumName = 'Silver Lining';
            addAlbumToPlaylist(albumName);
            cy.get(PlaylistDetailPage.elements.albumsToggleButton).click();
            deleteAlbumFromPlaylist(albumName);
            cy.get(PlaylistDetailPage.elements.releaseTableRow).should('not.exist'); 
            cy.get(PlaylistDetailPage.elements.albumsToggleButton).click();
        });
    });

});

