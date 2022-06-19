/// <reference types="cypress" />

describe('Search Synonym Tests', function () {
    this.beforeAll(() => {
      cy.login();
      cy.get('rb-tab-set').find('[id="search-synonyms"]', { includeShadowDom: true }).click();
      cy.url().should('include', 'search-synonyms');
    });
  
    this.beforeEach(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });
  
    const createSearchSynonym = (keyword: string, target: string): void => {

      cy.get('body').then(($body) => {
        if (!$body.text().includes(keyword)) { 
          cy.get('[data-cy=create-searchsynonym]').click('top');
          cy.get('[data-cy=keyword-input]').find('input', { includeShadowDom: true }).click().type(keyword, { force: true });
          cy.get('[data-cy=target]').find('input', { includeShadowDom: true }).click().type(target, { force: true });
          cy.get('[data-cy=submit]').click('top');
        } else {
          return;
        }
      });
    };
  
    const deleteSearchSynonym = (keyword: string): void => {
      cy.contains(keyword).parents('[data-cy=searchsynonym-display]').find('[data-cy=delete]').click();
  
      cy.get('rb-modal[open]')
        .find('[data-cy=modal-delete]')
        .find('button', { includeShadowDom: true })
        .click({ force: true, multiple: true });
    };
  
    it('Delete Search Synonym', () => {
      createSearchSynonym('cypress_test_keyword', 'cypress_test_target');
      deleteSearchSynonym('cypress_test_keyword');
      cy.get('cms-list-view').should('not.contain', 'cypress_test_keyword');
    });
  
    it('Should create search synonym', { scrollBehavior: 'top' }, () => {
      createSearchSynonym('cypress_test_keyword', 'cypress_test_target');
      cy.get('cms-list-view').should('contain', 'cypress_test_target');
      deleteSearchSynonym('cypress_test_keyword');
    });
  
    it('Edited text changes for keywords', () => {
      createSearchSynonym('cypress_test_keyword', 'cypress_test_target');
  
      cy.get('cms-list-view').should('contain', 'cypress_test_keyword');
      cy.contains('cypress_test_keyword').parents('[data-cy=searchsynonym-display]').find('[data-cy=edit]').click();
  
      cy.get('[data-cy=keyword-input]')
        .first()
        .find('input', { includeShadowDom: true })
        .click()
        .type('_edited', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
  
      cy.get('[data-cy=submit]').click('top');
  
      cy.contains('cypress_test_keyword_edited')
        .parents('[data-cy=searchsynonym-display]')
        .should('contain', Cypress.env('auth0_username'));
  
      deleteSearchSynonym('cypress_test_keyword_edited');
    });
  });