import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: UserService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
    });
  }

  public async login(): Promise<boolean> {
    const { email, password } = this.loginForm.value;
    await this.service.doLogin({ email, password });
    return this.router.navigate(['/cameras'], { replaceUrl: true, skipLocationChange: false });
  }
}
