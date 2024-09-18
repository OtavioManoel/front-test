export class Publicacao {
    readonly titulo: string;
    readonly autor: string;
    readonly anoPublicacao: number;

    constructor(titulo: string, autor: string, anoPublicacao: number) {

        if (!titulo || titulo.trim() === '') {
            throw new Error('Título em branco');
        }

        if (!autor || autor.trim() === '') {
            throw new Error('Autor em branco');
        }

        const anoAtual = new Date().getFullYear();
        if ( anoPublicacao > anoAtual) {
            throw new Error('Ano de publicação inválido');
        }

        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
    }

    descricao(): string {
        return `O livro "${this.titulo}" foi escrito por ${this.autor} no ano ${this.anoPublicacao}`;
    }
}