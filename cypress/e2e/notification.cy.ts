/// <reference types="cypress" />

describe('Notifications Tests', function () {
    this.beforeAll(() => {
      cy.login();
      cy.get('rb-tab-set').find('[id="notifications"]', { includeShadowDom: true }).click();
      cy.url().should('include', 'notifications');
    });
  
    this.beforeEach(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });
  
    const form = (): Cypress.Chainable<any> => cy.get('[data-cy=notification-form]');
  
    const createNotification = (
      title: string,
      text: string,
      startDay: number,
      endDay: number,
      visibleFor: 'All' | 'Red Bull accounts' | 'B2B accounts',
    ): void => {

      cy.get('body').then(($body) => {
        if (!$body.text().includes(title)) { 
          cy.get('[data-cy=create-notification]').click('top');
          cy.url().should('include', 'notifications/create');
      
          form().find('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
          form().find('[data-cy=title]').find('input', { includeShadowDom: true }).click().type(title, { force: true });
          form().find('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
      
          form().find('.ql-editor').click().type(text, { force: true });
          form().find('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
      
          form().find('[data-cy=date]').click().find('rb-text', { includeShadowDom: true }).contains(startDay).click();
          form().find('[data-cy=date]').click();
          form().find('[data-cy=submit]').find('rb-button').should('have.attr', 'disabled');
      
          form().find('[data-cy=visibleFor]').find('#select', { includeShadowDom: true }).click('top');
      
          form().find('[data-cy=visibleFor]').find(`#option-${visibleFor}`, { includeShadowDom: true }).click();
      
          form().find('[data-cy=submit]').click('top');
        } else {
          return;
        }
      });
    };
  
    const deleteNotification = (title: string): void => {
      cy.contains(title).parents('[data-cy=notification-card]').find('[data-cy=edit]').click('top');
  
      form().find('[data-cy=delete]').click('top');
    };
  
    it('Delete Notification', () => {
      createNotification('cypress_test_notification', 'this is just a test text', 1, 10, 'All');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      deleteNotification('cypress_test_notification');
  
      cy.url()
        .should('include', 'notifications')
        .then(() => {
          cy.get('cms-list-view').should('not.contain', 'cypress_test_notification');
        });
    });
  
    it('Should create notification', () => {
      createNotification('cypress_test_notification', 'this is just a test text', 1, 10, 'All');
  
      cy.url()
        .should('include', 'notifications')
        .then(() => {
          cy.get('cms-list-view').should('contain', 'cypress_test_notification');
        });
  
      deleteNotification('cypress_test_notification');
    });
  
    it('Editing title changes the title of a notification and is displayed in dashboard', () => {
      createNotification('cypress_test_notification', 'this is just a test text', 1, 10, 'All');
      cy.url().should('not.include', 'create');
      cy.contains('cypress_test_notification').parents('[data-cy=notification-card]').find('[data-cy=edit]').click('top');
  
      form()
        .find('[data-cy=title]')
        .find('input', { includeShadowDom: true })
        .focus()
        .clear()
        .click()
        .type('cypress_test_notification_edit', { force: true });
  
      form().find('[data-cy=submit]').click('top');
  
      cy.url()
        .should('include', 'notifications')
        .then(() => {
          cy.get('cms-list-view').should('contain', 'cypress_test_notification_edit');
        });
  
      deleteNotification('cypress_test_notification_edit');
    });
  });