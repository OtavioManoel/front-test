import {Publicacao} from './publicacao.model';

export class Livro extends Publicacao {
    readonly isbn: string;

    private static readonly ISBN10_REGEX = /^(\d{9}[\dX])$/;
    private static readonly ISBN13_REGEX = /^(\d{13})$/;

    constructor(titulo: string, autor: string, anoPublicacao: number, isbn: string) {
        super(titulo, autor, anoPublicacao);

        if (!this.validaIsbn(isbn)) {
            throw new Error('O ISBN fornecido não é válido.');
          }

        this.isbn = isbn;
    }

    private validaIsbn(isbn: string): boolean {
        const isbnLimpo = isbn.replace(/[^0-9]/g, '');

        return Livro.ISBN10_REGEX.test(isbnLimpo) || Livro.ISBN13_REGEX.test(isbnLimpo);
    }
    
    descricao(): string {
        return `${super.descricao()} e possui o ISBN ${this.isbn}`;
    }
}