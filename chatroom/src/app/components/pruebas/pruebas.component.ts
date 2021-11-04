import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {

    constructor(private router: Router) { }
 
    buildConversationsArray(conversations) {
    }
   
    ngOnInit() {
    }
   
    selectConversation(conversationId: string) {
    }
   
    sendText(text: string) {
    }
   
    conversations: any
    selectedConversation: any
    text: string
    events: Array<any> = []
}
