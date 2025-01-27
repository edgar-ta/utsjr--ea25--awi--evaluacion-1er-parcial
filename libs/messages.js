function getMessageText(status) {
    // 
}

/**
 * 
 * @param {number} status 
 * @param {string} userMessage 
 * @param {string} developerMessage 
 * @param {string} token 
 * @returns 
 */
export function message(status, userMessage, developerMessage = userMessage, token) {
    return { 
        status, 
        userMessage,
        developerMessage,
        token
    };
}

