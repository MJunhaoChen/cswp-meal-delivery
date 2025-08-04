describe('product', () => {
  beforeEach(() => {
    cy.visit('');

    cy.contains('Inloggen').click();

    cy.get('#username').type('student');

    cy.get('#password').type('secret1');

    cy.contains('button', 'Inloggen').click();
  });
  // --------------------------------------------------------------------------
  it('should order a meal', () => {
    cy.get('.meal-card').click();

    cy.get(
      '.col-sm-12:nth-child(1) > .card > .card-body > .alignEnd > .order > .material-icons'
    ).click({ force: true });

    cy.get('meal-list > .row > .d-flex > div > .btn').click({ force: true });
  });
  // --------------------------------------------------------------------------
  it('should cancel an order', () => {
    cy.get('.meal-card').click();

    cy.get('meal-list > .row > .d-flex > div > .btn').click({ force: true });

    cy.get(
      ':nth-child(2) > .card > .card-body > .alignEnd > .delete > .material-icons'
    ).click({
      force: true,
    });

    cy.get(
      '.modal-content > fab-util-modal-leave-yes-no > .bg-main > .modal-footer > .btn-danger'
    ).click();
  });
});
