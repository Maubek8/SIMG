// Carregar os modelos do CDN
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights')
]).then(startVideo);

// Iniciar o vídeo da câmera para captura facial
function startVideo() {
    const video = document.getElementById('video');
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

// Função para cadastrar biometria
async function cadastrarBiometria() {
    const video = document.getElementById('video');
    video.style.display = 'block'; // Exibe o vídeo para captura

    video.addEventListener('play', async () => {
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
        }
    });
}

// Função para login usando reconhecimento facial
async function login() {
    const video = document.getElementById('video');
    video.style.display = 'block'; // Exibe o vídeo para reconhecimento

    video.addEventListener('play', async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length > 0) {
            alert("Rosto reconhecido! Acesso permitido.");
            window.location.href = 'dashboard.html';  // Redireciona para o painel de controle
        } else {
            alert("Rosto não reconhecido. Tente novamente.");
        }
    });
}
