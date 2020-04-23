import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas.component';
import { EditorComponent } from './components/editor/editor.component';
import { IndexComponent } from './components/index/index.component';


const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'editor', component: EditorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  

}
