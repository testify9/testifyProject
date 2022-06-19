/// <reference types="cypress" />

describe('Short Url Tests', function () {
    this.beforeAll(() => {
      cy.login();
      cy.get('rb-tab-set').find('[id="short-urls"]', { includeShadowDom: true }).click();
      cy.url().should('include', 'short-urls');
    });
  
    this.beforeEach(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
    });
  
    const createShortUrl = (sourcePath: string, targetPath: string): void => {

      cy.get('[data-cy=create-shorturl]').should('be.visible');

      cy.get('[data-cy=create-shorturl]').click('top');

      cy.get('[data-cy=shorturl-form]').should('be.visible');
      cy.get('[data-cy=source-input]').should('be.visible');

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

      cy.get('rb-dropdown').should('be.visible');

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
  
    it('Create short url', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath', 'cypress_test_targetPath');
      cy.get('cms-list-view').should('contain', 'cypress_test_targetPath');
      deleteShortUrl('cypress_test_sourcePath');
    });
  
    it('New short url with same sourcePath cannot be created', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath_1', 'cypress_test_targetPath_1');
  
      cy.get('[data-cy=create-shorturl]').click('top');

      cy.get('[data-cy=shorturl-form]').should('be.visible');
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);

      cy.get('[data-cy=source-input]').should('be.visible');
  
      cy.get('[data-cy=source-input]')
        .find('input[placeholder="Source Path"]', { includeShadowDom: true })
        .click()
        .type('cypress_test_sourcePath_1', { force: true });
      cy.get('[data-cy=target-input]')
        .find('input[placeholder="Target Path"]', { includeShadowDom: true })
        .click()
        .type('cypress_test_targetPath_1', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
  
      cy.get('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
      cy.get('[data-cy=cancel]').click('top');
  
      deleteShortUrl('cypress_test_sourcePath_1');
    });
  
    it('Edited text changes', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath_2', 'cypress_test_targetPath_2');
  
      cy.contains('cypress_test_targetPath_2')
        .parents('[data-cy=shorturl-display]')
        .find('[data-cy=more]')
        .click('top');

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);

      cy.contains('cypress_test_targetPath_2')
        .parents('[data-cy=shorturl-display]')
        .get('rb-dropdown')
        .find('#option-edit', { includeShadowDom: true })
        .first()
        .click();
  
      cy.get('[data-cy=target-input]')
        .find('input', { includeShadowDom: true })
        .focus()
        .clear()
        .click()
        .type('cypress_test_targetPath_2_edit', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
  
      cy.get('[data-cy=submit]').should('be.visible')
      cy.get('[data-cy=submit]').click('top');
  
      cy.contains('cypress_test_targetPath_2_edit')
        .parents('[data-cy=shorturl-display]')
        .find('[data-cy=updatedBy]')
        .should('contain', Cypress.env('auth0_username'));
  
      deleteShortUrl('cypress_test_sourcePath_2');
    });
  
    it('Searching for sourcePath displays correct card', { scrollBehavior: 'top' }, () => {
      createShortUrl('cypress_test_sourcePath_3', 'cypress_test_targetPath_3');
  
      cy.get('rb-search-filter-bar')
        .find('input', { includeShadowDom: true })
        .click({ force: true })
        .type('cypress_test_sourcePath_3', { force: true });
  
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
  
      cy.get('cms-list-view').should('contain', 'cypress_test_sourcePath_3');
  
      deleteShortUrl('cypress_test_sourcePath_3');
    });
  });