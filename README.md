# Formulario virtual para upload de arquivos
Isso é uma classe que criei para uso próprio em meu Framework.
Agiliza muito a vida quando preciso fazer um upload de maneira rápida

Aproveitem!
```javascript

// inicia o formulario
  const formDocumentos	= new FormUpload();

// Criamos um inputFile
  const inputDocs = formDocumentos.setInput('documentos')

// Multiplos arquivos
  inputDocs.multiple(true)

// Tipo de arquivos aceitos
  inputDocs.accept('image/jpeg, image/png, image/svg+xml, application/pdf');

// Listner de onChange
  inputDocs.on('change', async function () {
    
      // retorna a lista dos arquivos
        var getFiles = await inputDocs.getFiles();
        console.log(getFiles)
    		
      // Apenas retorna uma thumb em base64
      // params:  (index, largura, altura)
      // index é referente a lista de arquivos
        var getThumb = await inputDocs.getThumb(0, 150, 150);
        console.log(getThumb64)
    
      // Aqui nós APLICAMOS a thumb no input original do formulario.
      // Também retorna a thumb em base64
        var setThumb64 = await inputDocs.setThumb(0, 150, 150);
        console.log(setThumb64)

      //envia dados
      // formDocumentos.submit();

      //limpa campos
      // formDocumentos.clearInputs();
  });

//Retorna o input
  var input		= formDocumentos.getInput('documentos');
  console.log(input.element)
  console.log(input)

// retorna um array com todos os arquivos
  var AllFiles	= formDocumentos.getAllFiles();
  var domForm		= formDocumentos.getForm();

// Mostramos o action 
  formDocumentos.setAction('/api/cursos/upload');

//SETAMOS O ENCTYPE DO FORMULARIO:
//multipart/form-data (default)  |  application/x-www-form-urlencoded  |  text/plain

  formDocumentos.setEnctype('multipart/form-data');

//clica no campo de arquivo
  inputDocs.click()

```

# Exemplo com AJAXForm

```javascript

  const formDocumentos	= new FormUpload();
  const inputDocs = formDocumentos.setInput('documentos')
  inputDocs.multiple(false)
  inputDocs.accept('image/jpeg, image/png, image/svg+xml, application/pdf');
/*
|------------------------------------------------------------
|  ASSIM QUE SELECIONAR UM ARQUIVO,
|  REDIMENCIONA A THUMB E PUXA A FUNÇÃO  
|------------------------------------------------------------
*/
  inputDocs.on('change', async function () {
        await inputDocs.setThumb(0, 150, 150);
        iniciaUpload();
  });

/*
|------------------------------------------------------------
|   FUNÇÃO DO AJAXFORM
|------------------------------------------------------------
*/
  function iniciaUpload (){
       $(formDocumentos.getForm()).ajaxForm({
            beforeSend: function() {
                $("#uploadStatus").html('Enviando arquivo...');
            },
            uploadProgress: function(event, position, total, percentComplete) {
                $("#uploadStatus").html('Enviando arquivo... ' + percentComplete + '%');
            },
            success: function(data) {
                $("#uploadStatus").html('Arquivo enviado com sucesso.');
            },
            error: function(data) {
                $("#uploadStatus").html('Ocorreu um erro ao enviar o arquivo.');
            }
        });
    }


/*
|------------------------------------------------------------
|   CLICAMOS NO INPUT PARA SELEÇÃO DO ARQUIVO
|------------------------------------------------------------
*/
  inputDocs.click();

```
