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
  users: number = 0;
  username: string = '';
  text: string = '';
  messages: any = {}
  rooms : Rooms[] = []
  activeRoom: Rooms;
  selectedRoom : number = 0;

  constructor(private socket: Socket, private observer: BreakpointObserver) { }

  ngOnInit(): void {
    // this.rooms = new Rooms();
    this.username = prompt('username: ')!;

    this.socket.on('connect', () => {
      this.socket.emit('set-user', this.username);
      // this.rooms.push('general');
      // this.rooms.set('general', true);
      // console.log(this.rooms);
      // this.rooms.name.set('general', true);
    //   let generalRoom = new Rooms('general');
    //   generalRoom.isActive = true;
    //   this.rooms.push(generalRoom)
    //   console.log(this.rooms);
      this.socket.emit('joinRoom', { room: 'general', username: this.username });
      let value: string[] = [];
      Object.assign(this.messages, {general: value}); //Esta linea vale para añadir propiedades a un objeto
      console.log(this.messages);
    });

    this.socket.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    });

    this.socket.on('joinedRoom', (room) => {
      // this.rooms[room] = true;
      // console.log(this.rooms);
      // this.rooms.name[room] = true;
      // this.rooms.users.push(this.username);
      this.rooms[this.selectedRoom].isActive = true;
      this.rooms[this.selectedRoom].users.push(this.username);
    });

    this.socket.on('leftRoom', (room) => {
        // this.rooms[room] = false;
        // console.log(this.rooms);
        // this.rooms.name[room] = false;
        this.rooms[this.selectedRoom].isActive = false;
    });

    this.socket.on('users', (data) => {
      this.users = data;
    });
  }

  sendChatMessage() {
    // Check if user is member of active room
    if (this.isMemberOfActiveRoom) {
        this.socket.emit('chatToServer', { sender: this.username, room: this.activeRoom, message: this.text });
        this.text = "";
    }
    else {
        alert('You must be a member of the channel');
    }
  }
  
  receiveChatMessage(msg) {
    this.messages.general.push(msg);
    console.log(this.messages['general'])
  }

  selectedConversation(roomName: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].name === roomName) {
        this.selectedRoom = i;
        this.activeRoom = this.rooms[i];
        console.log(this.activeRoom);
        console.log("number: " + this.selectedRoom);
        return ;
      }
    }
  }

  get isMemberOfActiveRoom() {
    // return this.rooms[this.activeRoom];
    // return this.rooms.name[this.activeRoom];
    console.log("active?: " + this.rooms[this.selectedRoom].isActive)
    return this.rooms[this.selectedRoom].isActive;
  }

}
