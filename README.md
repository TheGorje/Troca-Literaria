## Troca Literária

**Requisitos:**

* Node.js e NPM
* Xampp (Control Panel v3.3.0)

**Pasta do projeto React:**

* A aplicação completa está na pasta [`troca-literaria`](./ReactJS/)
**XAMPP:**

* [PHP Arquivos](./XAMPP/PHP): A aplicação deve estar localizada na pasta `XAMPP/htdocs/bookloop`.
* [MySQL Arquivos](./XAMPP/MySQL): A aplicação deve estar localizada na pasta `XAMPP/mysql/data/bookloop`.


**Abrir a Aplicação:**

1. Inicie o servidor local do Xampp.
2. Acesse `localhost/phpmyadmin/index.php` para verificar se o banco de dados `bookloop` foi criado corretamente.

**Dependências do projeto:**

```
"@testing-library/jest-dom": "^5.17.0",
"@testing-library/react": "^13.4.0",
"@testing-library/user-event": "^13.5.0",
"axios": "^1.6.8",
"flickity": "^2.3.0",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-flickity-component": "^4.0.7",
"react-router-dom": "^6.22.3",
"react-scripts": "5.0.1",
"react-textarea-autosize": "^8.5.3",
"web-vitals": "^2.1.4"
```
**Bibliotecas Externas Usadas**
```
"axios" --> Requisições
"flickity" --> Carrousel
"react-flickity-component" --> Componente Carrousel
"react-router-dom" --> Rotas Das Páginas 
"react-textarea-autosize" --> textarea responsivo no HTML 
```
**Observação:**
Não foi configurada nenhuma senha no `MySQL`.
