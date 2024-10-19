// Carregar os modelos necessários do face-api.js
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(() => {
    console.log("Modelos carregados com sucesso.");
    startVideo(); // Começa a captura de vídeo depois que os modelos estão prontos
}).catch(error => {
    console.error("Erro ao carregar os modelos:", error);
});

// Função para iniciar o vídeo da câmera
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById('video').srcObject = stream;
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera:", err);
            alert("Parece que você não permitiu o acesso à câmera. Verifique suas configurações e tente novamente.");
        });
}

// Função para iniciar a captura facial
async function startCapture() {
    const video = document.getElementById('video');
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length > 0) {
        const faceDescriptor = detections[0].descriptor; // Captura o descritor do rosto
        localStorage.setItem('faceDescriptor', JSON.stringify(faceDescriptor)); // Armazena o descritor
        alert("Rosto capturado com sucesso!");
        stopVideo();
        showUserInfo(); // Chama a função para mostrar informações do usuário
    } else {
        alert("Nenhum rosto detectado. Tente novamente.");
    }
}

// Função para parar o vídeo da câmera
function stopVideo() {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

// Função para mostrar o formulário de informações do usuário
function showUserInfo() {
    document.getElementById('cameraModal').style.display = 'none'; // Fecha o modal da câmera
    document.getElementById('userInfo').style.display = 'block'; // Mostra o formulário de informações
}

// Função para finalizar o cadastro
function finishRegistration() {
    const fullName = document.getElementById('fullName').value;
    const birthDate = document.getElementById('birthDate').value;
    const cpf = document.getElementById('cpf').value;

    if (fullName && birthDate && cpf.length === 3) {
        localStorage.setItem('userInfo', JSON.stringify({ fullName, birthDate, cpf }));
        alert('Cadastro finalizado com sucesso!');
        // Aqui você pode redirecionar ou realizar outras ações necessárias
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}
