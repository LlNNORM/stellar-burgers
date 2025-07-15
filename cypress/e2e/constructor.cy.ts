describe('Burger constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:5173');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('should add ingredients to constructor on click', () => {
    // Добавляем булку (bun)
    cy.get('[data-category="bun"]').contains('button', 'Добавить').click();
    cy.get('[data-test="constructor-item-bun"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    // Добавляем начинку (main)
    cy.get('[data-category="main"]')
      .contains('button', 'Добавить')
      .click({ force: true });
    cy.get('[data-test="constructor-item"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
    // Добавляем соус (sauce)
    cy.get('[data-category="sauce"]')
      .contains('button', 'Добавить')
      .click({ force: true });
    cy.get('[data-test="constructor-item"]').should(
      'contain',
      'Соус с шипами Антарианского плоскоходца'
    );
  });

  it('should open ingredient (bun) modal and close by button', () => {
    cy.get('[data-category="bun"]').find('[data-test="ingredient"]').click();
    cy.get('[data-test="modal"]').should('be.visible');
    cy.get('[data-test="modal"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Закрытие по нажатию на кнопку
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="ingredient-modal"]').should('not.exist');
  });

  it('should open ingredient (main) modal and close by overlay', () => {
    cy.get('[data-category="main"]').find('[data-test="ingredient"]').click();
    cy.get('[data-test="modal"]').should('be.visible');
    cy.get('[data-test="modal"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
    // Закрытие по нажатию на overlay
    cy.get('[data-test="modal-overlay"]').click({ force: true });
    cy.get('[data-test="ingredient-modal"]').should('not.exist');
  });

  it('should create order, check order modal and clear constructor', () => {
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'Bearer mock-access');
    window.localStorage.setItem('refreshToken', 'mock-refresh');

    cy.visit('/');
    cy.wait('@getUser');

    // Добавляем ингредиенты
    cy.get('[data-category="bun"]').contains('button', 'Добавить').click();
    cy.get('[data-category="main"]')
      .contains('button', 'Добавить')
      .click({ force: true });
    cy.get('[data-test="constructor-item"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Оформляем заказ
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    // Проверка модалки с номером заказа
    cy.get('[data-test="modal"]').should('be.visible');
    cy.get('[data-test="modal"]').should('contain', '12345');

    // Закрытие модалки
    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');

    // Проверка очистки конструктора
    cy.get('[data-test="constructor-item-bun"]').should('not.exist');
    cy.get('[data-test="constructor-item"]').should('not.exist');
  });
});
