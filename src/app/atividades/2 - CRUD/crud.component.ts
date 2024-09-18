import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioComponent } from './formulario/formulario.component';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog) { }
  
  filtro = new FormControl('')

  private unsubscribe$ = new Subject<void>();

  displayedColumns: string[] = ['actions', 'nome', 'email', 'senha', 'cep', 'logradouro'];
  dataSource: Pessoa[] = [
    { nome: 'Teste1', email: 'teste@email1.com', senha: '1234', cep: '80250104', logradouro: 'Rua teste' }
  ];

  filteredDataSource: Pessoa[] = [...this.dataSource];

  ngOnInit(): void {
    this.filtro.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(valor => {
      this.filtrar(valor);
    })
  }

  filtrar(valor: string) {
    const filtro = valor.toLowerCase();
    this.filteredDataSource = this.dataSource.filter(item =>
      item.nome.toLowerCase().includes(filtro)
    );
  }

  adicionar() {
    const dialogRef = this.dialog.open(FormularioComponent)

    dialogRef.componentInstance.formularioSubmetido.subscribe((dados: PessoaFormData) => {
      const novaPessoa = new Pessoa(
        dados.nome,
        dados.email,
        dados.senha,
        dados.cep,
        dados.logradouro
      )
      this.dataSource.push(novaPessoa)
      this.filteredDataSource = [...this.dataSource]
    });
  }

  editar(pessoa: Pessoa) {
    this.dialog.open(FormularioComponent)
  }

  remover(pessoa: Pessoa) {
    if (!confirm(`Deseja remover a pessoa ${pessoa.nome}?`)) return

    this.dataSource = this.dataSource.filter(p => p !== pessoa)
    this.filteredDataSource = [...this.dataSource]
    alert("removido com sucesso!")
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

interface PessoaFormData {
  nome: string;
  email: string;
  senha: string;
  cep: string;
  logradouro: string;
}
