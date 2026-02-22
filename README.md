# 📁 VirtualForm — Virtual File Upload Form

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1-blue.svg)]()
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange.svg)](https://www.jsdelivr.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow.svg)]()

> Crie formulários de upload de arquivos virtuais (sem `<form>` no HTML) com suporte a thumbnails, captura mobile, múltiplos inputs e envio nativo.

---

## 📋 Índice

- [Sobre](#-sobre)
- [Instalação](#-instalação)
- [Início Rápido](#-início-rápido)
- [API do Formulário](#-api-do-formulário-formupload)
- [API do Input](#-api-do-input)
- [Exemplos Completos](#-exemplos-completos)
  - [Upload simples](#1-upload-simples)
  - [Múltiplos arquivos](#2-múltiplos-arquivos)
  - [Thumbnail antes do upload](#3-gerar-thumbnail-antes-do-upload)
  - [Câmera mobile](#4-captura-via-câmera-mobile)
  - [Múltiplos inputs no mesmo form](#5-múltiplos-inputs-no-mesmo-formulário)
  - [Envio via fetch (AJAX)](#6-envio-via-fetch-ajax)
- [Referência Rápida](#-referência-rápida)
- [Licença](#-licença)

---

## 📖 Sobre

**VirtualForm** permite criar formulários de upload de arquivos de forma totalmente programática, sem precisar de nenhum elemento `<form>` no seu HTML. É útil em SPAs, páginas dinâmicas ou qualquer situação em que você queira controle total sobre o processo de seleção e envio de arquivos.

**Funcionalidades:**
- ✅ Criação de inputs de arquivo por JavaScript
- ✅ Suporte a múltiplos arquivos
- ✅ Geração de thumbnails com crop centralizado
- ✅ Substituição do arquivo original pela thumbnail no form
- ✅ Conversão para Base64
- ✅ Captura via câmera em dispositivos móveis
- ✅ Múltiplos inputs no mesmo formulário virtual
- ✅ Envio nativo ou via `fetch`/AJAX

---

## 📦 Instalação

### Via CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file/virtual-form-file.js"></script>
```

### Download manual

Baixe o arquivo [`virtual-form-file.js`](./virtual-form-file.js) e inclua no seu projeto:

```html
<script src="./virtual-form-file.js"></script>
```

---

## ⚡ Início Rápido

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>VirtualForm - Exemplo</title>
</head>
<body>
    <button id="btn-upload">Selecionar Arquivo</button>
    <img id="preview" style="max-width:200px; display:none;" />

    <script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file/virtual-form-file.js"></script>
    <script>
        const form  = new FormUpload();
        const input = form.setInput('foto');

        input.accept('image/jpeg, image/png');

        input.on('change', async function () {
            // Gera e exibe thumbnail
            const thumb = await input.getThumb(0, 200, 200);
            document.getElementById('preview').src = thumb;
            document.getElementById('preview').style.display = 'block';
        });

        document.getElementById('btn-upload').addEventListener('click', () => {
            input.click();
        });
    </script>
</body>
</html>
```

---

## 🗂 API do Formulário (`FormUpload`)

Instancie o formulário virtual com `new FormUpload()`.

| Método | Retorno | Descrição |
|---|---|---|
| `setInput(name)` | `inputObject` | Cria e registra um novo input de arquivo |
| `getInput(name)` | `inputObject \| null` | Recupera um input já criado pelo name |
| `getAllFiles()` | `Object` | Retorna um objeto com todos os arquivos de todos os inputs |
| `getForm()` | `HTMLFormElement` | Retorna o elemento `<form>` virtual |
| `setAction(url)` | `this` | Define o `action` do formulário |
| `setEnctype(type)` | `this` | Define o `enctype` do formulário |
| `on(event, handler)` | `this` | Adiciona listener de evento no form |
| `submit()` | `void` | Envia o formulário (adiciona ao DOM se necessário) |
| `clearInputs()` | `this` | Limpa o valor de todos os inputs |
| `reset()` | `this` | Remove todos os inputs do form e reinicia o estado |

---

## 🎛 API do Input

Retornado por `form.setInput(name)` ou `form.getInput(name)`.

### Configuração

| Método | Parâmetro | Retorno | Descrição |
|---|---|---|---|
| `multiple(bool)` | `true \| false` | `inputObject` | Permite múltiplos arquivos |
| `accept(types)` | `string` (MIME types) | `inputObject` | Define os tipos de arquivo aceitos |
| `capture(type)` | `'user' \| 'environment' \| ''` | `inputObject` | Ativa câmera mobile (`user` = frontal, `environment` = traseira) |
| `click()` | — | `void` | Abre o seletor de arquivos |
| `clear()` | — | `inputObject` | Limpa o valor do input |

### Eventos

| Método | Descrição |
|---|---|
| `on(event, handler)` | Adiciona listener no input (ex: `'change'`) |
| `off(event, handler)` | Remove listener do input |

### Arquivos

| Método | Retorno | Descrição |
|---|---|---|
| `getFiles()` | `FileList` | Retorna a lista de arquivos selecionados |
| `getBase64(file)` | `Promise<string>` | Converte um `File` para base64 (suporta: jpeg, png, gif, webp) |

### Thumbnails

| Método | Parâmetro | Retorno | Descrição |
|---|---|---|---|
| `getThumb(index, w, h)` | index, largura, altura | `Promise<string>` | Retorna a thumbnail em base64 **sem** alterar o arquivo no form |
| `setThumb(index, w, h)` | index, largura, altura | `Promise<string>` | Gera a thumbnail **e substitui** o arquivo original no form |
| `createThumbnail(file, w, h)` | File, largura, altura | `Promise<string>` | Cria thumbnail com crop centralizado a partir de um File |
| `base64ToBlob(base64, file)` | base64, File original | `Promise<File>` | Converte base64 de volta para objeto `File` |
| `applyThumb(thumb, file)` | base64, File original | `Promise<FileList>` | Substitui o arquivo no FileList do input pela versão thumb |

### Propriedade

| Propriedade | Tipo | Descrição |
|---|---|---|
| `element` | `HTMLInputElement` | O elemento `<input type="file">` real |

---

## 💡 Exemplos Completos

### 1. Upload simples

```javascript
const form  = new FormUpload();
const input = form.setInput('documento');

form.setAction('/api/upload');

input.accept('application/pdf');

input.on('change', function () {
    const files = input.getFiles();
    console.log('Arquivo selecionado:', files[0].name);

    form.submit(); // envia o form
});

input.click(); // abre o seletor
```

---

### 2. Múltiplos arquivos

```javascript
const form   = new FormUpload();
const input  = form.setInput('fotos');

input
    .multiple(true)
    .accept('image/jpeg, image/png, image/webp');

input.on('change', function () {
    const files = input.getFiles();

    Array.from(files).forEach((file, index) => {
        console.log(`Arquivo ${index}:`, file.name, file.size);
    });
});

input.click();
```

---

### 3. Gerar thumbnail antes do upload

Use `getThumb` para apenas **visualizar** a miniatura, ou `setThumb` para **substituir** o arquivo original pela versão redimensionada antes de enviar.

```javascript
const form  = new FormUpload();
const input = form.setInput('imagem');

form.setAction('/api/fotos');

input.accept('image/jpeg, image/png, image/webp');

input.on('change', async function () {

    // Apenas visualiza (não altera o arquivo no form)
    const thumbBase64 = await input.getThumb(0, 300, 300);
    document.getElementById('preview').src = thumbBase64;

    // Substitui o arquivo original pela thumbnail (150x150) antes de enviar
    await input.setThumb(0, 150, 150);

    form.submit();
});

input.click();
```

```html
<!-- No seu HTML -->
<img id="preview" style="max-width:300px" />
<button onclick="input.click()">Escolher imagem</button>
```

---

### 4. Captura via câmera mobile

```javascript
const form  = new FormUpload();
const input = form.setInput('selfie');

input
    .accept('image/*')
    .capture('user'); // 'user' = frontal | 'environment' = traseira

input.on('change', async function () {
    const thumb = await input.getThumb(0, 200, 200);
    document.getElementById('preview').src = thumb;
});

// Em mobile, isso abre diretamente a câmera
document.getElementById('btn-camera').addEventListener('click', () => {
    input.click();
});
```

---

### 5. Múltiplos inputs no mesmo formulário

```javascript
const form = new FormUpload();

form.setAction('/api/cadastro');

// Input de foto de perfil
const inputFoto = form.setInput('foto_perfil');
inputFoto.accept('image/jpeg, image/png');

// Input de documentos PDF
const inputDoc = form.setInput('documentos');
inputDoc.multiple(true).accept('application/pdf');

inputFoto.on('change', async function () {
    const thumb = await inputFoto.getThumb(0, 100, 100);
    document.getElementById('preview-foto').src = thumb;
});

inputDoc.on('change', function () {
    const files = inputDoc.getFiles();
    console.log(`${files.length} documento(s) selecionado(s)`);
});

// Recupera todos os arquivos de todos os inputs
document.getElementById('btn-enviar').addEventListener('click', () => {
    const todos = form.getAllFiles();
    console.log(todos);
    // { foto_perfil: [File], documentos: [File, File, ...] }

    form.submit();
});
```

---

### 6. Envio via fetch (AJAX)

Caso prefira não usar o `form.submit()` nativo e queira enviar via `fetch`:

```javascript
const form  = new FormUpload();
const input = form.setInput('arquivo');

input.accept('image/jpeg, image/png');

input.on('change', async function () {

    // Opcional: redimensiona antes de enviar
    await input.setThumb(0, 800, 800);

    // Monta o FormData manualmente
    const formData = new FormData(form.getForm());

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const resultado = await response.json();
        console.log('Sucesso:', resultado);

        // Limpa após envio
        form.clearInputs();

    } catch (error) {
        console.error('Erro no upload:', error);
    }
});

document.getElementById('btn-upload').addEventListener('click', () => {
    input.click();
});
```

---

## 📌 Referência Rápida

```javascript
// Instância
const form = new FormUpload();

// Configuração do form
form.setAction('/api/upload');
form.setEnctype('multipart/form-data');

// Criação e configuração do input
const input = form.setInput('campo');
input.multiple(true);
input.accept('image/jpeg, image/png');
input.capture('environment'); // mobile: câmera traseira

// Abrir seletor
input.click();

// Eventos
input.on('change', async () => {
    const files     = input.getFiles();            // FileList
    const base64    = await input.getBase64(files[0]); // string base64
    const thumb     = await input.getThumb(0, 150, 150); // base64, sem alterar
    const thumbSet  = await input.setThumb(0, 150, 150); // base64 + substitui no form
});

// Envio
form.submit();

// Utilitários
form.clearInputs();       // limpa valores
form.reset();             // remove inputs e reinicia
form.getAllFiles();        // { campo: [File, ...] }
form.getForm();           // HTMLFormElement
form.getInput('campo');   // recupera inputObject pelo name
```

---

## 📄 Licença

MIT © [Israel Nogueira](https://github.com/israel-nogueira)
