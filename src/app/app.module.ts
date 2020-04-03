import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragFormComponent } from './components/drag-form/drag-form.component';
import { EditorComponent } from './components/editor/editor.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { SchemaRestService } from './services/schema-rest.service';
import { ToolBoxComponent } from './components/tool-box/tool-box.component';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    DragFormComponent,
    EditorComponent,
    ToolBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SchemaRestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
