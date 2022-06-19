// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(email?: string, password?: string): void;
    }
  }
  
  Cypress.Commands.add(
    'login',
    (username: string = Cypress.env('auth0_username'), password: string = Cypress.env('auth0_password')) => {
      cy.visit('https://cms-design.redbullcontentpool.com');
  
      // TODO find better way to wait for auth0 redirect
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(10000);
  
      // Reverted back Cookie version since auth0 site load is kind of suck loading with the other approach
      cy.get('body').then(($body) => {
        if ($body.find('input[name=email]').length) {
          cy.get('input[name=email]').click().type(username);
          cy.get('input[name=password]').click().type(`${password}{enter}`);
        } else {
          return;
        }
      });
  
      // cy.getCookies()
      //   .should('have.length.gte', 0)
      //   .then((cookies) => {
      //     // just to get into "then" to check cookies without failing
  
      //     // check if the "auth0.<clientId>.is.authenticated" cookie is set with a value of true
      //     const check = cookies.some((cookie) => {
      //       return cookie.name === `auth0.${Cypress.env('auth0_client_id')}.is.authenticated` && cookie.value === 'true';
      //     });
  
      //     if (!check) {
      //       cy.get('input[name=email]').click().type(username);
      //       cy.get('input[name=password]').click().type(`${password}{enter}`);
      //     }
  
      //     loggedIn = true;
      //   });
    },
  );