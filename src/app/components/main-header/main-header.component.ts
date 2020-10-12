import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Input() showBackBtn = false;
  @Input() pageTitle = '';

  public isLogin = false;

  private user$: Subscription;

  constructor(private appLocation: Location, private user: UserService) {}

  ngOnInit() {
    this.user$ = this.user.login$.subscribe(data => (this.isLogin = data.is_login));
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  public async goBack() {
    this.appLocation.back();
  }
}
