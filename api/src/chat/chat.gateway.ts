import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
      
  @WebSocketServer() wss: Server;

  nicknames: Map<string, string> = new Map();
  rooms: Map<string, string[]> = new Map();
  private logger: Logger = new Logger('ChatGateway');

  handleDisconnect(client: Socket) {
    // this.wss.emit('users-changed', { user: this.nicknames[client.id], event: 'left' });
    let nickname: string = this.nicknames.get(client.id);
    // seguir aqui borrando al usuario de cada sala.
    this.nicknames.delete(client.id);
    this.wss.emit('users', this.nicknames.size);
  }

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('set-user')
  setUser(client: Socket, nickname: string) {
    this.nicknames.set(client.id, nickname);
    // this.wss.emit('users-changed', {user: nickname, event: 'joined'});
    this.wss.emit('users', this.nicknames.size);    
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
      console.log("sender: " + message.sender + " room: " + message.room);
    this.wss.to(message.room).emit('chatToClient', {text: message.message, from: this.nicknames.get(client.id), created: new Date()});
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
    //client.emit('joinedRoom', { room: data.room, users: users });
    this.wss.emit('joinedRoom', { room: data.room, users: users });
  }

  // AÑADIR LOGICA CUANDO SE VA UN USUARIO (BORRAR DEL MAPA)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log("leave room");
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
