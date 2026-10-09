import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

beforeEach(() => {
   cy.login('admin@biblioteca.com', 'admin123')
});

Given(`que eu estou na página de administrador de livros`, () => {
    // [Given] Sets up the initial state of the system.
    cy.visit('admin-books.html')
    cy.get('h1').should('contain', 'Gerenciar Livros')
});

When(`eu adiciono um novo livro com os dados obrigatórios`, () => {
    // [When] Describes the action or event that triggers the scenario.
    cy.adicionarLivro('Livro teste', 'Autor teste', 'Aventura', 2)
});

Then(`deve aparecer uma mensagem: {string}`, (mensagem) => {
    // [Then] Describes the expected outcome or result of the scenario.
    cy.get('#alert-container').should('contain', mensagem)
});

Given(`existe um livro listado no catálogo`, () => {
    // [Given] Sets up the initial state of the system.
    cy.adicionarLivro('Livro para manipular', 'Autor teste', 'Aventura', 2)
    cy.get('#search-input').type('Livro para manipular')
    cy.wait(2000)
});

When(`eu edito os detalhes do livro`, () => {
    // [When] Describes the action or event that triggers the scenario.
    cy.get(':nth-child(7) > .btn-outline-primary').click()
    cy.wait(1000)
    cy.get('#book-category').select('Aventura')
    cy.get('#save-book-btn').click()
});

Then(`deve aparecer uma mensagem de atualização: {string}`, (mensagem) => {
    // [Then] Describes the expected outcome or result of the scenario.
    cy.get('#alert-container').should('contain', mensagem)

});

When(`eu removo o livro do catálogo`, () => {
    // [When] Describes the action or event that triggers the scenario.
    cy.get(':nth-child(7) > .btn-outline-danger').click()
    cy.get('#confirm-delete-btn').click()
});

Then(`deve aparecer uma mensagem de exclusão: {string}`, (mensagem) => {
    // [Then] Describes the expected outcome or result of the scenario.
    cy.get('#alert-container').should('contain', mensagem)
});

When("eu adiciono novos livros com os seguintes dados:", (dataTable) => {
    const books = dataTable.hashes()
    books.forEach(book =>{
        cy.adicionarLivro(book.titulo, book.autor, book.categoria, book.exemplares)

    })
});

When('eu adiciono um livro com {string}, {string}, {string} e {string}',(titulo, autor, categoria, exemplares) =>{
    cy.adicionarLivro(titulo, autor, categoria, exemplares)
}); 

When('eu tento adicionar um livro sem título', () => {
    cy.get('.btn-success').click();
  
    cy.get('#book-title').should('be.visible').clear();

    cy.get('#book-author').type('Autor teste');
    cy.get('#book-category').select('Aventura');
    cy.get('#book-copies').clear().type('2');

    cy.get('#save-book-btn').click();
});

Then('o livro não deve ser cadastrado', () => {
    cy.get('#book-title').should('have.value', '');
    cy.get('#book-title').should('have.attr', 'required');
});