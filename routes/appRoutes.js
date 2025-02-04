import { Router } from 'express';
import { login, register } from '../db/userDb.js';

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
        async (req, res) => {
            res.json('Logged out successfully');
        }
    )
);

router.post("/dashboard", async (request, response) => {
    // 
});

router.post("/administrators", async (request, response) => {
    // 
});

router.post("/users", async (request, response) => {
    // 
});

router.post("/landing", async (request, response) => {
    // 
});

export default router;