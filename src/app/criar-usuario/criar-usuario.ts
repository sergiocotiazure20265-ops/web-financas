import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-criar-usuario',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './criar-usuario.html',
  styleUrl: './criar-usuario.css',
})
export class CriarUsuario {

  //Injeção de dependência da classe HttpClient
  private http = inject(HttpClient);

  //Atributos (signal)
  mensagemSucesso = signal<string>('');
  mensagemErro = signal<string>('');

  //Criando a estrutura do formulário
  formCriarUsuario = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)]),
    senhaConfirmacao: new FormControl('', [Validators.required]),
    aceiteTermos: new FormControl(false, [Validators.requiredTrue])
  }, {
    validators: this.validarSenhasIguais
  });

  //Função para validação customizada do campo 'senhaConfirmacao'
  validarSenhasIguais(control: AbstractControl) : ValidationErrors | null {

    //capturar o valor preenchido nos campos 'senha' e 'senhaConfirmacao'
    const valorSenha = control.get('senha')?.value;
    const valorSenhaConfirmacao = control.get('senhaConfirmacao')?.value;

    //verificar se o usuário informou a senha e os valores estão diferentes
    if(valorSenha && (valorSenhaConfirmacao !== valorSenha)) {
      //Retornar um erro de validação
      return { senhasDiferentes: true };
    }

    return null; //Não há erros de validação
  }


  //Função para capturar o evento de submit do formulário
  criarUsuario() {

    //Definir as mensagens
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    //Criando um JSON somente com os campos requeridos pela API
    const json = {
      nome: this.formCriarUsuario.value.nome,
      email: this.formCriarUsuario.value.email,
      senha: this.formCriarUsuario.value.senha
    };

    //Enviando a requisição para o backend
    this.http.post('http://localhost:8082/api/v1/usuario/criar', json)
      .subscribe({ //Aguardando o retorno da API
        next: (response: any) => { //Capturando se o retorno for sucesso da API
          this.mensagemSucesso.set(`Parabéns ${response.nomeUsuario}, sua conta foi criada com sucesso!`);
          this.formCriarUsuario.reset(); //limpar o formulário
        },
        error: (e) => { //Capturando se o retorno for erro da API
          this.mensagemErro.set(e.error);
        }
      });
  }

}
