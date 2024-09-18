import {Publicacao} from './publicacao.model';

export class Periodico extends Publicacao {
    readonly issn: string;

    constructor(titulo: string, autor: string, anoPublicacao: number, issn: string) {
        super(titulo, autor, anoPublicacao);

        if (!this.validaIssn(issn)) {
            throw new Error('O ISSN fornecido não é válido.');
          }

        this.issn = issn;
    }

    private validaIssn(ISSN: string): boolean {
       
        const ISSN_REGEX = /^\d{4}-\d{4}|\d{8}$/;
        return ISSN_REGEX.test(ISSN.replace(/-/g, ''));
    }
    
    descricao(): string {
        return `${super.descricao()} e possui o ISSN ${this.issn}`;
    }
}