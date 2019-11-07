import './index.scss';

import { CustomWindow } from './models';

declare let window: CustomWindow;

// Put variables in global scope to make them available to the browser console.
const constraints = (window.constraints = {
    audio: false,
    video: { width: 1280, height: 720 }
});

const video = document.querySelector('video');

document.getElementById('play').addEventListener('click', (ev) => {
    video.play();
})

document.getElementById('stop').addEventListener('click', (ev) => {
    video.pause();
})

document.getElementById('rotate').addEventListener('click', (ev) => {
    if (video.classList.contains('rotated')) {
        video.classList.remove('rotated');
    } else {
        video.classList.add('rotated');
    }
})

const init = (): void => {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: MediaStream) => {
            handleSuccess(stream);
        })
        .catch(err => {
            handleError(err);
        });
}

const handleSuccess = (stream: MediaStream) => {
    const videoTracks = stream.getVideoTracks();
    console.log("Got stream with constraints:", constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
}

const handleError = (error: Error) => {
    if (error.name === "ConstraintNotSatisfiedError") {
        let v: any = constraints.video;
        alert(
            `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
        );
    } else if (error.name === "PermissionDeniedError") {
        alert(
            "Permissions have not been granted to use your camera and " +
            "microphone, you need to allow the page access to your devices in " +
            "order for the demo to work."
        );
    }
    alert(`getUserMedia error: ${error.name}`);
}

init();
