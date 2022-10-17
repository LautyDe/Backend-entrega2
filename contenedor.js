const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    exists(archivo) {
        /* verifico si existe el archivo */
        try {
            if (!fs.existsSync(archivo)) {
                throw new Error("El archivo no existe");
            } else {
                console.log(`Archivo ${archivo} encontrado`);
                return true;
            }
        } catch (error) {
            console.log(
                `Error verificando si existe el archivo: ${error.message}`
            );
        }
    }

    async readFile(archivo) {
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
        /* escribir archivo */
        try {
            await fs.writeFileSync(archivo, JSON.stringify(contenido, null, 4));
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
}

const productos = new Contenedor("./productos.json");
productos.save({ name: "prueba", precio: 200 });
