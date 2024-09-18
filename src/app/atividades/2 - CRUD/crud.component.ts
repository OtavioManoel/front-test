import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { FormularioComponent } from './formulario/formulario.component';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {
  
  constructor(private dialog: MatDialog) { }
  
  filtro = new FormControl()

  displayedColumns: string[] = ['actions', 'nome', 'email', 'senha', 'cep', 'logradouro'];
  dataSource: Pessoa[] = [
    new Pessoa("Teste1", "teste@email1.com", "1234", "80250104", "Rua teste")
  ]

  ngOnInit(): void {
    this.filtro.valueChanges.subscribe(valor => {
      this.filtrar(valor)
    })
  }

  filtrar(arg: string) {
    console.log("filtrando...") //não remover essa linha
  }

  adicionar() {
    const dialogRef = this.dialog.open(FormularioComponent)

    dialogRef.componentInstance.formularioSubmetido.subscribe(dados => {
      const novaPessoa = new Pessoa(
        dados.nome,
        dados.email,
        dados.senha,
        dados.cep,
        dados.logradouro
      )
      this.dataSource.push(novaPessoa)
      this.dataSource = [...this.dataSource]
    });
  }

  editar(pessoa: Pessoa) {
    this.dialog.open(FormularioComponent)
  }

  remover(pessoa: Pessoa) {
    if (!confirm(`Deseja remover a pessoa ${pessoa.nome}?`)) return
    
    this.dataSource = this.dataSource.filter(p => p !== pessoa)
    alert("removido com sucesso!")
  }
}


class Pessoa {
  constructor(
    public nome: string,
    public email: string,
    public senha: string,
    public cep: string,
    public logradouro: string
  ) {}
}

