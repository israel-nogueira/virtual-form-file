/*
 * Nome do Projeto: VirtualForm
 * Descrição: Crie formulários virtuais para upload de arquivos
 * Autor: Israel Nogueira
 * Data de Criação: 23/05/2024
 * Última Modificação: 2025
 * Versão: 1.2
 * Licença: MIT
 * GitHub: https://github.com/israel-nogueira/virtual-form-file
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

	// Define tipos de arquivo aceitos
	inputDocs.accept('image/jpeg, image/png, image/webp');

	// Ativa câmera mobile
	// 'user'        → câmera frontal
	// 'environment' → câmera traseira
	inputDocs.capture('environment');

	// Ao selecionar arquivo(s)
	inputDocs.on('change', async function () {

		// Lista de arquivos selecionados
		const files = inputDocs.getFiles();

		// -------------------------------------------------------
		// createThumb(index, w, h)
		//   Gera uma thumbnail e retorna em base64.
		//   Não altera o arquivo no formulário.
		//   Se h = 0, a altura é calculada proporcionalmente.
		// -------------------------------------------------------
		const thumb300 = await inputDocs.createThumb(0, 300, 300); // 300x300 crop central
		const thumb100 = await inputDocs.createThumb(0, 100, 100); // 100x100 crop central
		const maxSize  = await inputDocs.createThumb(0, 1000, 0);  // 1000px largura, altura proporcional

		// Exibe previews
		document.getElementById('preview-grande').src  = thumb300;
		document.getElementById('preview-pequeno').src = thumb100;

		// -------------------------------------------------------
		// replaceThumb(index, w, h)
		//   Redimensiona a imagem E substitui o arquivo no input.
		//   Ideal para reduzir peso antes de enviar ao servidor.
		//   Se h = 0, a altura é calculada proporcionalmente.
		// -------------------------------------------------------
		await inputDocs.replaceThumb(0, 1000, 0); // substitui pelo arquivo com 1000px de largura

		// Envia o formulário
		// formDocumentos.submit();

		// Limpa os campos
		// formDocumentos.clearInputs();

		// Remove todos os inputs e reseta o formulário
		// formDocumentos.reset();
	});

	// Abre o seletor de arquivos
	inputDocs.click();

	// Recupera um input já criado pelo name
	const input    = formDocumentos.getInput('documentos');

	// Retorna todos os arquivos de todos os inputs: { documentos: [File, ...] }
	const allFiles = formDocumentos.getAllFiles();

	// Retorna o elemento <form> virtual
	const domForm  = formDocumentos.getForm();
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

	/**
	 * Cria um novo input de arquivo e o registra no formulário.
	 * @param {string} name  Atributo name do input
	 * @returns {inputObject}
	 */
	setInput(name) {
		return this.createInput(name);
	}

	/**
	 * Recupera um input já criado pelo seu name.
	 * @param {string} name
	 * @returns {inputObject|null}
	 */
	getInput(name) {
		const input = this.inputs.find(item => item.name === name);
		return input ? input.input : null;
	}

	/**
	 * Retorna todos os arquivos de todos os inputs registrados.
	 * @returns {{ [name: string]: File[] }}
	 */
	getAllFiles() {
		const allFiles = {};
		this.inputs.forEach(input => {
			allFiles[input.name] = Array.from(input.input.getFiles());
		});
		return allFiles;
	}

	/**
	 * Adiciona um listener de evento no elemento <form>.
	 * @param {string} event
	 * @param {Function} handler
	 * @returns {this}
	 */
	on(event, handler) {
		this.form.addEventListener(event, handler);
		return this;
	}

	/**
	 * Envia o formulário. Se ainda não estiver no DOM, adiciona ao body antes.
	 */
	submit() {
		if (!document.body.contains(this.form)) {
			document.body.appendChild(this.form);
		}
		this.form.submit();
	}

	/**
	 * Retorna o elemento <form> virtual.
	 * @returns {HTMLFormElement}
	 */
	getForm() {
		return this.form;
	}

	/**
	 * Define o atributo action do formulário.
	 * @param {string} action  URL de destino do upload
	 * @returns {this}
	 */
	setAction(action) {
		this.form.setAttribute("action", action);
		return this;
	}

	/**
	 * Define o enctype do formulário.
	 * @param {'multipart/form-data'|'application/x-www-form-urlencoded'|'text/plain'} enctype
	 * @returns {this}
	 */
	setEnctype(enctype) {
		this.form.setAttribute("enctype", enctype);
		return this;
	}

	/**
	 * Limpa o valor de todos os inputs registrados.
	 * @returns {this}
	 */
	clearInputs() {
		this.inputs.forEach(input => input.input.clear());
		return this;
	}

	/**
	 * Remove todos os inputs do DOM e reinicia o estado interno do formulário.
	 * @returns {this}
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

			/** O elemento <input type="file"> real. */
			element: inputElement,

			/**
			 * Abre o seletor de arquivos do navegador.
			 */
			click: () => {
				inputElement.click();
			},

			/**
			 * Adiciona um listener de evento no input.
			 * @param {string} event     Ex: 'change'
			 * @param {Function} handler
			 * @returns {inputObject}
			 */
			on: (event, handler) => {
				inputElement.addEventListener(event, handler);
				return inputObject;
			},

			/**
			 * Remove um listener de evento do input.
			 * @param {string} event
			 * @param {Function} handler
			 * @returns {inputObject}
			 */
			off: (event, handler) => {
				inputElement.removeEventListener(event, handler);
				return inputObject;
			},

			/**
			 * Permite ou não a seleção de múltiplos arquivos.
			 * @param {boolean} isMultiple
			 * @returns {inputObject}
			 */
			multiple: (isMultiple) => {
				inputElement.setAttribute("multiple", isMultiple);
				return inputObject;
			},

			/**
			 * Define os tipos de arquivo aceitos (MIME types).
			 * @param {string} fileTypes  Ex: 'image/jpeg, image/png'
			 * @returns {inputObject}
			 */
			accept: (fileTypes) => {
				inputElement.accept = fileTypes;
				return inputObject;
			},

			/**
			 * Define o modo de captura para dispositivos móveis.
			 * @param {'user'|'environment'|''} captureType
			 *   'user'        → câmera frontal
			 *   'environment' → câmera traseira
			 *   '' ou null    → remove o atributo
			 * @returns {inputObject}
			 */
			capture: (captureType) => {
				if (!captureType) {
					inputElement.removeAttribute("capture");
				} else {
					inputElement.setAttribute("capture", captureType);
				}
				return inputObject;
			},

			/**
			 * Retorna o FileList com os arquivos selecionados.
			 * @returns {FileList}
			 */
			getFiles: () => {
				return inputElement.files;
			},

			/**
			 * Limpa o valor do input.
			 * @returns {inputObject}
			 */
			clear: () => {
				inputElement.value = "";
				return inputObject;
			},

			// -------------------------------------------------------
			// CONVERSÃO
			// -------------------------------------------------------

			/**
			 * Converte um File de imagem para string base64.
			 * Suporta: jpeg, jpg, png, gif, webp.
			 * @param {File} file
			 * @returns {Promise<string>}
			 */
			getBase64: (file) => {
				return new Promise((resolve, reject) => {
					if (!/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
						return reject(new Error(`Tipo de arquivo não suportado: "${file.name}". Use jpeg, png, gif ou webp.`));
					}
					const reader = new FileReader();
					reader.addEventListener("load", () => resolve(reader.result), false);
					reader.onerror = (error) => reject(error);
					reader.readAsDataURL(file);
				});
			},

			/**
			 * Converte uma string base64 de volta para um objeto File.
			 * Mantém o nome original do arquivo.
			 * @param {string} base64        String base64 da imagem
			 * @param {File}   originalFile  Arquivo original (usado para preservar o nome)
			 * @returns {Promise<File>}
			 */
			base64ToBlob: (base64, originalFile) => {
				return new Promise((resolve, reject) => {
					try {
						const byteString = atob(base64.split(",")[1]);
						const ab         = new ArrayBuffer(byteString.length);
						const ia         = new Uint8Array(ab);
						for (let i = 0; i < byteString.length; i++) {
							ia[i] = byteString.charCodeAt(i);
						}
						const blob = new Blob([ab], { type: "image/jpeg" });
						resolve(new File([blob], originalFile.name, { type: "image/jpeg" }));
					} catch (error) {
						reject(error);
					}
				});
			},

			// -------------------------------------------------------
			// THUMBNAILS
			// -------------------------------------------------------

			/**
			 * Gera uma thumbnail redimensionada e retorna em base64.
			 * Não altera o arquivo no formulário — apenas visualização.
			 *
			 * Modos:
			 *   - w e h definidos → crop centralizado para encaixar exatamente em w x h
			 *   - h = 0           → redimensiona pela largura, altura proporcional (sem crop)
			 *
			 * @param {number} index  Índice do arquivo na FileList
			 * @param {number} w      Largura desejada em pixels
			 * @param {number} h      Altura desejada em pixels. Se 0, calculada proporcionalmente.
			 * @returns {Promise<string>} base64 JPEG da thumbnail gerada
			 *
			 * @example
			 * const thumb300 = await input.createThumb(0, 300, 300); // 300x300 crop central
			 * const thumb100 = await input.createThumb(0, 100, 100); // 100x100 crop central
			 * const preview  = await input.createThumb(0, 1000, 0);  // 1000px largura, proporcional
			 */
			createThumb: (index, w, h) => {
				return new Promise(async (resolve, reject) => {
					try {
						const file   = inputElement.files[index];
						const base64 = await inputObject.getBase64(file);
						const img    = new Image();

						img.onerror = (error) => reject(error);
						img.onload  = () => {
							const canvas = document.createElement("canvas");
							const ctx    = canvas.getContext("2d");

							if (h === 0) {
								// Modo proporcional: redimensiona pela largura
								canvas.width  = w;
								canvas.height = Math.round(img.height * (w / img.width));
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

							} else {
								// Modo fixo: crop centralizado para encaixar em w x h
								const aspectRatio      = img.width / img.height;
								const thumbAspectRatio = w / h;
								let cropWidth, cropHeight;

								if (aspectRatio > thumbAspectRatio) {
									cropHeight = img.height;
									cropWidth  = img.height * thumbAspectRatio;
								} else {
									cropWidth  = img.width;
									cropHeight = img.width / thumbAspectRatio;
								}

								const offsetX = (img.width  - cropWidth)  / 2;
								const offsetY = (img.height - cropHeight) / 2;

								canvas.width  = w;
								canvas.height = h;
								ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, w, h);
							}

							resolve(canvas.toDataURL("image/jpeg"));
						};

						img.src = base64;
					} catch (error) {
						reject(error);
					}
				});
			},

			/**
			 * Gera uma thumbnail e substitui o arquivo original no input pela versão redimensionada.
			 * Ideal para reduzir o peso do arquivo antes de enviar ao servidor.
			 *
			 * Modos:
			 *   - w e h definidos → crop centralizado para encaixar exatamente em w x h
			 *   - h = 0           → redimensiona pela largura, altura proporcional (sem crop)
			 *
			 * @param {number} index  Índice do arquivo na FileList
			 * @param {number} w      Largura desejada em pixels
			 * @param {number} h      Altura desejada em pixels. Se 0, calculada proporcionalmente.
			 * @returns {Promise<FileList>} FileList atualizado após a substituição
			 *
			 * @example
			 * await input.replaceThumb(0, 1000, 0); // substitui pelo arquivo redimensionado para 1000px de largura
			 * await input.replaceThumb(0, 800, 800); // substitui pelo arquivo com crop 800x800
			 */
			replaceThumb: (index, w, h) => {
				return new Promise(async (resolve, reject) => {
					try {
						const file    = inputElement.files[index];
						const thumb   = await inputObject.createThumb(index, w, h);
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

		}; // fim inputObject

		this.inputs.push({ name: name, input: inputObject });
		return inputObject;
	}

}
