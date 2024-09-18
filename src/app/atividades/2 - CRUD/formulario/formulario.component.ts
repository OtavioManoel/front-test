import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { cepValidator } from './cep-validator';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

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
    private dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PessoaFormData
  ) { 
    this.form = new FormGroup({
      nome: new FormControl(this.data?.nome || '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl(this.data?.email || '', [Validators.required, Validators.email]),
      senha: new FormControl(this.data?.senha || '', [Validators.required]),
      cep: new FormControl(this.data?.cep || '', [Validators.required, cepValidator()]),
      logradouro: new FormControl({ value: this.data?.logradouro || '', disabled: true }, [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
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
