import {EventEmitter, Component, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../service/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input()
  user: User;
  message: string;
  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
  }

  editUser(): void{
    this.router.navigate(['admin', 'users'], {queryParams : {action : 'edit', id : this.user.id}});
  }

  deleteUser(): void{
    this.message = 'Deleting...';
    this.dataService.deleteUser(this.user.id).subscribe(
      () => {
        this.dataChangedEvent.emit();
        this.router.navigate(['admin', 'users']);
      }, error => {
        console.log('error', error);
        this.message = this.message = 'Something went wrong and data wasn\'t deleted .You may want to try again';
      }
    );
  }
  resetPassword(): void{
    this.message = 'Please wait...';
    this.dataService.resetPassword(this.user.id).subscribe(() => {
      this.message = 'The password has been reset';
    }, error => {
      console.log('error', error);
      this.message = this.message = 'Something went wrong and the password wasn\'t saved .You may want to try again';
    });
  }
}
