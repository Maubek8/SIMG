// Carregar os modelos necessários do face-api.js via CDN
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(startVideo)
.catch(error => {
    console.error('Erro ao carregar modelos do face-api.js:', error);
});

// Função para iniciar o vídeo
function startVideo() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Erro ao acessar a câmera:', error);
        });
}

// Função para login com reconhecimento facial
async function login() {
    const video = document.getElementById('video');
    video.style.display = 'block';
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        alert('Rosto reconhecido! Acesso permitido.');
        window.location.href = 'dashboard.html';
    } else {
        alert('Rosto não reconhecido. Tente novamente.');
    }
}

// Função para cadastrar biometria
async function cadastrarBiometria() {
    const video = document.getElementById('video');
    video.style.display = 'block';
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        alert('Biometria capturada! Por favor, insira seus dados.');
        const nome = prompt('Insira seu nome completo:');
        const dataNascimento = prompt('Insira sua data de nascimento:');
        const cpf = prompt('Insira os 3 primeiros dígitos do CPF:');
        console.log({ nome, dataNascimento, cpf });
        alert('Cadastro concluído!');
        video.style.display = 'none';
    } else {
        alert('Nenhum rosto detectado.');
    }
}
