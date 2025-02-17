import { Router } from 'express';
import { login, register } from '../db/userDb.js';
import { onAuthorizedAdmin, onAuthorizedUser, onAuthorizedUser2 } from '../middlewares/passwordFunctions.js';

const router = Router();

/**
 * 
 * @param {string} errorMessage
 * @param {(request, response) => Promise<void>} callback 
 * @returns {async (request, response) => void} 
 */
function awaitOrSendError(errorMessage, callback) {
    return async function(request, response) {
        callback(request, response).catch(error => {
            response.status(500).send("Error: " + errorMessage);
            console.log(error);
        });
    }
}

router.post('/login', 
    awaitOrSendError(
        'Error logging in',
        async (request, response) => {
            const { username, password } = request.body;

            login({ username, password })
                .then(response_ => {
                    console.log(response_.developerMessage);
                    response
                        .cookie("token", response_.token)
                        .status(response_.status)
                    ;
                    response.json(response_.userMessage);
                })
            ;
        }
    )
);


router.post('/signup', 
    awaitOrSendError(
        'Error signing up',
        async (request, response) => {
            const { username, email, password } = request.body;

            console.log(request.body);
            
            register({ username, email, password })
                .then(response_ => {
                    console.log(response_.developerMessage);
                    response
                        .cookie("token", response_.token)
                        .status(response_.status);
                    response.json(response_.userMessage);
                })
            ;
        }
    )
);

router.post('/logout', 
    awaitOrSendError(
        'Error logging out',
        async (request, response) => {
            if (request.cookies.token === undefined) {
                response
                    .status(200)
                    .json("El usuario no estaba logueado en primer lugar");
                return;
            }
            response
                .cookie("token", "", { expires: new Date(0) })
                .status(200)
                .json("Sesión cerrada correctamente")
            ;
        }
    )
);

router.post("/dashboard", async (request, response) => {
    // 
});

router.get("/loggedInUsers", async (request, response) => {
    console.log("The token is");
    console.log(request.cookies.token);
    const authorizationResponse = onAuthorizedUser2(request, request.cookies.token);
    response
        .status(authorizationResponse.status)
        .json(authorizationResponse.userMessage);
});

router.get("/administrators", async (request, response) => {
    const authorizationResponse = await onAuthorizedAdmin(request);

    console.log("The authorization response is");
    console.log(authorizationResponse);
    response
        .status(authorizationResponse.status)
        .json(authorizationResponse.userMessage)
        ;
});

router.post("/landing", async (request, response) => {
    // 
});

export default router;