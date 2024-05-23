/*
* Nome do Projeto: VirtualForm
* Descrição: Crie formularios virtuais para upload de arquivos
 * Autor: Israel Nogueira
 * Data de Criação: 23/05/2024
 * Última Modificação: 23/05/2024
 * Versão: 1.0
 * Licença: MIT
 * GitHub: https://github.com/israel-nogueira/virtual-form
 */

/*
	// inicia o formulario
	const formDocumentos	= new FormUpload();

	// Criamos um inputFile com o name de "documentos"
	const inputDocs			= formDocumentos.setInput('documentos')

	// aceita ou não multiplos arquivos
	inputDocs.multiple(true)

	// setamos o tipo de arquivo aceito
	inputDocs.accept('image/jpeg, image/png, image/svg+xml, application/pdf');

	// quando selecionado algum arquivo
	inputDocs.on('change', async function () {

		// retorna a lista dos arquivos
		var getFiles = await inputDocs.getFiles();
		console.log(getFiles)
		
		// Apenas retorna uma thumb em base64.
		// params:  index, largura, altura
		// index é referente a lista de arquivos
		var getThumb = await inputDocs.getThumb(0, 150, 150);
		console.log(getThumb)

		// Por sua vezm aplica a thumb na imagem original do formulario.
		// Também retorna a thumb em base64
		var setThumb = await inputDocs.setThumb(0, 150, 150);
		console.log(setThumb)


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

	// SETAMOS O ENCTYPE DO FORMULARIO:
	//	multipart/form-data (default)
	//	application/x-www-form-urlencoded
	//	text/plain
	formDocumentos.setEnctype('multipart/form-data');

	//clica no campo de arquivo
	inputDocs.click()
 */

	
	class FormUpload {
		constructor() {
			this.form = document.createElement("form");
			this.form.setAttribute("enctype", "multipart/form-data");
			this.form.setAttribute('method', 'POST');
			this.form.setAttribute('style', 'display:none');
			this.inputs = [];
		}
		setInput(name) {
			return this.createInput(name);
		}

		getInput(name) {
			const input = this.inputs.find(item => item.name === name);
			return input ? input.input : null;
		}

		getAllFiles() {
			const allFiles = {};
			this.inputs.forEach(input => {
				allFiles[input.name] = Array.from(input.input.getFiles());
			});
			return allFiles;
		}

		on(event, handler) {
			this.form.addEventListener(event, handler);
			return this;
		}

		submit() {
			if (!document.body.contains(this.form)) {document.body.appendChild(this.form);}
			this.form.submit();
		}

		getForm() {
			return this.form;
		}

		clearInputs() {
			this.inputs.forEach(input => {
				input.input.clear();
			});
			return this;
		}

		setAction(action) {
			this.form.setAttribute('action', action);
			return this;
		}
		setEnctype(enctype) {
			this.form.setAttribute('enctype', enctype);
			return this;
		}

		createInput(name) {
			const inputElement = document.createElement("input");
			inputElement.setAttribute("type", "file");
			inputElement.setAttribute("name", name);
			this.form.appendChild(inputElement);

			const inputObject = {
				element: inputElement,
				click: () => {
					inputElement.click();
				},
				off: (event, handler) => {
					inputElement.removeEventListener(event, handler);
					return this;
				},
				on: (event, handler) => {
					inputElement.addEventListener(event, handler);
					return this;
				},
				multiple: (isMultiple) => {
					inputElement.setAttribute("multiple",isMultiple);
					return this;
				},
				accept: (fileTypes) => {
					inputElement.accept = fileTypes;
					return this;
				},
				getFiles: () => {
					return inputElement.files;
				},
				clear: () => {
					inputElement.value = "";
					return this;
				},
				getBase64: (file) => {
					return new Promise((resolve, reject) => {
						if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
							const reader = new FileReader();
							reader.addEventListener("load", () => {
								resolve(reader.result);
							}, false);
							reader.readAsDataURL(file);
						} else {
							reject(new Error("File type not supported"));
						}
					});
				},
				createThumbnail: (file, thumbWidth, thumbHeight) => {
					return new Promise(async (resolve, reject) => {
						try {
							const img = new Image();
							img.src = await inputObject.getBase64(file);
							img.onload = () => {
								const aspectRatio = img.width / img.height;
								const thumbAspectRatio = thumbWidth / thumbHeight;
								let cropWidth, cropHeight;

								if (aspectRatio > thumbAspectRatio) {
									cropHeight = img.height;
									cropWidth = img.height * thumbAspectRatio;
								} else {
									cropWidth = img.width;
									cropHeight = img.width / thumbAspectRatio;
								}

								const offsetX = (img.width - cropWidth) / 2;
								const offsetY = (img.height - cropHeight) / 2;
								const thumbCanvas = document.createElement('canvas');
								const thumbContext = thumbCanvas.getContext('2d');
								thumbCanvas.width = thumbWidth;
								thumbCanvas.height = thumbHeight;
								thumbContext.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, thumbWidth, thumbHeight);
								const thumbBase64 = thumbCanvas.toDataURL('image/jpeg');
								resolve(thumbBase64);
							};
							img.onerror = (error) => {
								reject(error);
							};
						} catch (error) {
							reject(error);
						}
					});
				},
				base64ToBlob: (base64, fileName) => {
					return new Promise((resolve, reject) => {
						try {
							const byteString = atob(base64.split(',')[1]);
							const ab = new ArrayBuffer(byteString.length);
							const ia = new Uint8Array(ab);

							for (let i = 0; i < byteString.length; i++) {
								ia[i] = byteString.charCodeAt(i);
							}

							const blob = new Blob([ab], { type: 'image/jpeg' });
							const blobFile = new File([blob], fileName.name, { type: 'image/jpeg' });
							resolve(blobFile);
						} catch (error) {
							reject(error);
						}
					});
				},
				setThumb: (index, w, h) => {
					return new Promise(async (resolve, reject) => {
						try {
							const thumb = await inputObject.createThumbnail(inputElement.files[index], w, h);
							await inputObject.applyThumb(thumb, inputElement.files[index]);
							resolve(thumb);
						} catch (error) {
							reject(error);
						}
					});
				},
				getThumb: (index, w, h) => {
					return new Promise(async (resolve, reject) => {
						try {
							const thumb = await inputObject.createThumbnail(inputElement.files[index], w, h);
							resolve(thumb);
						} catch (error) {
							reject(error);
						}
					});
				},
				applyThumb: (thumb, file) => {
					return new Promise(async (resolve, reject) => {
						try {
							const newFile = await inputObject.base64ToBlob(thumb, file);
							const dataTransfer = new DataTransfer();
							const files = Array.from(inputElement.files);

							files.forEach((f) => {
								if (f === file) {
									dataTransfer.items.add(newFile);
								} else {
									dataTransfer.items.add(f);
								}
							});

							inputElement.files = dataTransfer.files;
							resolve(inputElement.files);
						} catch (error) {
							reject(error);
						}
					});
				}
			};

			this.inputs.push({ name: name, input: inputObject });
			return inputObject;
		}

	}
