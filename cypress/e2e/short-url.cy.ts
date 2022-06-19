/// <reference types="cypress" />

describe('Short Url Tests', function () {
    this.beforeAll(() => {
      cy.login();
      cy.get('rb-tab-set').find('[id="short-urls"]', { includeShadowDom: true }).click();
      cy.url().should('include', 'short-urls');
    });
  
    this.beforeEach(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });
  
    const createShortUrl = (sourcePath: string, targetPath: string): void => {
      cy.get('[data-cy=create-shorturl]').click('top');

      cy.get('[data-cy=shorturl-form]').should('be.visible');
      
      cy.get('[data-cy=source-input]')
        .find('input[placeholder="Source Path"]', { includeShadowDom: true })
        .click()
        .type(sourcePath, { force: true });
      cy.get('[data-cy=target-input]')
        .find('input[placeholder="Target Path"]', { includeShadowDom: true })
        .click()
        .type(targetPath, { force: true });

      cy.get('[data-cy=submit]').should('be.visible').click('top');
    };
  
    const deleteShortUrl = (sourcePath: string): void => {
      cy.contains(sourcePath).parents('[data-cy=shorturl-display]').find('[data-cy=more]').click();
  
      cy.contains(sourcePath)
        .parents('[data-cy=shorturl-display]')
        .find('rb-dropdown')
        .find('#option-delete', { includeShadowDom: true })
        .first()
        .click();

      cy.get('rb-modal[open]').should('be.visible')
  
      cy.get('rb-modal[open]')
        .first()
        .find('[data-cy=modal-confirm]')
        .find('button', { includeShadowDom: true })
        .click({ force: true });
    };
  
    it('Delete short url', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
      deleteShortUrl('cypress_test_sourcePath');
    });
  
    it('Create short url', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
      cy.get('cms-list-view').should('contain', 'cypress_test_targetPath');
      deleteShortUrl('cypress_test_sourcePath');
    });
  
    it('New short url with same sourcePath cannot be created', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
  
      cy.get('[data-cy=create-shorturl]').click('top');

      cy.get('[data-cy=shorturl-form]').should('be.visible');
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      cy.get('[data-cy=source-input]').should('be.visible');
  
      cy.get('[data-cy=source-input]')
        .find('input[placeholder="Source Path"]', { includeShadowDom: true })
        .click()
        .type('cypress_test_sourcePath', { force: true });
      cy.get('[data-cy=target-input]')
        .find('input[placeholder="Target Path"]', { includeShadowDom: true })
        .click()
        .type('cypress_test_targetPath', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
  
      cy.get('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
      cy.get('[data-cy=cancel]').click('top');
  
      deleteShortUrl('cypress_test_sourcePath');
    });
  
    it('Edited text changes', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
  
      cy.contains('cypress_test_targetPath')
        .parents('[data-cy=shorturl-display]')
        .find('[data-cy=more]')
        .click('top')
        .get('rb-dropdown')
        .find('#option-edit', { includeShadowDom: true })
        .first()
        .click();
  
      cy.get('[data-cy=target-input]')
        .find('input', { includeShadowDom: true })
        .focus()
        .clear()
        .click()
        .type('cypress_test_targetPath_edit', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
  
      cy.get('[data-cy=submit]').should('be.visible')
      cy.get('[data-cy=submit]').click('top');
  
      cy.contains('cypress_test_targetPath_edit')
        .parents('[data-cy=shorturl-display]')
        .find('[data-cy=updatedBy]')
        .should('contain', Cypress.env('auth0_username'));
  
      deleteShortUrl('cypress_test_sourcePath');
    });
  
    it('Searching for sourcePath displays correct card', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
  
      cy.get('rb-search-filter-bar')
        .find('input', { includeShadowDom: true })
        .click({ force: true })
        .type('cypress_test_sourcePath', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
  
      cy.get('cms-list-view').should('contain', 'cypress_test_sourcePath');
  
      deleteShortUrl('cypress_test_sourcePath');
    });
  });