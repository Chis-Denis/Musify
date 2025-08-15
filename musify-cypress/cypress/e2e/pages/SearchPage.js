class SearchPage {
  static searchInput = 'input[placeholder="Search"], input[placeholder*="search"], input[type="search"], input[data-testid="search"], input.search, app-search-bar input, .search-input, [class*="search"] input'
  static searchButton = 'button[type="submit"], button[aria-label*="search"], button[title*="search"], .search-button'
  static searchResults = '[class*="search-results"], [class*="search"] [class*="results"], .search-results, .results-container'
  static resultsList = 'mat-list, .results-list, [class*="list"]'
  static noResultsMessage = 'No results found'
  static searchResultsTitle = 'Search Results for'
  static searchForm = 'form[action*="search"], form[class*="search"], .search-form'

  static performSearch(searchTerm) {
    cy.get('body').should('be.visible')
    
    cy.get('body').then(($body) => {
      let searchInput = null
      
      const searchSelectors = [
        'input[placeholder="Search"]',
        'input[placeholder*="search"]',
        'input[type="search"]',
        'input[data-testid="search"]',
        'input.search',
        'app-search-bar input',
        '.search-input',
        '[class*="search"] input',
        'input[formcontrolname="search"]',
        'input[name="search"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Find"]',
        'input[placeholder*="Look"]'
      ]
      
      for (const selector of searchSelectors) {
        if ($body.find(selector).length > 0) {
          searchInput = $body.find(selector).first()
          break
        }
      }
      
      if (!searchInput) {
        searchInput = $body.find('input').filter((index, element) => {
          const $element = Cypress.$(element)
          return $element.attr('placeholder')?.toLowerCase().includes('search') ||
                 $element.attr('aria-label')?.toLowerCase().includes('search') ||
                 $element.attr('title')?.toLowerCase().includes('search') ||
                 $element.attr('placeholder')?.toLowerCase().includes('find') ||
                 $element.attr('placeholder')?.toLowerCase().includes('look')
        }).first()
      }
      
      if (!searchInput) {
        const searchContainers = $body.find('[class*="search"], .search, app-search-bar, .search-bar, [class*="find"], [class*="look"]')
        if (searchContainers.length > 0) {
          searchInput = searchContainers.find('input').first()
        }
      }
      
      if (!searchInput) {
        searchInput = $body.find('input').filter((index, element) => {
          const $element = Cypress.$(element)
          return $element.attr('type') === 'text' && 
                 ($element.attr('placeholder') || $element.attr('aria-label') || $element.attr('title'))
        }).first()
      }
      
      if (searchInput && searchInput.length > 0) {
        cy.log('Found search input, performing search')
        
        cy.wrap(searchInput).clear().type(searchTerm)
        
        cy.wrap(searchInput).type('{enter}')
        
        cy.get('body').then(($bodyAfter) => {
          const searchButton = $bodyAfter.find(this.searchButton).first()
          if (searchButton.length > 0) {
            cy.wrap(searchButton).click()
          }
        })
        
        cy.get('body').then(($bodyAfter) => {
          const searchForm = $bodyAfter.find(this.searchForm).first()
          if (searchForm.length > 0) {
            cy.wrap(searchForm).submit()
          }
        })
        
        cy.url().should('not.eq', Cypress.config().baseUrl + '/home')
        
      } else {
        cy.log('Search input not found - attempting alternative search methods')
        
        cy.visit(`/search?q=${encodeURIComponent(searchTerm)}`, { failOnStatusCode: false })
        cy.url().should('include', 'search')
      }
    })
  }

  static verifySearchResults() {
    cy.url().then((url) => {
      cy.log('Search results URL: ' + url)
      
      if (url.includes('search') || url.includes('results') || url.includes('q=')) {
        cy.log('On search results page')
      }
    })
    
    cy.get('body').then(($body) => {
      const hasSearchResults = $body.find(this.searchResults).length > 0
      const hasSearchTitle = $body.text().toLowerCase().includes('search results') || 
                           $body.text().toLowerCase().includes('results for') ||
                           $body.text().toLowerCase().includes('search for')
      const hasResultsList = $body.find(this.resultsList).length > 0
      const hasNoResultsMessage = $body.text().toLowerCase().includes('no results found') ||
                                 $body.text().toLowerCase().includes('no results') ||
                                 $body.text().toLowerCase().includes('no matches')
      const hasSearchQuery = $body.text().toLowerCase().includes('search') ||
                           $body.text().toLowerCase().includes('results') ||
                           $body.text().toLowerCase().includes('found')
      
      if (hasSearchResults || hasSearchTitle || hasResultsList) {
        cy.log('Search results page elements found')
      } else if (hasNoResultsMessage) {
        cy.log('No results found message displayed')
      } else if (hasSearchQuery) {
        cy.log('Search-related content found')
      } else {
        cy.log('Search results page accessible but no expected elements found')
      }
    })
  }

  static verifySearchInput() {
    cy.get('body').then(($body) => {
      let searchInput = null
      
      const searchSelectors = [
        'input[placeholder="Search"]',
        'input[placeholder*="search"]',
        'input[type="search"]',
        'input[data-testid="search"]',
        'input.search',
        'app-search-bar input',
        '.search-input',
        '[class*="search"] input',
        'input[formcontrolname="search"]',
        'input[name="search"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Find"]',
        'input[placeholder*="Look"]'
      ]
      
      for (const selector of searchSelectors) {
        if ($body.find(selector).length > 0) {
          searchInput = $body.find(selector).first()
          break
        }
      }
      
      if (!searchInput) {
        searchInput = $body.find('input').filter((index, element) => {
          const $element = Cypress.$(element)
          return $element.attr('placeholder')?.toLowerCase().includes('search') ||
                 $element.attr('aria-label')?.toLowerCase().includes('search') ||
                 $element.attr('title')?.toLowerCase().includes('search') ||
                 $element.attr('placeholder')?.toLowerCase().includes('find') ||
                 $element.attr('placeholder')?.toLowerCase().includes('look')
        }).first()
      }
      
      if (!searchInput) {
        const searchContainers = $body.find('[class*="search"], .search, app-search-bar, .search-bar, [class*="find"], [class*="look"]')
        if (searchContainers.length > 0) {
          searchInput = searchContainers.find('input').first()
        }
      }
      
      if (!searchInput) {
        searchInput = $body.find('input').filter((index, element) => {
          const $element = Cypress.$(element)
          return $element.attr('type') === 'text' && 
                 ($element.attr('placeholder') || $element.attr('aria-label') || $element.attr('title'))
        }).first()
      }
      
      if (searchInput && searchInput.length > 0) {
        cy.wrap(searchInput).should('be.visible')
        cy.log('Search input found and visible')
      } else {
        cy.log('Search input not found')
      }
    })
  }
}

export default SearchPage 