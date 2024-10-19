// Carregar os modelos necessários do face-api.js
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).catch(error => {
    console.error('Erro ao carregar modelos do face-api.js:', error);
});

// Função para abrir o modal
function openModal() {
    document.getElementById("cameraModal").style.display = "block";
    startVideo();  // Ativa a câmera ao abrir o modal
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("cameraModal").style.display = "none";
    stopVideo();
}

// Função para iniciar o vídeo da câmera
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

// Função para parar o vídeo da câmera
function stopVideo() {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    video.srcObject = null;
}

// Função para iniciar o reconhecimento facial
async function startRecognition() {
    const video = document.getElementById('video');
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        alert("Rosto reconhecido!");
        closeModal();  // Fecha o modal após o reconhecimento
    } else {
        alert("Nenhum rosto detectado. Tente novamente.");
    }
}
