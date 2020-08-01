import {EventEmitter, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../service/data.service';
import {Router} from '@angular/router';
import {FormResetService} from '../../../service/form-reset.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  @Input()
  user: User;
  formUser: User;
  message: string;
  password: string;
  password2: string;

  nameIsValid = false;
  passwordAreValid = false;
  passwordsMatch = false;

  userResetSubscription: Subscription;
  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userResetSubscription = this.formResetService.resetUserFormEvent.subscribe(
      user => {
        this.user = user;
        this.formUser = Object.assign({}, this.user);
      }
    );
  }

  initializeForm(): void{
    this.formUser = Object.assign({}, this.user);
    this.checkIfNameIsValid();
    this.checkIfPasswordAreValid();
  }

  onSubmit(): void{
    this.message = 'Saving...';
    if (this.user.id == null){
      this.dataService.addUser(this.formUser, this.password).subscribe(
        (user) => {
          this.dataChangedEvent.emit();
          this.redirectToView(user.id);
        },
        error => {
          console.log('error', error);
          this.message = 'Something went wrong and data wasn\'t saved .You may want to try again';
        }
      );
    }
    else {
      this.dataService.updateUser(this.formUser).subscribe(
        (user) => {
          this.dataChangedEvent.emit();
          this.redirectToView(user.id);
        },
        error => {
          console.log('error', error);
          this.message = 'Something went wrong and data wasn\'t saved .You may want to try again';
        }
      );
    }

  }
  redirectToView(id: number): void{
    this.router.navigate(['admin', 'users'], {queryParams: {action : 'view', id}});
  }

  checkIfNameIsValid(): void{
    if (this.formUser.name){
      this.nameIsValid = this.formUser.name.trim().length > 0;
    }
    else {
      this.nameIsValid = false;
    }
  }


  checkIfPasswordAreValid(): void{
    if (this.formUser.id != null){
        this.passwordsMatch = true;
        this.passwordAreValid = true;
    }
    else{
      this.passwordsMatch = this.password === this.password2;
      if (this.password){
        this.passwordAreValid = this.password.trim().length > 0;
      }
      else {
        this.passwordAreValid = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.userResetSubscription.unsubscribe();
  }
}
