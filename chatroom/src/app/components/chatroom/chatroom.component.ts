import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('#action_menu_btn').click(function(){
      $('.action_menu').toggle();
    });

  }

}
