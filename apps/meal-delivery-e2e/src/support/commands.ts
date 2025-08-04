// For examples of custom commands read more here:
// https://on.cypress.io/custom-commands

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});
