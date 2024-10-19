// Carrega os modelos ao iniciar a aplicação
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('...'),
    faceapi.nets.faceLandmark68Net.loadFromUri('...'),
    faceapi.nets.faceRecognitionNet.loadFromUri('...')
]).then(() => {
    // Modelos carregados com sucesso
});

// Função para ativar a câmera
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById('video').srcObject = stream;
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera:", err);
        });
}

// Função para capturar e processar a imagem facial
async function startCapture() {
    const video = document.getElementById('video');
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        // Processa a captura facial
    } else {
        alert("Nenhum rosto detectado. Tente novamente.");
    }
}
