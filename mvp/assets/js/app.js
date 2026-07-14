const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function appendMessage(text, sender = 'bot'){
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    userInput.value = '';
    const typing = document.createElement('div');
    typing.className = 'chat-message bot';
    typing.textContent = '…';
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const answer = await callGroqMock(msg);
        typing.remove();
        appendMessage(answer, 'bot');
    } catch (err) {
        typing.remove();
        console.error(err);
        appendMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'bot');
    }
});

// Mocked Groq call for MVP (safe for GitHub Pages). Replace with proxy call when you add GROQ_API_KEY.
async function callGroqMock(userMessage){
    return new Promise(resolve => {
        setTimeout(() => {
            const answer = `Resposta automática (MVP): "${userMessage}"`;
            resolve(answer);
        }, 600);
    });
}
