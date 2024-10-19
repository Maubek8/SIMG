// Carregar os modelos necessários do face-api.js
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(() => {
    console.log("Modelos carregados com sucesso.");
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
            alert("Por favor, permita o acesso à câmera nas configurações do seu navegador.");
        });
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

// Função para iniciar o reconhecimento facial ao entrar
function startRecognition() {
    const video = document.getElementById('video');
    startVideo(); // Inicia a câmera

    setTimeout(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length > 0) {
            const currentFaceDescriptor = detections[0].descriptor;
            const savedFaceDescriptor = JSON.parse(localStorage.getItem('faceDescriptor'));

            if (savedFaceDescriptor) {
                const distance = euclideanDistance(savedFaceDescriptor, currentFaceDescriptor);
                if (distance < 0.6) { // Tolerância para comparação de rostos
                    window.location.href = 'dashboard.html'; // Redireciona para o dashboard
                } else {
                    alert('Falha na autenticação facial. Tente novamente.');
                }
            } else {
                alert('Nenhum usuário cadastrado. Por favor, faça o cadastro biométrico.');
            }
        } else {
            alert('Nenhum rosto detectado. Por favor, tente novamente.');
        }
    }, 1000);
}

// Função para calcular a distância euclidiana entre dois descritores
function euclideanDistance(arr1, arr2) {
    return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}
