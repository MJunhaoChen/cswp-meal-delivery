describe('meals', () => {
  beforeEach(() => {
    cy.visit('');

    cy.contains('Inloggen').click();

    cy.get('#username').type('owner');

    cy.get('#password').type('secret1');

    cy.contains('button', 'Inloggen').click();
  });
  // --------------------------------------------------------------------------
  it('should create meal', () => {
    cy.get('.meal-card').click();

    cy.get('.btn').contains('Nieuwe').click({ force: true });

    cy.get('#name').type('Cypress maaltijd', { force: true });

    cy.get('#price').type('1.99', { force: true });

    cy.get('#deliverytime').click({ force: true });

    cy.get('#deliverytime').type('22:22');

    cy.get('#deliverydate').click({ force: true });

    cy.get('#deliverydate').type('2023-04-07');

    cy.get('#studentHouse').select('Lovensdijkstraat 61', { force: true });

    cy.get('#save-meal-btn').click({ force: true });
  });

  // --------------------------------------------------------------------------
  it('should add product to list', () => {
    cy.get('.meal-card').click();

    cy.get(
      '.col-sm-12:nth-child(7) > .card > .card-body > .alignEnd > .edit > .material-icons'
    ).click({ force: true });

    cy.get(
      '.col-sm-12:nth-child(1) > .card > .card-body > .alignEnd > .add > .material-icons'
    ).click({ force: true });
  });
  // --------------------------------------------------------------------------
  it('should remove product from list', () => {
    cy.get('.meal-card').click();

    cy.get(
      '.col-sm-12:nth-child(7) > .card > .card-body > .alignEnd > .edit > .material-icons'
    ).click({ force: true });

    cy.get(
      '.col-sm-12:nth-child(1) > .card > .card-body > .alignEnd > .delete:nth-child(2) > .material-icons'
    ).click({ force: true });

    cy.get('app-nav > .toolbar > .nav > .dropdown > .nav-link').click();

    cy.get(
      '.col-sm-12:nth-child(7) > .card > .card-body > .no-bullets > li > a'
    ).click({ force: true });
  });

  // --------------------------------------------------------------------------
  it('it should be able to see meals and products and their details', () => {
    cy.get('.meal-card').click();

    cy.get('a[href="/meal/59274d6a-6a27-4581-8890-3a4fb30f0b43"]').click({
      force: true,
    });

    cy.get(
      ':nth-child(1) > .card > .card-body > .no-bullets > :nth-child(3) > a'
    ).click();
  });
  // --------------------------------------------------------------------------
  it('should be able to edit a meal', () => {
    cy.get('.meal-card').click();

    cy.get(
      ':nth-child(7) > .card > .card-body > .alignEnd > .edit > .material-icons'
    ).click({ force: true });

    cy.get('#name').clear({ force: true }).type('Cypress bewerkte maaltijd');

    cy.get('#price').clear({ force: true }).type('9.49');

    cy.get('#deliverytime').click({ force: true });

    cy.get('#deliverytime').type('12:00');

    cy.get('#deliverydate').click({ force: true });

    cy.get('#deliverydate').type('2023-04-07');

    cy.get('#studentHouse').select('Lovensdijkstraat 61', { force: true });

    cy.get('#save-meal-btn').click({ force: true });
  });
  // --------------------------------------------------------------------------
  it('should be able to delete a meal', () => {
    cy.get('.meal-card').click();
    cy.get(
      '.col-sm-12:nth-child(7) > .card > .card-body > .alignEnd > .delete > .material-icons'
    ).click();
    cy.get('.btn-danger').click();
  });
});
