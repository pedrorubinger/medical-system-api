# Medical System - API

> API do sistema de gerenciamento de clínicas médicas.

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações estarão voltadas para as seguintes tarefas:

- [x] Implementação do módulo de Autenticação;
- [x] Implementação do módulo de Usuários;
- [x] Implementação do módulo de Gerenciar Perfil;
- [x] Implementação do módulo de Convênios;
- [x] Implementação do módulo de Especialidades;
- [x] Implementação do módulo de Gerenciar Tenants;
- [ ] Implementação do módulo de Pacientes;
- [ ] Implementação do módulo de Endereços;
- [ ] Implementação do módulo de Recuperar Senha;
- [ ] Implementação do módulo de Solicitar uma Conta (?);
- [x] Implementação do módulo de Médicos;
- [x] Implementação do middleware de Permissões;
- [ ] Implementação do módulo de Relatórios;
- [ ] Implementação da Configuração de Agenda;
- [ ] Melhorar cobertura de testes;

## 💻 Requisitos

Estes são os requisitos para que este projeto execute corretamente em sua máquina:

- Você tem instalado em sua máquina `Node.js v16.13.2`. Utilize o comando `node --version` para checar a sua versão. Você também pode utilizar o `nvm` para alternar entre as versões do Node.js em sua máquina;
- Você tem instalado em sua máquina um gerenciador de pacotes para Node.js (yarn ou npm);

## ☕ Configurando a aplicação

Para configurar o MedicalSystem API, siga estas etapas:

1. Clone o repositório e acesse a pasta com os arquivos do projeto;
2. Execute o comando `yarn` ou `npm install`;
3. No diretório do projeto raíz do projeto, crie um arquivo `.env` e configure as variáveis de ambiente necessárias. Utilize como base o arquivo `.env.example`;

## 🚀 Executando a aplicação

Para executar a API, siga estas etapas:

1. Dentro da pasta do projeto, execute no terminal o script de start `yarn start` ou `npm start`;

## 🗃 ️Branches

O projeto possui duas branches principais:

1. **dev**: branch onde está o código em desenvolvimento;
2. **master**: branch principal onde está o código em produção;

Os commits devem acontecer em branches separadas (quando há mais de um colaborador) e então devem ser mergeados na branch **dev** para que só então sejam mergeados na branch **master**.

## 🧪 Testes

Este projeto utiliza a biblioteca <a href="https://docs.adonisjs.com/cookbooks/testing-adonisjs-apps">Japa</a>, indicada para testes pela documentação oficial do framework <a href="https://docs.adonisjs.com/guides/introduction">AdonisJS</a>. Até o momento o projeto conta com testes de **Controllers** e **Services**. Siga os passos abaixo para executá-los:

1. Entre na pasta do projeto e siga os passos de configuração da aplicação caso ainda não o tenha feito.
2. No terminal, execute o comando `yarn test` para executar os testes do projeto. Caso queira executar os testes e ainda ver a sua cobertura de código, execute o comando `yarn coverage`.
3. Caso queira executar os casos de testes de um único arquivo, execute o comando `yarn test` ou `yarn coverage` seguido do caminho do arquivo. Por exemplo: `yarn coverage tests/user/UserController.spec.ts`.

## 🤝 Colaboradores

Abaixo estão listados os colaboradores que atuam neste projeto:

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars3.githubusercontent.com/u/37129467" width="100px;" alt="Foto do Iuri Silva no GitHub"/><br>
        <sub>
          <b>Pedro Rubinger</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📝 Licença

Esse projeto ainda não está sob licença.

<br />
