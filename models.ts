export interface CustomWindow extends Window {
    constraints: MediaStreamConstraints;
    stream: MediaStream;
}