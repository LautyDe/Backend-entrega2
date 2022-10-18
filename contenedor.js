const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    exists(archivo) {
        /* verifico si existe el archivo */
        console.log(`Buscando archivo...`);
        try {
            if (!fs.existsSync(archivo)) {
                throw new Error("El archivo no existe");
            } else {
                console.log(`Archivo ${archivo} encontrado`);
                return true;
            }
        } catch (error) {
            console.log(`Error buscando el archivo: ${error.message}`);
        }
    }

    async readFile(archivo) {
        console.log(`Leyendo archivo...`);
        try {
            /* leo el archivo */
            const data = await fs.readFileSync(archivo);
            console.log(`Archivo leido con exito: ${data}`);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error leyendo el archivo: ${error.message}`);
        }
    }

    async writeFile(archivo, contenido) {
        console.log(`Escribiendo archivo...`);
        try {
            /* escribir archivo */
            await fs.writeFileSync(archivo, JSON.stringify(contenido, null, 4));
            console.log(`Archivo escrito con exito`);
        } catch (error) {
            console.log(`Error escribiendo el archivo: ${error.message}`);
        }
    }

    async save(producto) {
        try {
            /* busco si existe el archivo con datos y si no tiene datos agrego el producto con id: 1 */
            if (!this.exists(this.archivo)) {
                console.log(`Se procede a crear datos nuevos`);
                let arrayProductos = [];
                producto = { id: 1, ...producto };
                arrayProductos.push(producto);
                console.log(`Agregando producto...`);
                await fs.writeFile(this.archivo, arrayProductos);
                console.log(
                    `Se agrego el producto nuevo con el id: ${producto.id}`
                );
                return producto.id;
            } else {
                /* si el archivo existe, primero verifico si esta vacio */
                if (this.readFile(this.archivo)) {
                    const data = await this.readFile(this.archivo);
                    if (data.length === 0) {
                        /* Si el archivo esta vacio le asigno el id: 1 */
                        producto = { id: 1, ...producto };
                    } else {
                        /* si ya tiene algun producto, se le asigna el nro de id que siga */
                        let ultimoId = data[data.length - 1].id;
                        producto = { id: ultimoId + 1, ...producto };
                    }
                    data.push(producto);
                    console.log(`Se esta agregando el producto a la lista`);
                    /* se escribe el producto */
                    this.writeFile(this.archivo, data);
                    console.log(
                        `Se agrego el nuevo producto con el id: ${producto.id}`
                    );
                    return producto.id;
                }
            }
        } catch (error) {
            console.log(`Error agregando el producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            /* chequeo que exista el documento */
            if (this.exists(this.archivo)) {
                const data = await this.readFile(this.archivo);
                /* uso filter para buscar el producto con el id que queramos */
                const dataId = data.filter(item => item.id === id);
                if (dataId.length === 0) {
                    throw new Error(
                        "No se encontro un producto con el id solicitado"
                    );
                } else {
                    console.log(`Producto con id ${id} encontrado:\n`, dataId);
                    return dataId;
                }
            }
        } catch (error) {
            console.log(`Error buscando producto con el id: ${error.message}`);
        }
    }

    async getAll() {
        /* chequeo si existe el documento */
        if (this.exists(this.archivo)) {
            console.log(`Leyendo archivo...`);
            const data = await this.readFile(this.archivo);
            /* una vez que verifico si existe, veo si esta vacio o tiene contenido */
            if (data.length !== 0) {
                console.log(`Archivo leido con exito`);
                return data;
            } else {
                throw new Error(`El archivo ${this.archivo} esta vacio`);
            }
        }
    }
}

const productos = new Contenedor("./productos.json");
productos.save({ name: "prueba", precio: 200 });
