import WebSocket from 'ws';
import { StartGameMessage, WSMessage } from './server/commands';
import Stats from './stats';
import { TrackingInfo } from './types';

export enum EventType {
    ScreenTypeChanged = "screen-type-changed",
    StartGame = "start-game",
    Run = "run",
    WsOpen = "ws-open",
    WsClose = "ws-close",
    WsMessage = "ws-message",
    WsBinary = "ws-binary",
    ServerMovement = "server-movement",
    Debug = "debug",
}

export interface WsClose {
    type: EventType.WsClose;
    data: TrackingInfo
};

export interface WsOpen {
    type: EventType.WsOpen;
};

export interface WsMessage {
    type: EventType.WsMessage;
    data: WSMessage;
};

export interface StartGame  {
    type: EventType.StartGame;
    data: StartGameMessage
};

export interface BinaryData  {
    type: EventType.WsBinary;
    data: Buffer
};

export interface Run {
    type: EventType.Run;
};

export type MovesToProcess = {
    buf: Buffer,
    tracking: TrackingInfo,
};

export interface ServerMovement {
    type: EventType.ServerMovement;
    data: MovesToProcess[]
}

export interface ScreenTypeChanged {
    type: EventType.ScreenTypeChanged;
}

export interface ServerMovement {
    type: EventType.ServerMovement;
    data: MovesToProcess[]
}

export interface Debug {
    type: EventType.Debug;
    data: {
        type: string,
        [key: string]: any
    },
}

export type EventData =
    ScreenTypeChanged | WsOpen | WsMessage |
    StartGame | Run | BinaryData | ServerMovement | WsClose | Debug;

type EventCallback = (event: EventData, ...args: any[]) => void;

const runObject: Run = { type: EventType.Run };

export class Events {
    private callbacks: EventCallback[];

    constructor() {
        this.callbacks = [];
    }

    on(cb: EventCallback): void {
        this.callbacks.push(cb);
    }

    // Do i even like this?  It creates an addition object allocation every
    // single time we call this method.
    emit(data: EventData, ...additionalArgs: any[]) {
        this.callbacks.forEach(cb => cb(data, ...additionalArgs));
    }

    // Ease of use function
    run() { this.emit(runObject); }

    off(cb: EventCallback) {
        const idx = this.callbacks.indexOf(cb);
        if (~idx) {
            this.callbacks.splice(idx, 1);
        }
    }
};

export default function createEvents() {
    return new Events();
};
