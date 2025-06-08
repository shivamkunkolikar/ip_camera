let cam = false
let camera_stream
const ws = new WebSocket(window.location.hostname === 'localhost' ? 'ws://localhost:8080' : 'ws://192.168.80.36:8080')
ws.binaryType = 'blob'

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

            video.onloadedmetadata = () => {
                const cnv = document.createElement('canvas')
                const ctx = cnv.getContext('2d')

                setInterval(() => {
                    cnv.width = video.videoWidth
                    cnv.height = video.videoHeight
                    ctx.drawImage(video, 0, 0, cnv.width, cnv.height)

                    cnv.toBlob(blob => {
                        if(blob && ws.readyState === WebSocket.OPEN) {
                            ws.send(blob)
                        }
                    }, 'image/webp', 0.5)
                }, 33)
            }
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


function start_recieving_video() {
    let img = document.getElementById('stream')
    ws.onmessage = (event) => {
        const blob = event.data
        const url = URL.createObjectURL(blob)
        img.src = url

        img.onload = () => {
            URL.revokeObjectURL(url)
        }
    }
}
