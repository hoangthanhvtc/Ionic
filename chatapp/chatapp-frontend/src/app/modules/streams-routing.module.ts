import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from '../components/streams/streams.component';
import { AuthModule } from './auth.module';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [{ path: 'streams', component: StreamsComponent, canActivate: [AuthGuard] }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}