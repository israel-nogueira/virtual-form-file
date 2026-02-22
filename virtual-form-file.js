/*
 * Nome do Projeto: VirtualForm
 * Descrição: Crie formulários virtuais para upload de arquivos
 * Autor: Israel Nogueira
 * Data de Criação: 23/05/2024
 * Última Modificação: 2025
 * Versão: 1.3
 * Licença: MIT
 * GitHub: https://github.com/israel-nogueira/virtual-form-file
 */

/*
	// -------------------------------------------------------
	// EXEMPLOS DE USO
	// -------------------------------------------------------

	const form  = new FormUpload();
	const input = form.setInput('foto');

	form.setAction('/api/upload');
	input.accept('image/jpeg, image/png, image/webp, image/gif');

	input.on('change', async function () {

		// createThumb(index, w, h, quality%)
		//   Retorna base64 sem alterar o arquivo no form.
		//   Se h = 0, altura proporcional à largura.
		//   quality: 0–100. JPEG/WebP convertem para 0.0–1.0.
		//            PNG ignora (sempre lossless). GIF animado retorna o original.

		const thumb300 = await input.createThumb(0, 300, 300, 85); // crop 300x300, 85% qualidade
		const thumb100 = await input.createThumb(0, 100, 100, 85); // crop 100x100, 85% qualidade
		const maxSize  = await input.createThumb(0, 1000, 0, 90);  // 1000px largura, proporcional

		document.getElementById('preview').src = maxSize;

		// replaceThumb(index, w, h, quality%)
		//   Substitui o arquivo no input pelo redimensionado.
		//   GIF animado é mantido sem alterações.

		await input.replaceThumb(0, 1200, 0, 90); // reduz para 1200px antes de enviar

		form.submit();
	});

	input.click();
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
	 * @param {string} name
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
	 * @param {string} action
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
			 * @param {string} event
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
			// HELPERS INTERNOS
			// -------------------------------------------------------

			/**
			 * Detecta o formato de saída correto (mimeType) com base na extensão do arquivo.
			 * GIF animado retorna null — sinal para manter o arquivo original.
			 * GIF estático é convertido para PNG (preserva transparência).
			 *
			 * @param {File} file
			 * @returns {Promise<string|null>}
			 *   'image/jpeg' | 'image/png' | 'image/webp' | null (GIF animado)
			 */
			_detectMime: (file) => {
				return new Promise((resolve) => {
					const ext = file.name.split('.').pop().toLowerCase();

					// GIF: verifica se é animado lendo os frames do binário
					if (ext === 'gif') {
						const reader = new FileReader();
						reader.onload = (e) => {
							const arr    = new Uint8Array(e.target.result);
							let frames   = 0;

							// Percorre os bytes procurando o marcador de frame GIF (0x00 0x21 0xF9 0x04)
							for (let i = 0; i < arr.length - 3; i++) {
								if (arr[i] === 0x00 && arr[i+1] === 0x21 && arr[i+2] === 0xF9 && arr[i+3] === 0x04) {
									frames++;
									if (frames > 1) break;
								}
							}

							// Animado → retorna null (manter original)
							// Estático → converte para PNG
							resolve(frames > 1 ? null : 'image/png');
						};
						reader.readAsArrayBuffer(file);
						return;
					}

					// Mapeamento de extensão → MIME
					const map = {
						jpg:  'image/jpeg',
						jpeg: 'image/jpeg',
						png:  'image/png',
						webp: 'image/webp',
					};

					resolve(map[ext] || 'image/jpeg');
				});
			},

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
			 * Normaliza o valor de quality (0–100) para o range esperado por cada formato:
			 *   JPEG / WebP → 0.0 a 1.0    (ex: 85% → 0.85)
			 *   PNG         → ignorado pelo canvas do browser (sempre lossless)
			 *
			 * @param {number} qualityPercent  Valor de 0 a 100
			 * @param {string} mimeType
			 * @returns {number|undefined}
			 */
			_normalizeQuality: (qualityPercent, mimeType) => {
				if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
					// Garante que o valor está entre 0 e 100 antes de converter
					const clamped = Math.min(100, Math.max(0, qualityPercent));
					return clamped / 100;
				}

				// PNG: canvas não suporta parâmetro de compressão — sempre lossless
				if (mimeType === 'image/png') {
					if (qualityPercent !== undefined && qualityPercent !== null) {
						console.warn('[VirtualForm] PNG é sempre lossless no canvas do browser. O parâmetro quality é ignorado.');
					}
					return undefined;
				}

				return undefined;
			},

			/**
			 * Converte uma string base64 de volta para um objeto File.
			 * Mantém o nome original do arquivo, ajustando a extensão conforme o mimeType de saída.
			 *
			 * @param {string} base64        String base64 da imagem
			 * @param {File}   originalFile  Arquivo original (usado para preservar o nome)
			 * @param {string} mimeType      MIME type de saída
			 * @returns {Promise<File>}
			 */
			base64ToBlob: (base64, originalFile, mimeType) => {
				return new Promise((resolve, reject) => {
					try {
						// Extensão correta para o formato de saída
						const extMap = {
							'image/jpeg': 'jpg',
							'image/png':  'png',
							'image/webp': 'webp',
						};
						const newExt  = extMap[mimeType] || 'jpg';
						const newName = originalFile.name.replace(/\.[^/.]+$/, '') + '.' + newExt;

						const byteString = atob(base64.split(",")[1]);
						const ab         = new ArrayBuffer(byteString.length);
						const ia         = new Uint8Array(ab);
						for (let i = 0; i < byteString.length; i++) {
							ia[i] = byteString.charCodeAt(i);
						}

						const blob = new Blob([ab], { type: mimeType });
						resolve(new File([blob], newName, { type: mimeType }));
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
			 * Não altera o arquivo no formulário — apenas visualização/preview.
			 *
			 * Comportamento por formato:
			 *   JPEG  → redimensiona, quality 0–100 aplicado (converte para 0.0–1.0)
			 *   WebP  → redimensiona, quality 0–100 aplicado (converte para 0.0–1.0), preserva transparência
			 *   PNG   → redimensiona, lossless, quality ignorado, preserva transparência
			 *   GIF estático  → converte para PNG, preserva transparência
			 *   GIF animado   → retorna o base64 original sem redimensionar
			 *
			 * Modos de redimensionamento:
			 *   - w e h definidos → crop centralizado para encaixar exatamente em w x h
			 *   - h = 0           → redimensiona pela largura, altura proporcional (sem crop)
			 *
			 * @param {number} index    Índice do arquivo na FileList
			 * @param {number} w        Largura desejada em pixels
			 * @param {number} h        Altura desejada em pixels. Se 0, calculada proporcionalmente.
			 * @param {number} quality  Qualidade de 0 a 100 (JPEG/WebP). PNG ignora. Default: 100.
			 * @returns {Promise<string>} base64 da thumbnail gerada
			 *
			 * @example
			 * const thumb = await input.createThumb(0, 300, 300, 85); // crop 300x300, 85% qualidade
			 * const prev  = await input.createThumb(0, 1000, 0);      // 1000px largura, proporcional
			 */
			createThumb: (index, w, h, quality = 100) => {
				return new Promise(async (resolve, reject) => {
					try {
						const file     = inputElement.files[index];
						const mimeType = await inputObject._detectMime(file);

						// GIF animado → retorna o arquivo original sem alterar
						if (mimeType === null) {
							const base64 = await inputObject.getBase64(file);
							return resolve(base64);
						}

						const base64 = await inputObject.getBase64(file);
						const img    = new Image();

						img.onerror = (error) => reject(error);
						img.onload  = () => {
							const canvas = document.createElement("canvas");
							const ctx    = canvas.getContext("2d");

							// Preserva transparência: não preenche fundo (padrão é transparente)
							// JPEG não suporta transparência — preenche com branco
							if (mimeType === 'image/jpeg') {
								if (h === 0) {
									canvas.width  = w;
									canvas.height = Math.round(img.height * (w / img.width));
								} else {
									canvas.width  = w;
									canvas.height = h;
								}
								ctx.fillStyle = '#FFFFFF';
								ctx.fillRect(0, 0, canvas.width, canvas.height);
							}

							if (h === 0) {
								// Modo proporcional: redimensiona pela largura, sem crop
								canvas.width  = w;
								canvas.height = Math.round(img.height * (w / img.width));
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

							} else {
								// Modo fixo: crop centralizado para encaixar exatamente em w x h
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

							// Normaliza quality para o range do formato
							const normalizedQuality = inputObject._normalizeQuality(quality, mimeType);

							resolve(canvas.toDataURL(mimeType, normalizedQuality));
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
			 * GIF animado é mantido sem qualquer alteração.
			 * A extensão do arquivo é atualizada conforme o formato de saída.
			 *
			 * @param {number} index    Índice do arquivo na FileList
			 * @param {number} w        Largura desejada em pixels
			 * @param {number} h        Altura desejada em pixels. Se 0, calculada proporcionalmente.
			 * @param {number} quality  Qualidade de 0 a 100 (JPEG/WebP). PNG ignora. Default: 100.
			 * @returns {Promise<FileList>} FileList atualizado após a substituição
			 *
			 * @example
			 * await input.replaceThumb(0, 1200, 0, 90);  // 1200px largura, 90% qualidade
			 * await input.replaceThumb(0, 800, 800, 85); // crop 800x800, 85% qualidade
			 */
			replaceThumb: (index, w, h, quality = 100) => {
				return new Promise(async (resolve, reject) => {
					try {
						const file     = inputElement.files[index];
						const mimeType = await inputObject._detectMime(file);

						// GIF animado → mantém o arquivo original sem alterar
						if (mimeType === null) {
							console.info(`[VirtualForm] "${file.name}" é um GIF animado e foi mantido sem alterações.`);
							return resolve(inputElement.files);
						}

						const thumb   = await inputObject.createThumb(index, w, h, quality);
						const newFile = await inputObject.base64ToBlob(thumb, file, mimeType);

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
