import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from "@angular/cdk/layout";
import { Rooms } from "../../rooms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  username: string = '';
  text: string = '';
  messages: any = {}
  rooms : Rooms[] = []
  activeRoom: Rooms;
  selectedRoom : number = 0;
  eventRoom: string = '';

  constructor(private socket: Socket, private observer: BreakpointObserver) { }

  ngOnInit(): void {
    this.username = prompt('username: ')!;

    this.socket.on('connect', () => {
      this.socket.emit('set-user', this.username);
      this.socket.emit('joinRoom', { room: 'General', username: this.username });
      this.socket.emit('joinRoom', { room: 'Spain', username: this.username });
      let value: string[] = [];
      let spain: string[] = [];
      Object.assign(this.messages, {General: value}); //Esta linea vale para añadir propiedades a un objeto
      Object.assign(this.messages, {Spain: spain});
    });

    this.socket.on('chatToClient', (msg) => {
      if (msg.from !== this.username && msg.room !== this.activeRoom.name)
        this.eventRoom = msg.room;
      this.receiveChatMessage(msg);
    });

    this.socket.on('joinedRoom', (room) => {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name === room.room) {
                this.rooms[i].users = room.users;
                console.log(this.rooms);
                return ;
            }
        }
        let newRoom: Rooms = {
            name: room.room,
            users: room.users,
            isActive: true
        };
        this.rooms.push(newRoom);
        if (!this.activeRoom) {
          this.activeRoom = newRoom;
          console.log("activeRoom: " + this.activeRoom.name)
        }
          
        console.log(this.rooms);
    });

    this.socket.on('leftRoom', (room) => {
        for (let i = 0; i < this.rooms.length; i++) {
            let index = this.rooms[i].users.indexOf(room.nickname);
            if (index > -1) {
                this.rooms[i].users.splice(index, 1);
            }
        }
        console.log(this.rooms);
    });

    // this.socket.on('leftRoom', (room) => {
    //     // this.rooms[room] = false;
    //     // console.log(this.rooms);
    //     // this.rooms.name[room] = false;
    //     this.rooms[this.selectedRoom].isActive = false;
    // });
  }

  sendChatMessage() {
    // Check if user is member of active room
    if (this.isMemberOfActiveRoom) {
        this.socket.emit('chatToServer', { sender: this.username, room: this.activeRoom.name, message: this.text });
        this.text = "";
    }
    else {
        alert('You must be a member of the channel');
    }
  }
  
  receiveChatMessage(msg) {
    //REVISAR AQUI, HAY QUE METER CADA MENSAJE EN EL GRUPO CORRESPONDIENTE
    const arr = msg.room;
    this.messages[arr].push(msg);
    console.log(this.messages)
  }

  selectedConversation(roomName: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].name === roomName) {
        this.selectedRoom = i;
        this.activeRoom = this.rooms[i];
        console.log(this.activeRoom.name);
        console.log("number: " + this.selectedRoom);
        return ;
      }
    }
  }

  isEvent(roomName: string) {
    if (roomName === this.eventRoom)
      return('event');
    return('no_event');
  }

  get isMemberOfActiveRoom() {
    console.log("active?: " + this.rooms[this.selectedRoom].isActive)
    return this.rooms[this.selectedRoom].isActive;
  }

}
