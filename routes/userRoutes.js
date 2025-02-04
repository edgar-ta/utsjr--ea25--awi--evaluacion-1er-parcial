import { Router } from 'express';
import userModel, { getCleanUserObject } from '../models/userModel.js';

const router = Router();

router.get("/all", async (request, response) => {
    userModel.find()
        .then(users => {
            const filteredUsers = users.map((user) => getCleanUserObject(user));
            response.json(filteredUsers);
        })
        .catch(error => {
            response.send(`No se pudo obtener la lista de usuarios registrados`);
            response.status(500);
            console.log("Error getting all users: ");
            console.log(error);
        });
});

router.get("/find/:id", async (request, response) => {
    const id = request.params.id;
    userModel.findById(id)
        .then(user => {
            response.json(getCleanUserObject(user));
        })
        .catch(error => {
            response.send(`El usuario con la id ${id} no existe.`);
            response.status(500);
            console.log(`Error getting user by id ${id}: `);
            console.log(error);
        });
})

router.get("/delete/:id", async (request, response) => {
    const id = request.params.id;
    userModel.findByIdAndDelete(id)
        .then(record => {
            if (record === null) {
                response.send("El usuario no existe en la base de datos");
            } else {
                response.send("Usuario borrado correctamente");
            }
        })
        .catch(error => {
            response.send(`No se pudo eliminar al usuario con id ${id}`);
            response.send(500);
            console.log(`Error deleting user by id ${id}`);
            console.log(error);
        })
});

router.get("/update/:id", async (request, response) => {
    const id = request.params.id;
    const { _, ...updateQuery } = getCleanUserObject(request.body);

    userModel.findByIdAndUpdate(id, updateQuery)
        .then(record => {
            if (record === null) {
                response.send("El usuario no existe en la base de datos");
            } else {
                response.send("Usuario actualizado correctamente");
            }
        })
        .catch(error => {
            response.send(`No se pudo eliminar al usuario con id ${id}`);
            response.send(500);
            console.log(`Error deleting user by id ${id}`);
            console.log(error);
        })
});

export default router;