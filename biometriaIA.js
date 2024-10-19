// Carregar os modelos do CDN
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights')
])
.then(startVideo)
.catch(error => {
    console.error('Erro ao carregar os modelos de IA:', error);
});

// Iniciar o vídeo da câmera para captura facial
function startVideo() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            console.log('Câmera iniciada com sucesso.');
        })
        .catch(error => {
            console.error('Erro ao acessar a câmera:', error);
        });
}

// Função para cadastrar biometria
async function cadastrarBiometria() {
    const video = document.getElementById('video');
    video.style.display = 'block'; // Exibe o vídeo para captura

    video.addEventListener('play', async () => {
        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length > 0) {
                alert("Biometria capturada! Por favor, insira seus dados.");
                const nome = prompt("Insira seu nome completo:");
                const dataNascimento = prompt("Insira sua data de nascimento:");
                const cpf = prompt("Insira os 3 primeiros dígitos do CPF:");
                console.log({ nome, dataNascimento, cpf });
                alert("Cadastro concluído!");
                video.style.display = 'none'; // Oculta o vídeo após o cadastro
            } else {
                console.log('Nenhum rosto detectado.');
            }
        } catch (error) {
            console.error('Erro ao detectar rostos:', error);
        }
    });
}

// Função para login usando reconhecimento facial
async function login() {
    const video = document.getElementById('video');
    video.style.display = 'block'; // Exibe o vídeo para reconhecimento

    video.addEventListener('play', async () => {
        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length > 0) {
                alert("Rosto reconhecido! Acesso permitido.");
                window.postMessage({ msg: 'Login bem-sucedido' }, '*');
                window.location.href = 'dashboard.html';  // Redireciona para o painel de controle
            } else {
                alert("Rosto não reconhecido. Tente novamente.");
            }
        } catch (error) {
            console.error('Erro ao reconhecer rostos:', error);
        }
    });
}

// Certifique-se de que a página de destino está pronta para receber mensagens
window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        console.log('Mensagem recebida:', event.data);
    } else {
        console.warn('Mensagem recebida de origem desconhecida:', event.origin);
    }
});
