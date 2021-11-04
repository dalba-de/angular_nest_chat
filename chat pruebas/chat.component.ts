import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from "@angular/cdk/layout";
import { ChildComponent } from "../child/child.component";

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
  activeRoom: string = 'general';
  rooms: any = {
    general: true,
    typescript: false,
    nestjs: false
  }
  messages: any = {
    general: [],
    typescript: [],
    nestjs: []
  }

  constructor(private socket: Socket, private observer: BreakpointObserver) { }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  ngOnInit(): void {
    this.username = prompt('username: ')!;

    this.socket.on('connect', () => {
      this.socket.emit('set-user', this.username);
      this.socket.emit('joinRoom', 'general');
    });

    this.socket.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    });

    this.socket.on('joinedRoom', (room) => {
      this.rooms[room] = true;
      console.log(this.rooms);
    });

    this.socket.on('leftRoom', (room) => {
        this.rooms[room] = false;
        console.log(this.rooms);
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

  get isMemberOfActiveRoom() {
    return this.rooms[this.activeRoom];
  }

}
