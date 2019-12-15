import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts = [];
  socket: any;
  user: any;
  constructor(private postService: PostService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();
    this.socket.on('refreshPage', data => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
    });
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  TimeFromNow(time) {
    return moment(time)
      .locale('vi')
      .fromNow();
  }
}
