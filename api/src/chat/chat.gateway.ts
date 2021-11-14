import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
      
  @WebSocketServer() wss: Server;

  nicknames: Map<string, string> = new Map();
  rooms: Map<string, string[]> = new Map();
  users: string[] = [];
  private logger: Logger = new Logger('ChatGateway');

  handleDisconnect(client: Socket) {
    let nickname: string = this.nicknames.get(client.id);
    for (const [key, value] of this.rooms.entries()) {
        const index = value.indexOf(nickname, 0);
        if (index > -1) {
            value.splice(index, 1);
        }
    }
    console.log(this.rooms);
    this.nicknames.delete(client.id);
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === nickname)
        this.users.splice(i, 1);
    }
    // this.wss.emit('users', this.nicknames.size);
    this.wss.emit('leftRoom', {nickname: nickname});
    this.wss.emit('closeChat', {username: nickname});
  }

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('set-user')
  setUser(client: Socket, nickname: string) {
    this.nicknames.set(client.id, nickname);
    // this.wss.emit('users-changed', {user: nickname, event: 'joined'});
    this.users.push(nickname);
    this.wss.emit('users', {nicknames: this.users});
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    //REVISAR ESTA LINEA, HABRA QUE MANDAR EL ROOM DENTRO DE LOS DATOS
    //this.wss.to(message.room).emit('chatToClient', {text: message.message, from: this.nicknames.get(client.id), created: new Date()});
    this.wss.to(message.room).emit('chatToClient', {text: message.message, room: message.room, from: this.nicknames.get(client.id), created: new Date()});
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { room: string, username: string }) {
    let users: string[] = [];
    if (!this.rooms.has(data.room)) {
        users.push(data.username);
        this.rooms.set(data.room, users);
        console.log(this.rooms);
    }
    else {
        users = this.rooms.get(data.room);
        users.push(data.username);
        this.rooms.set(data.room, users);
        console.log(this.rooms);
    }
    client.join(data.room);
    this.wss.emit('joinedRoom', { room: data.room, users: users });
  }

  @SubscribeMessage('userToUser')
  handleUserToUser(client: Socket, data: { myUser: string, username: string }) {
    let users: string[] = [];
    let id: string;
    let socketId: Socket;
    let roomName: string = data.myUser + data.username;
    console.log("roomName: " + roomName);
    for (const [key, value] of this.nicknames.entries()) {
      if (value === data.username) {
        id = key;
        console.log("id: " + id);
      }
    }
    users.push(data.myUser);
    users.push(data.username);
    socketId = this.wss.sockets.sockets.get(id);
    client.join(roomName);
    socketId.join(roomName);
    client.emit('joinedOneToOne', { room: roomName, users: users, user: data.username});
    client.broadcast.to(id).emit('joinedOneToOne', { room: roomName, users: users, user: data.username });
  }

  // AÑADIR LOGICA CUANDO SE VA UN USUARIO (BORRAR DEL MAPA)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log("leave room");
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
