/*
 * Nome do Projeto: VirtualForm
 * Descrição: Crie formulários virtuais para upload de arquivos
 * Autor: Israel Nogueira
 * Data de Criação: 23/05/2024
 * Última Modificação: 2025
 * Versão: 1.1
 * Licença: MIT
 * GitHub: https://github.com/israel-nogueira/virtual-form
 */

/*
	// -------------------------------------------------------
	// EXEMPLOS DE USO
	// -------------------------------------------------------

	// Inicia o formulário
	const formDocumentos = new FormUpload();

	// Define action e enctype (opcionais)
	formDocumentos.setAction('/api/upload');
	formDocumentos.setEnctype('multipart/form-data');

	// Cria um input com o name "documentos"
	const inputDocs = formDocumentos.setInput('documentos');

	// Aceita múltiplos arquivos
	inputDocs.multiple(true);

	// Define tipos aceitos
	inputDocs.accept('image/jpeg, image/png, image/svg+xml, application/pdf');

	// Ativa câmera mobile (capture: 'user' | 'environment' | '')
	inputDocs.capture('environment');

	// Ao selecionar arquivo(s)
	inputDocs.on('change', async function () {

		// Lista de arquivos selecionados
		var files = inputDocs.getFiles();
		console.log(files);

		// Retorna thumb em base64 sem alterar o arquivo
		// params: index, largura, altura
		var getThumb = await inputDocs.getThumb(0, 150, 150);
		console.log(getThumb);

		// Aplica a thumb no arquivo original do formulário e retorna base64
		var setThumb = await inputDocs.setThumb(0, 150, 150);
		console.log(setThumb);

		// Envia o formulário
		// formDocumentos.submit();

		// Limpa os campos
		// formDocumentos.clearInputs();

		// Remove todos os inputs e reseta o formulário
		// formDocumentos.reset();
	});

	// Clica no campo de arquivo (abre o seletor)
	inputDocs.click();

	// Retorna o input pelo name
	var input = formDocumentos.getInput('documentos');
	console.log(input.element);

	// Retorna todos os arquivos de todos os inputs
	var allFiles = formDocumentos.getAllFiles();

	// Retorna o elemento <form>
	var domForm = formDocumentos.getForm();
*/

class FormUpload {
	constructor() {
		this.form = document.createElement("form");
		this.form.setAttribute("enctype", "multipart/form-data");
		this.form.setAttribute("method", "POST");
		this.form.setAttribute("style", "display:none");
		this.inputs = [];
	}

	// -------------------------------------------------------
	// FORM API
	// -------------------------------------------------------

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
		if (!document.body.contains(this.form)) {
			document.body.appendChild(this.form);
		}
		this.form.submit();
	}

	getForm() {
		return this.form;
	}

	setAction(action) {
		this.form.setAttribute("action", action);
		return this;
	}

	setEnctype(enctype) {
		this.form.setAttribute("enctype", enctype);
		return this;
	}

	clearInputs() {
		this.inputs.forEach(input => {
			input.input.clear();
		});
		return this;
	}

	/**
	 * Remove todos os inputs do form e reseta o estado interno.
	 */
	reset() {
		this.inputs.forEach(input => {
			input.input.clear();
			if (this.form.contains(input.input.element)) {
				this.form.removeChild(input.input.element);
			}
		});
		this.inputs = [];
		this.form.reset();
		return this;
	}

	// -------------------------------------------------------
	// INPUT FACTORY
	// -------------------------------------------------------

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

			on: (event, handler) => {
				inputElement.addEventListener(event, handler);
				return inputObject;
			},

			off: (event, handler) => {
				inputElement.removeEventListener(event, handler);
				return inputObject;
			},

			multiple: (isMultiple) => {
				inputElement.setAttribute("multiple", isMultiple);
				return inputObject;
			},

			accept: (fileTypes) => {
				inputElement.accept = fileTypes;
				return inputObject;
			},

			/**
			 * Define o modo de captura para dispositivos móveis.
			 * @param {'user'|'environment'|''} captureType
			 *   'user'        → câmera frontal
			 *   'environment' → câmera traseira
			 *   ''            → remove o atributo
			 */
			capture: (captureType) => {
				if (captureType === '' || captureType == null) {
					inputElement.removeAttribute("capture");
				} else {
					inputElement.setAttribute("capture", captureType);
				}
				return inputObject;
			},

			getFiles: () => {
				return inputElement.files;
			},

			clear: () => {
				inputElement.value = "";
				return inputObject;
			},

			// -------------------------------------------------------
			// CONVERSÃO / THUMBNAIL
			// -------------------------------------------------------

			/**
			 * Converte um arquivo de imagem (jpeg, png, gif, webp) para base64.
			 */
			getBase64: (file) => {
				return new Promise((resolve, reject) => {
					if (/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
						const reader = new FileReader();
						reader.addEventListener("load", () => resolve(reader.result), false);
						reader.onerror = (error) => reject(error);
						reader.readAsDataURL(file);
					} else {
						reject(new Error("File type not supported for base64 conversion."));
					}
				});
			},

			/**
			 * Cria uma thumbnail recortada e redimensionada a partir de um arquivo de imagem.
			 * Saída em JPEG (mais leve).
			 * @param {File} file
			 * @param {number} thumbWidth
			 * @param {number} thumbHeight
			 * @returns {Promise<string>} base64 da thumbnail
			 */
			createThumbnail: (file, thumbWidth, thumbHeight) => {
				return new Promise(async (resolve, reject) => {
					try {
						const base64 = await inputObject.getBase64(file);
						const img = new Image();
						img.src = base64;
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

							const canvas = document.createElement("canvas");
							const ctx = canvas.getContext("2d");
							canvas.width = thumbWidth;
							canvas.height = thumbHeight;
							ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, thumbWidth, thumbHeight);

							resolve(canvas.toDataURL("image/jpeg"));
						};
						img.onerror = (error) => reject(error);
					} catch (error) {
						reject(error);
					}
				});
			},

			/**
			 * Converte uma string base64 em um objeto File (Blob).
			 * Mantém o nome original do arquivo.
			 */
			base64ToBlob: (base64, originalFile) => {
				return new Promise((resolve, reject) => {
					try {
						const byteString = atob(base64.split(",")[1]);
						const ab = new ArrayBuffer(byteString.length);
						const ia = new Uint8Array(ab);
						for (let i = 0; i < byteString.length; i++) {
							ia[i] = byteString.charCodeAt(i);
						}
						const blob = new Blob([ab], { type: "image/jpeg" });
						const blobFile = new File([blob], originalFile.name, { type: "image/jpeg" });
						resolve(blobFile);
					} catch (error) {
						reject(error);
					}
				});
			},

			// -------------------------------------------------------
			// THUMB HELPERS
			// -------------------------------------------------------

			/**
			 * Apenas retorna a thumbnail em base64 sem alterar o arquivo no input.
			 * @param {number} index  Índice do arquivo na lista
			 * @param {number} w      Largura da thumb
			 * @param {number} h      Altura da thumb
			 */
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

			/**
			 * Gera a thumbnail E substitui o arquivo original no input pela versão redimensionada.
			 * Retorna a thumbnail em base64.
			 * @param {number} index  Índice do arquivo na lista
			 * @param {number} w      Largura da thumb
			 * @param {number} h      Altura da thumb
			 */
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

			/**
			 * Substitui um arquivo específico no FileList do input pela versão thumbnail.
			 */
			applyThumb: (thumb, file) => {
				return new Promise(async (resolve, reject) => {
					try {
						const newFile = await inputObject.base64ToBlob(thumb, file);
						const dataTransfer = new DataTransfer();
						Array.from(inputElement.files).forEach(f => {
							dataTransfer.items.add(f === file ? newFile : f);
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
