import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-postform',
  templateUrl: './postform.component.html',
  styleUrls: ['./postform.component.css']
})
export class PostformComponent implements OnInit {
  socket: any;
  postForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  }

  submitPost() {
    this.postService.addPost(this.postForm.value).subscribe(
      data => {
        this.socket.emit('refresh', {});
        this.postForm.reset();
      },
      err => {
        console.log(err);
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
