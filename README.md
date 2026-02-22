# 📁 VirtualForm — Virtual File Upload Form

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3-blue.svg)]()
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange.svg)](https://www.jsdelivr.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow.svg)]()

> Crie formulários de upload de arquivos virtuais (sem `<form>` no HTML) com suporte a thumbnails, qualidade por formato, transparência PNG/WebP, GIF animado e captura mobile.

---

## 📋 Índice

- [Sobre](#-sobre)
- [Instalação](#-instalação)
- [Início Rápido](#-início-rápido)
- [Comportamento por Formato](#-comportamento-por-formato)
- [API do Formulário](#-api-do-formulário-formupload)
- [API do Input](#-api-do-input)
- [Exemplos Completos](#-exemplos-completos)
  - [Upload simples](#1-upload-simples)
  - [Múltiplos arquivos](#2-múltiplos-arquivos)
  - [Preview com createThumb](#3-preview-com-createthumb)
  - [Reduzir peso com replaceThumb](#4-reduzir-peso-com-replacethumb)
  - [Transparência PNG](#5-transparência-png)
  - [GIF animado](#6-gif-animado)
  - [Câmera mobile](#7-captura-via-câmera-mobile)
  - [Múltiplos inputs](#8-múltiplos-inputs-no-mesmo-formulário)
  - [Envio via fetch](#9-envio-via-fetch-ajax)
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
- ✅ Parâmetro `quality` (0–100) normalizado por formato automaticamente
- ✅ Transparência preservada em PNG e WebP
- ✅ GIF animado mantido sem alterações
- ✅ GIF estático convertido para PNG (preserva transparência)
- ✅ Extensão do arquivo atualizada automaticamente no `replaceThumb`
- ✅ Modo proporcional (altura automática quando `h = 0`)
- ✅ Crop centralizado automático para tamanhos fixos
- ✅ Captura via câmera em dispositivos móveis
- ✅ Múltiplos inputs no mesmo formulário virtual
- ✅ Envio nativo ou via `fetch`/AJAX

---

## 📦 Instalação

### Via CDN (jsDelivr) — versão estável

```html
<script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file@v1.3/virtual-form-file.js"></script>
```

### Via CDN (jsDelivr) — sempre a última versão

```html
<script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file/virtual-form-file.js"></script>
```

### Download manual

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
    <button id="btn">Selecionar Imagem</button>
    <img id="preview" style="max-width:400px; display:none;" />

    <script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file@v1.3/virtual-form-file.js"></script>
    <script>
        const form  = new FormUpload();
        const input = form.setInput('foto');

        form.setAction('/api/upload');
        input.accept('image/jpeg, image/png, image/webp, image/gif');

        input.on('change', async function () {

            // Preview sem alterar o arquivo
            const preview = await input.createThumb(0, 800, 0, 90);
            document.getElementById('preview').src = preview;
            document.getElementById('preview').style.display = 'block';

            // Reduz o arquivo antes de enviar (mantém formato e transparência)
            await input.replaceThumb(0, 1200, 0, 85);

            form.submit();
        });

        document.getElementById('btn').addEventListener('click', () => input.click());
    </script>
</body>
</html>
```

---

## 🎨 Comportamento por Formato

| Formato | `quality` | Transparência | Redimensionamento |
|---|---|---|---|
| **JPEG** | ✅ `50% → 0.5` | ❌ fundo branco | ✅ crop ou proporcional |
| **PNG** | ⚠️ ignorado (sempre lossless) | ✅ preservada | ✅ crop ou proporcional |
| **WebP** | ✅ `50% → 0.5` | ✅ preservada | ✅ crop ou proporcional |
| **GIF estático** | ⚠️ ignorado | ✅ preservada (converte para PNG) | ✅ crop ou proporcional |
| **GIF animado** | ❌ não aplicável | ✅ mantido original | ❌ não redimensionado |

> **Nota:** O parâmetro `quality` usa escala de **0 a 100** em todos os casos.
> Internamente, JPEG e WebP convertem para `0.0–1.0`. PNG é lossless no canvas do browser e ignora o valor — um aviso é exibido no console caso seja informado.

---

## 🗂 API do Formulário (`FormUpload`)

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
| `getBase64(file)` | `Promise<string>` | Converte um `File` para base64 |

### Thumbnails

| Método | Parâmetros | Retorno | Descrição |
|---|---|---|---|
| `createThumb(index, w, h, quality?)` | índice, largura, altura, qualidade 0–100 | `Promise<string>` | Gera thumbnail em base64. **Não altera o form.** |
| `replaceThumb(index, w, h, quality?)` | índice, largura, altura, qualidade 0–100 | `Promise<FileList>` | Substitui o arquivo no input pelo redimensionado. |
| `base64ToBlob(base64, file, mime)` | base64, File original, mimeType | `Promise<File>` | Converte base64 para objeto `File` |

> `h = 0` em `createThumb` e `replaceThumb` → altura calculada proporcionalmente à largura (sem crop).
> `quality` é opcional. Default: `100`.

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

input.on('change', () => form.submit());
input.click();
```

---

### 2. Múltiplos arquivos

```javascript
const form  = new FormUpload();
const input = form.setInput('fotos');

input.multiple(true).accept('image/jpeg, image/png, image/webp');

input.on('change', function () {
    Array.from(input.getFiles()).forEach((file, i) => {
        console.log(`Arquivo ${i}: ${file.name} (${file.size} bytes)`);
    });
});

input.click();
```

---

### 3. Preview com `createThumb`

Gera thumbnails em diferentes tamanhos sem alterar o arquivo que será enviado.

```javascript
const form  = new FormUpload();
const input = form.setInput('imagem');

input.accept('image/jpeg, image/png, image/webp, image/gif');

input.on('change', async function () {

    // Tamanho fixo com crop central
    const thumb300 = await input.createThumb(0, 300, 300, 85);
    const thumb100 = await input.createThumb(0, 100, 100, 85);

    // Largura fixa, altura proporcional (sem crop)
    const preview  = await input.createThumb(0, 1000, 0, 90);

    document.getElementById('thumb-300').src = thumb300;
    document.getElementById('thumb-100').src = thumb100;
    document.getElementById('preview').src   = preview;
});

input.click();
```

---

### 4. Reduzir peso com `replaceThumb`

Substitui o arquivo no formulário por uma versão menor antes de enviar.

```javascript
const form  = new FormUpload();
const input = form.setInput('foto');

form.setAction('/api/fotos');
input.accept('image/jpeg, image/png, image/webp');

input.on('change', async function () {

    // Preview sem alterar o arquivo
    const preview = await input.createThumb(0, 400, 0, 90);
    document.getElementById('preview').src = preview;

    // Reduz para 1200px de largura, 85% qualidade, mantém formato e transparência
    await input.replaceThumb(0, 1200, 0, 85);

    form.submit();
});

input.click();
```

---

### 5. Transparência PNG

PNG com fundo transparente é preservado automaticamente em `createThumb` e `replaceThumb`.

```javascript
const form  = new FormUpload();
const input = form.setInput('logo');

input.accept('image/png');

input.on('change', async function () {

    // Transparência preservada — sem fundo branco
    const thumb = await input.createThumb(0, 200, 200);
    document.getElementById('preview').src = thumb;

    // Substitui mantendo transparência e extensão .png
    await input.replaceThumb(0, 800, 800);

    form.submit();
});

input.click();
```

> **Nota:** JPEG não suporta transparência. Ao processar um JPEG, o fundo é preenchido com branco automaticamente.

---

### 6. GIF animado

GIF animado é detectado automaticamente por leitura binária e mantido sem alterações.

```javascript
const form  = new FormUpload();
const input = form.setInput('gif');

input.accept('image/gif');

input.on('change', async function () {

    // GIF animado → retorna o base64 original sem redimensionar
    const preview = await input.createThumb(0, 300, 300);
    document.getElementById('preview').src = preview;

    // GIF animado → arquivo original mantido, nenhuma substituição ocorre
    await input.replaceThumb(0, 800, 0);
    // Console: [VirtualForm] "animacao.gif" é um GIF animado e foi mantido sem alterações.

    form.submit();
});

input.click();
```

---

### 7. Captura via câmera mobile

```javascript
const form  = new FormUpload();
const input = form.setInput('selfie');

input.accept('image/*').capture('user'); // 'user' = frontal | 'environment' = traseira

input.on('change', async function () {
    const thumb = await input.createThumb(0, 200, 200, 85);
    document.getElementById('avatar').src = thumb;
});

document.getElementById('btn-camera').addEventListener('click', () => input.click());
```

---

### 8. Múltiplos inputs no mesmo formulário

```javascript
const form = new FormUpload();
form.setAction('/api/cadastro');

const inputFoto = form.setInput('foto_perfil');
inputFoto.accept('image/jpeg, image/png, image/webp');

const inputDoc = form.setInput('documentos');
inputDoc.multiple(true).accept('application/pdf');

inputFoto.on('change', async function () {
    const thumb = await inputFoto.createThumb(0, 100, 100, 85);
    document.getElementById('avatar').src = thumb;
    await inputFoto.replaceThumb(0, 800, 800, 85);
});

inputDoc.on('change', function () {
    console.log(`${inputDoc.getFiles().length} documento(s) selecionado(s)`);
});

document.getElementById('btn-enviar').addEventListener('click', () => {
    console.log(form.getAllFiles()); // { foto_perfil: [File], documentos: [File, ...] }
    form.submit();
});
```

---

### 9. Envio via fetch (AJAX)

```javascript
const form  = new FormUpload();
const input = form.setInput('arquivo');

input.accept('image/jpeg, image/png, image/webp, image/gif');

input.on('change', async function () {

    await input.replaceThumb(0, 1200, 0, 85);

    const formData = new FormData(form.getForm());

    try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const result   = await response.json();
        console.log('Sucesso:', result);
        form.clearInputs();
    } catch (error) {
        console.error('Erro no upload:', error);
    }
});

document.getElementById('btn').addEventListener('click', () => input.click());
```

---

## 📌 Referência Rápida

```javascript
// Instalação
// <script src="https://cdn.jsdelivr.net/gh/israel-nogueira/virtual-form-file@v1.3/virtual-form-file.js"></script>

const form  = new FormUpload();
const input = form.setInput('campo');

// Configuração
form.setAction('/api/upload');
input.multiple(true).accept('image/jpeg, image/png, image/webp, image/gif');
input.capture('environment'); // mobile

// Abrir seletor
input.click();

// Evento
input.on('change', async () => {

    // createThumb(index, w, h, quality?) → base64, não altera o form
    const thumb300 = await input.createThumb(0, 300, 300, 85); // crop, 85%
    const thumb100 = await input.createThumb(0, 100, 100, 85); // crop, 85%
    const preview  = await input.createThumb(0, 1000, 0, 90);  // proporcional, 90%

    // replaceThumb(index, w, h, quality?) → substitui no form
    await input.replaceThumb(0, 1200, 0, 85);  // proporcional, 85%
    await input.replaceThumb(0, 800, 800, 85); // crop, 85%
});

// Utilitários
form.submit();
form.clearInputs();
form.reset();
form.getAllFiles(); // { campo: [File, ...] }
form.getForm();    // HTMLFormElement
```

---

## 📄 Licença

MIT © [Israel Nogueira](https://github.com/israel-nogueira)
