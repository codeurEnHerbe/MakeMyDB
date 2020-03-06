import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragFormComponent } from './components/drag-form/drag-form.component';
import { EditorComponent } from './components/editor/editor.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    DragFormComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxGraphModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
