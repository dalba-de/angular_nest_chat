export class Rooms {
    // name: Map<string, boolean> = new Map();
    name: string;
    users : string[] = [];
    isActive: boolean;
    notification: boolean;
    isGroup: boolean;
    isPrivate: boolean;
    password: string | undefined;

    public constructor(roomName: string) {
        this.name = roomName;
    }
}
