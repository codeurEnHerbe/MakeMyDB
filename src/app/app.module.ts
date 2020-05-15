import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragFormComponent } from './components/drag-form/drag-form.component';
import { EditorComponent } from './components/editor/editor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { SchemaRestService } from './services/schema-rest.service';
import { ToolBoxComponent } from './components/tool-box/tool-box.component';
import { IndexComponent } from './components/index/index.component';
import { RegisterComponent } from './components/register/register.component';
import { BackendInterceptor } from './utils/backend/http-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { EntityEditionComponent } from './components/canvas/entity-edition/entity-edition.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    DragFormComponent,
    EditorComponent,
    ToolBoxComponent,
    IndexComponent,
    RegisterComponent,
    EntityEditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    SchemaRestService,
    AppComponent,
    { provide: HTTP_INTERCEPTORS, useClass: BackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
