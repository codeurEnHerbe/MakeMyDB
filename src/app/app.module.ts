import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragFormComponent } from './components/drag-form/drag-form.component';
import { EditorComponent } from './components/editor/editor.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { SchemaRestService } from './services/schema-rest.service';


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
    FormsModule,
    HttpClientModule
  ],
  providers: [SchemaRestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
