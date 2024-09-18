import { Component, OnInit } from '@angular/core';
import { Publicacao } from './models/publicacao.model';
import { Livro } from './models/livro.model';
import { Periodico } from './models/periodico.model';	

@Component({
  selector: 'app-a1.5-classe',
  templateUrl: './a1.5-classe.component.html',
  styleUrls: ['./a1.5-classe.component.scss']
})
export class A15ClasseComponent implements OnInit {
  publicacao!: Publicacao;
  livro!: Livro;
  periodico!: Periodico;

  constructor() { }

  ngOnInit(): void {
    try {
      this.publicacao = new Publicacao("Berserk", "Kentaro Miura", 1989);
      console.log('Descrição de publicação: ', this.publicacao.descricao());

      console.log('----------');

      this.livro = new Livro("Berserk", "Kentaro Miura", 1989, "978-4-7859-2533-3");
      console.log('Descrição de livro: ', this.livro.descricao());

      console.log('----------');
      this.periodico = new Periodico("Berserk", "Kentaro Miura", 1989, "1234-5678");
      console.log('Descrição de periodico: ', this.periodico.descricao());
      
    } catch (error) {
      if (error instanceof Error) { 
        console.error(error.message); 
      }
    }
  }
}
