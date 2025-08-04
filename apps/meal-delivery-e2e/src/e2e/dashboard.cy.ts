import { getGreeting } from '../support/app.po';

describe('meal-delivery', () => {
  beforeEach(() => cy.visit(''));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Welkom bij Gouden maaltijden');
  });

  it('should display big buttons', () => {
    cy.get('h5').contains('Inloggen');

    cy.get('h5').contains('Over ons');
  });

  it('should display a navbar', () => {
    cy.get('.nav-link').contains('Home');

    cy.get('.nav-link').contains('Over ons');

    cy.get('.nav-link').contains('Registreer');

    cy.get('.nav-link').contains('Login');
  });
});
