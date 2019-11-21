import './index.scss';
import { applySelectors } from './src/selectors';
import { CustomWindow } from './src/models';
import * as toastr from "toastr";

declare let window: CustomWindow;
declare let navigator: any;

// Put variables in global scope to make them available to the browser console.
const constraints: MediaStreamConstraints = {
    video: true,
    audio: true
}

// Set global because why not
window.constraints = constraints;

const init = (): void => {

    const firstPeer: RTCPeerConnection = new RTCPeerConnection();
    const secondPeer: RTCPeerConnection = new RTCPeerConnection();

    firstPeer.onicecandidate = event => {
        if (event.candidate) {
            secondPeer.addIceCandidate(event.candidate);
        }
    }

    secondPeer.onicecandidate = event => {
        if (event.candidate) {
            firstPeer.addIceCandidate(event.candidate);
        }
    }



    navigator.mediaDevices
        .getDisplayMedia(constraints)
        .then((stream: MediaStream) => {
            window.stream = stream;
            document.querySelector<HTMLVideoElement>("#local").srcObject = stream;
            firstPeer.addStream(stream)
            return firstPeer.createOffer()
        })
        .then((offer: RTCSessionDescriptionInit) => firstPeer.setLocalDescription(new RTCSessionDescription(offer)))
        .then(() => secondPeer.setRemoteDescription(firstPeer.localDescription))
        .then(() => secondPeer.createAnswer())
        .then((answer: RTCSessionDescriptionInit) => secondPeer.setLocalDescription(new RTCSessionDescription(answer)))
        .then(() => firstPeer.setRemoteDescription(secondPeer.localDescription))
        .catch((err: Error) => {
            handleError(err);
        });

    secondPeer.ontrack = event => {
        document.querySelector<HTMLVideoElement>("#remote").srcObject = event.streams[0];
    }

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
    console.error(error);
    toastr.error(error.message);
}

applySelectors();
init();
