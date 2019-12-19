import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostformComponent } from '../components/postform/postform.component';
import { PostComponent } from '../components/post/post.component';
import { PostService } from '../services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '../components/comments/comments.component';

@NgModule({
  declarations: [
    StreamsComponent,
    ToolbarComponent,
    SideComponent,
    PostformComponent,
    PostComponent,
    CommentsComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [StreamsComponent, ToolbarComponent, CommentsComponent],
  providers: [TokenService, PostService]
})
export class StreamsModule {}
