import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormularioComponent } from './formulario.component';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormularioComponent', () => {
  let component: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;
  let httpMock: HttpTestingController;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<FormularioComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [FormularioComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule // Desativa animações para testes
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should initialize the form with provided data', () => {
    const pessoaFormData = {
      nome: 'John Doe',
      email: 'john@example.com',
      senha: 'password123',
      cep: '12345678',
      logradouro: 'Rua Teste'
    };

    component.data = pessoaFormData;
    component.ngOnInit();
    expect(component.form.value).toEqual(pessoaFormData);
  });

  it('should mark the form as invalid if required fields are empty', () => {
    component.form.get('nome')?.setValue('');
    component.form.get('email')?.setValue('');
    component.form.get('senha')?.setValue('');

    expect(component.form.invalid).toBeTrue();
  });

  it('should mark the email as invalid if not in correct format', () => {
    component.form.get('email')?.setValue('invalid-email');

    expect(component.form.get('email')?.invalid).toBeTrue();
  });

  it('should mark the form as valid when all fields are correctly filled', () => {
    component.form.get('nome')?.setValue('John Doe');
    component.form.get('email')?.setValue('john@example.com');
    component.form.get('senha')?.setValue('password123');
    component.form.get('cep')?.setValue('12345678');
    component.form.get('logradouro')?.setValue('Rua Teste');

    expect(component.form.valid).toBeTrue();
  });

  it('should call buscarCep and set logradouro when a valid CEP is provided', () => {
    const cepResponse = { logradouro: 'Rua Teste' };
    const cep = '12345678';

    spyOn(component, 'buscarCep').and.returnValue(of(cepResponse));

    component.form.get('cep')?.setValue(cep);
    component.onCepInput();

    expect(component.buscarCep).toHaveBeenCalledWith(cep);
    expect(component.form.get('logradouro')?.value).toBe('Rua Teste');
  });

  it('should log error when buscarCep fails', () => {
    const cep = '12345678';
    const consoleSpy = spyOn(console, 'error');

    // Simula um erro no buscarCep
    spyOn(component, 'buscarCep').and.returnValue(throwError(() => new Error('Erro ao buscar o CEP')));

    component.form.get('cep')?.setValue(cep);
    component.onCepInput();

    expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar o CEP', jasmine.anything());
  });

  it('should emit the form data and close the dialog on valid submit', () => {
    const pessoaFormData = {
      nome: 'John Doe',
      email: 'john@example.com',
      senha: 'password123',
      cep: '12345678',
      logradouro: 'Rua Teste'
    };

    component.form.patchValue(pessoaFormData);

    spyOn(component.formularioSubmetido, 'emit');
    component.onSubmit();

    expect(component.formularioSubmetido.emit).toHaveBeenCalledWith(pessoaFormData);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(pessoaFormData);
  });

  it('should show an alert when the form is invalid', () => {
    spyOn(window, 'alert');
    component.form.get('nome')?.setValue('');
    
    component.onSubmit();
    
    expect(window.alert).toHaveBeenCalledWith('Formulário inválido');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
