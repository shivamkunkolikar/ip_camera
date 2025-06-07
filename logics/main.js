let cam = false
let camera_stream
function clicked_camera_btn() {
    cam = true
    document.getElementById('camera-screen').style.display = 'flex'
    document.getElementById('viewer-screen').style.display = 'none'
    document.getElementById('front-screen').style.display = 'none'
}

function clicked_viewer_btn() {
    cam = false
    document.getElementById('camera-screen').style.display = 'none'
    document.getElementById('viewer-screen').style.display = 'flex'
    document.getElementById('front-screen').style.display = 'none'
}

function start_video() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            camera_stream = stream
            const video = document.getElementById('video')
            video.srcObject = stream
        })
        .catch((error) => {
            console.error("Error Accessing Camera: ", error)
            document.getElementById('err-msg').innerHTML = "error"
        })
}

function stop_video() {
    if(camera_stream) {
        camera_stream.getTracks().forEach(track => {
            console.log(track)
            track.stop()
        })
        const video = document.getElementById('video')
        // video.srcObject = null
        // camera_stream = null
    }
    else {
        console.warn("No Camera Stream")
    }
}

function capture_video() {
    const canvas = document.getElementById('photo')
    const context = canvas.getContext('2d')
    const video = document.getElementById('video')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const downloadLink = document.createElement('a');
    downloadLink.innerText = 'Download Photo';
    document.body.appendChild(downloadLink);    
    const dataURL = canvas.toDataURL('image/png');
    
    downloadLink.href = dataURL;
    downloadLink.download = 'captured-photo.png';
    downloadLink.style.display = 'block';
}

