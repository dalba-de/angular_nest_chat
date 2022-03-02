import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { ChatComponent } from './components/chat/chat.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MobxAngularModule } from 'mobx-angular';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from "@angular/material/tabs";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { ChildComponent } from './components/child/child.component';
import { ShellComponent } from './components/shell/shell.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes: Routes = [
    { path: '', redirectTo: 'shell', pathMatch: 'full' },    
    { path: 'chatroom', component: ChatroomComponent },
    { path: 'pruebas', component: PruebasComponent },
    { 
      path: '', component: ShellComponent,
      children: [
        { path: 'chat', component: ChatComponent }
      ]
    }
]

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    PruebasComponent,
    ChildComponent,
    ShellComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    MobxAngularModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
