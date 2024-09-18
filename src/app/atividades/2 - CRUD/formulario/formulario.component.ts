import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { cepValidator } from './cep-validator';
import { Observable } from 'rxjs';

interface PessoaFormData {
  nome: string;
  email: string;
  senha: string;
  cep: string;
  logradouro: string;
}

interface CepResponse {
  logradouro: string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
  @Output() formularioSubmetido = new EventEmitter<PessoaFormData>()
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

  buscarCep(cep: string): Observable<CepResponse> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<CepResponse>(url);
  }

  onCepInput() {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.buscarCep(cep).subscribe({
        next: (data: CepResponse) => {
          if (data && data.logradouro) {
            this.form.get('logradouro')?.setValue(data.logradouro);
          }
        },
        error: (error) => {
          console.error('Erro ao buscar o CEP', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Formulário inválido');
      return;
    }
    this.formularioSubmetido.emit(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
