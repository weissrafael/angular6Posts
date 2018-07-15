import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent} from './admin/admin.component';
import {PostListComponent} from './post-list/post-list.component';


const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: '', component: PostListComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule {}
