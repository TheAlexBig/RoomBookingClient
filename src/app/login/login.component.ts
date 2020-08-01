import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../service/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  message = '';
  username: string;
  password: string;
  subscription: Subscription;
  role: string;


  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.authService.authenticationResultEvent.subscribe( result => {
      if (result){
        const url = this.activatedRoute.snapshot.queryParams.requested;
        this.router.navigateByUrl(url);
      }
      else{
        this.message = 'Username or password not recognized - try again';
      }
    });
    this.authService.checkIfTheAlreadyAuthenticated();
  }

  onSubmit(): void{
    this.message = 'Authenticating...';
    this.authService.authenticate(this.username, this.password);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
