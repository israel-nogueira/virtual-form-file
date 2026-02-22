# 📁 VirtualForm — Virtual File Upload Form

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2-blue.svg)]()
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
  - [Preview com createThumb](#3-preview-com-createthumb)
  - [Reduzir peso com replaceThumb](#4-reduzir-peso-com-replacethumb)
  - [Câmera mobile](#5-captura-via-câmera-mobile)
  - [Múltiplos inputs no mesmo form](#6-múltiplos-inputs-no-mesmo-formulário)
  - [Envio via fetch (AJAX)](#7-envio-via-fetch-ajax)
- [Referência Rápida](#-referência-rápida)
- [Licença](#-licença)

---

## 📖 Sobre

**VirtualForm** permite criar formulários de upload de arquivos de forma totalmente programática, sem nenhum elemento `<form>` no HTML. Ideal para SPAs, interfaces dinâmicas ou qualquer situação onde você precisa de controle total sobre seleção, preview e envio de arquivos.

**Funcionalidades:**
- ✅ Criação de inputs de arquivo por JavaScript
- ✅ Suporte a múltiplos arquivos
- ✅ `createThumb` — gera thumbnail em qualquer tamanho sem alterar o form
- ✅ `replaceThumb` — substitui o arquivo no form pelo redimensionado
- ✅ Modo proporcional (altura automática quando `h = 0`)
- ✅ Crop centralizado automático para tamanhos fixos
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
    <title>VirtualForm</title>
</head>
<body>

    <button id="btn-upload">Selecionar Imagem</button>
    <img id="preview-grande"  style="max-width:300px; display:none;" />
    <img id="preview-pequeno" style="max-width:100px; display:none;" />

    <script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file/virtual-form-file.js"></script>
    <script>
        const form  = new FormUpload();
        const input = form.setInput('foto');

        input.accept('image/jpeg, image/png, image/webp');

        input.on('change', async function () {

            // Preview grande (300x300 com crop central)
            const thumb300 = await input.createThumb(0, 300, 300);
            document.getElementById('preview-grande').src = thumb300;
            document.getElementById('preview-grande').style.display = 'block';

            // Preview pequeno (100x100 com crop central)
            const thumb100 = await input.createThumb(0, 100, 100);
            document.getElementById('preview-pequeno').src = thumb100;
            document.getElementById('preview-pequeno').style.display = 'block';

            // Substitui o arquivo no form por uma versão menor antes de enviar
            await input.replaceThumb(0, 1200, 0); // 1200px de largura, altura proporcional
        });

        document.getElementById('btn-upload').addEventListener('click', () => input.click());
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
| `getAllFiles()` | `Object` | Retorna todos os arquivos de todos os inputs |
| `getForm()` | `HTMLFormElement` | Retorna o elemento `<form>` virtual |
| `setAction(url)` | `this` | Define o `action` do formulário |
| `setEnctype(type)` | `this` | Define o `enctype` do formulário |
| `on(event, handler)` | `this` | Adiciona listener de evento no form |
| `submit()` | `void` | Envia o formulário (adiciona ao DOM se necessário) |
| `clearInputs()` | `this` | Limpa o valor de todos os inputs |
| `reset()` | `this` | Remove todos os inputs e reinicia o estado |

---

## 🎛 API do Input

Retornado por `form.setInput(name)` ou `form.getInput(name)`.

### Configuração

| Método | Parâmetro | Retorno | Descrição |
|---|---|---|---|
| `multiple(bool)` | `true \| false` | `inputObject` | Permite múltiplos arquivos |
| `accept(types)` | string MIME | `inputObject` | Define os tipos de arquivo aceitos |
| `capture(type)` | `'user' \| 'environment' \| ''` | `inputObject` | Ativa câmera mobile |
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
| `getBase64(file)` | `Promise<string>` | Converte um `File` para base64 (jpeg, png, gif, webp) |

### Thumbnails

| Método | Parâmetros | Retorno | Descrição |
|---|---|---|---|
| `createThumb(index, w, h)` | índice, largura, altura | `Promise<string>` | Gera thumbnail em base64. **Não altera o form.** Se `h = 0`, altura proporcional. |
| `replaceThumb(index, w, h)` | índice, largura, altura | `Promise<FileList>` | Substitui o arquivo no input pelo redimensionado. Se `h = 0`, altura proporcional. |
| `base64ToBlob(base64, file)` | base64, File original | `Promise<File>` | Converte base64 de volta para objeto `File` |

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
    form.submit();
});

input.click();
```

---

### 2. Múltiplos arquivos

```javascript
const form  = new FormUpload();
const input = form.setInput('fotos');

input
    .multiple(true)
    .accept('image/jpeg, image/png, image/webp');

input.on('change', function () {
    Array.from(input.getFiles()).forEach((file, i) => {
        console.log(`Arquivo ${i}: ${file.name} (${file.size} bytes)`);
    });
});

input.click();
```

---

### 3. Preview com `createThumb`

Use `createThumb` para gerar thumbnails em **qualquer tamanho** sem alterar o arquivo que será enviado. Você pode gerar quantas quiser ao mesmo tempo.

```javascript
const form  = new FormUpload();
const input = form.setInput('imagem');

input.accept('image/jpeg, image/png, image/webp');

input.on('change', async function () {

    // Tamanho fixo com crop central
    const thumb300 = await input.createThumb(0, 300, 300);
    const thumb100 = await input.createThumb(0, 100, 100);

    // Largura fixa com altura proporcional (sem crop)
    const preview  = await input.createThumb(0, 1000, 0);

    document.getElementById('thumb-300').src = thumb300;
    document.getElementById('thumb-100').src = thumb100;
    document.getElementById('preview').src   = preview;
});

input.click();
```

```html
<img id="thumb-300" style="max-width:300px" />
<img id="thumb-100" style="max-width:100px" />
<img id="preview"   style="max-width:100%" />
<button onclick="input.click()">Escolher imagem</button>
```

---

### 4. Reduzir peso com `replaceThumb`

Use `replaceThumb` para substituir o arquivo no formulário por uma versão redimensionada antes de enviar, reduzindo o tamanho do upload.

```javascript
const form  = new FormUpload();
const input = form.setInput('foto');

form.setAction('/api/fotos');
input.accept('image/jpeg, image/png, image/webp');

input.on('change', async function () {

    // Exibe preview sem alterar o arquivo
    const preview = await input.createThumb(0, 400, 0);
    document.getElementById('preview').src = preview;

    // Substitui o arquivo no form: máximo 1200px de largura, altura proporcional
    await input.replaceThumb(0, 1200, 0);

    // Ou com crop fixo 800x800
    // await input.replaceThumb(0, 800, 800);

    form.submit();
});

input.click();
```

---

### 5. Captura via câmera mobile

```javascript
const form  = new FormUpload();
const input = form.setInput('selfie');

input
    .accept('image/*')
    .capture('user'); // 'user' = frontal | 'environment' = traseira

input.on('change', async function () {
    const thumb = await input.createThumb(0, 200, 200);
    document.getElementById('preview').src = thumb;
});

document.getElementById('btn-camera').addEventListener('click', () => {
    input.click(); // abre a câmera diretamente em mobile
});
```

---

### 6. Múltiplos inputs no mesmo formulário

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
    const thumb = await inputFoto.createThumb(0, 100, 100);
    document.getElementById('preview-avatar').src = thumb;
    await inputFoto.replaceThumb(0, 800, 800); // reduz antes de enviar
});

inputDoc.on('change', function () {
    console.log(`${inputDoc.getFiles().length} documento(s) selecionado(s)`);
});

document.getElementById('btn-enviar').addEventListener('click', () => {
    // Retorna todos os arquivos: { foto_perfil: [File], documentos: [File, ...] }
    console.log(form.getAllFiles());
    form.submit();
});
```

---

### 7. Envio via fetch (AJAX)

```javascript
const form  = new FormUpload();
const input = form.setInput('arquivo');

input.accept('image/jpeg, image/png, image/webp');

input.on('change', async function () {

    // Reduz o arquivo para no máximo 1200px antes de enviar
    await input.replaceThumb(0, 1200, 0);

    // Monta o FormData a partir do form virtual
    const formData = new FormData(form.getForm());

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('Sucesso:', result);
        form.clearInputs();
    } catch (error) {
        console.error('Erro no upload:', error);
    }
});

document.getElementById('btn-upload').addEventListener('click', () => input.click());
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
input.accept('image/jpeg, image/png, image/webp');
input.capture('environment'); // mobile: câmera traseira

// Abrir seletor
input.click();

// Evento de seleção
input.on('change', async () => {

    const files  = input.getFiles();        // FileList
    const base64 = await input.getBase64(files[0]); // string base64

    // createThumb → só retorna base64, não altera o form
    const thumb300 = await input.createThumb(0, 300, 300); // crop 300x300
    const thumb100 = await input.createThumb(0, 100, 100); // crop 100x100
    const maxSize  = await input.createThumb(0, 1000, 0);  // 1000px, proporcional

    // replaceThumb → substitui o arquivo no input
    await input.replaceThumb(0, 1200, 0);  // 1200px, proporcional
    await input.replaceThumb(0, 800, 800); // crop 800x800
});

// Envio e utilitários
form.submit();
form.clearInputs();     // limpa valores
form.reset();           // remove inputs e reinicia
form.getAllFiles();      // { campo: [File, ...] }
form.getForm();         // HTMLFormElement
form.getInput('campo'); // recupera inputObject pelo name
```

---

## 📄 Licença

MIT © [Israel Nogueira](https://github.com/israel-nogueira)
