import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { cepValidator } from './cep-validator';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {  
  form: FormGroup;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<FormularioComponent>
  ) { 
    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required]),
      cep: new FormControl('', [Validators.required, cepValidator()]),
      logradouro: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  buscarCep(cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get(url);
  }

  onCepInput() {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.buscarCep(cep).subscribe(
        (data: any) => {
          if (data && data.logradouro) {
            this.form.get('logradouro')?.setValue(data.logradouro);
          }
        },
        (error) => {
          console.error('Erro ao buscar o CEP', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Formulário inválido');
      return;
    }
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
