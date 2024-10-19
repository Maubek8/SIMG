// Carregar os modelos necessários
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
    const video = document.getElementById('video');
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

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
