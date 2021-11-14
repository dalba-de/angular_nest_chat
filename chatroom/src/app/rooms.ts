export class Rooms {
    // name: Map<string, boolean> = new Map();
    name: string;
    users : string[] = [];
    isActive: boolean;
    notification: boolean;
    isGroup: boolean;

    public constructor(roomName: string) {
        this.name = roomName;
    }
}
