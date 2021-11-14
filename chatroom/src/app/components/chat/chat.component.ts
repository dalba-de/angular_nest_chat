import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabGroup } from '@angular/material/tabs'
import { BreakpointObserver } from "@angular/cdk/layout";
import { Rooms } from "../../rooms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  username: string = '';
  text: string = '';
  newGroup: string = '';
  messages: any = {}
  rooms : Rooms[] = []
  activeRoom: Rooms;
  selectedRoom : number = 0;
  users: string[] = [];
  notification: boolean = false;

  constructor(private socket: Socket, private observer: BreakpointObserver) { }

  ngOnInit(): void {
    this.username = prompt('username: ')!;

    this.socket.on('connect', () => {
      this.socket.emit('set-user', this.username);
      this.socket.emit('joinRoom', { room: 'General', username: this.username });
      let value: string[] = [];
      Object.assign(this.messages, {General: value}); //Esta linea vale para añadir propiedades a un objeto
    });

    this.socket.on('chatToClient', (msg) => {
      if (msg.from !== this.username) {
        this.playAudio();
      }
      if (this.tabGroup.selectedIndex !== 0) {
        this.notification = true;
      }
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].name === msg.room && this.username !== msg.from && msg.room !== this.activeRoom.name) {
            this.rooms[i].notification = true;
        }
      }
      this.receiveChatMessage(msg);
    });

    this.socket.on('users', (newUser) => {
      for (let i = 0; i < newUser.nicknames.length; i++) {
        console.log(newUser.nicknames[i])
        if (newUser.nicknames[i] !== this.username)
          this.users.push(newUser.nicknames[i])
      }
    })

    this.socket.on('joinedRoom', (room) => {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name === room.room) {
                this.rooms[i].users = room.users;
                this.rooms[i].isActive = true;
                console.log(this.rooms);
                return ;
            }
        }
        let bool: boolean = false;
        if (room.users.indexOf(this.username) > -1)
            bool = true;        
        let newRoom: Rooms = {
            name: room.room,
            users: room.users,
            isActive: bool,
            notification: false,
        };
        this.rooms.push(newRoom);
        if (!this.activeRoom) {
          this.activeRoom = newRoom;
        }
        console.log(this.rooms);
    });

    this.socket.on('joinedOneToOne', (room) => {
      let newRoom: Rooms = {
        name: room.room,
        users: room.users,
        isActive: true,
        notification: false
      };
      let value: string[] = [];      
      Object.assign(this.messages, {[room.room]: value});
      this.rooms.push(newRoom);
      this.tabGroup.selectedIndex = 0;
      this.selectedConversation(room.room);
      console.log(this.rooms);
    });

    // Borra los usuarios cuando se abandona el chat
    this.socket.on('leftRoom', (room) => {
        for (let i = 0; i < this.rooms.length; i++) {
            let index = this.rooms[i].users.indexOf(room.nickname);
            if (index > -1) {
                this.rooms[i].users.splice(index, 1);
            }
        }
        console.log(this.rooms);
    });
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
    console.log(this.messages)
    const arr = msg.room;
    this.messages[arr].push(msg);
    console.log(this.messages)
  }

  selectedConversation(roomName: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].name === roomName) {
        this.selectedRoom = i;
        this.activeRoom = this.rooms[i];
        this.rooms[i].notification = false;
        if (this.rooms[i].isActive === false) {
          if(confirm(this.username + " do you want to enter the group?")) {
            this.socket.emit('joinRoom', { room: roomName, username: this.username });
            let value: string[] = [];      
            Object.assign(this.messages, {[roomName]: value});
          }
        }
        return ;
      }
    }
  }

  isEvent(roomName: string) {
    let bool: boolean = true;
    for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].name === roomName) {
            bool = this.rooms[i].isActive;
        }
    }
    if (bool === false)
      return('no_in_group')
    return('no_event');
  }

  createNewGroup() {
      this.socket.emit('joinRoom', { room: this.newGroup, username: this.username });
      let value: string[] = [];      
      Object.assign(this.messages, {[this.newGroup]: value});
      this.newGroup = '';
      console.log(this.messages);
  }

  userToUser(user: string) {
    this.socket.emit('userToUser', { myUser: this.username, username: user });
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/audio/notification.mp3";
    audio.load();
    audio.play();
  }

  deleteNotification() {
    this.notification = false;
    console.log(this.notification)
  }

  get isMemberOfActiveRoom() {
    console.log("active?: " + this.rooms[this.selectedRoom].isActive)
    return this.rooms[this.selectedRoom].isActive;
  }

}
