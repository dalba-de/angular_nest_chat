import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent implements OnInit {

  username: string = '';

  constructor(private router: Router, private dataservice: DataService) { }

  ngOnInit() {
    this.username = prompt('username: ')!;
    this.dataservice.sharedData = this.username;
  }

  navbar() {
    this.router.navigate(['chat']);
  }

}
