// Carregar os modelos necessários do face-api.js
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(startVideo);

// Função para iniciar a captura facial
async function startCapture() {
    const video = document.getElementById('video');
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        // Aqui você pode processar os dados de reconhecimento facial
        alert("Rosto reconhecido!");
    } else {
        alert("Nenhum rosto detectado. Tente novamente.");
    }
}

