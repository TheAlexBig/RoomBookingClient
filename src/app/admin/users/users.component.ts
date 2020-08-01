import { Component, OnInit } from '@angular/core';
import {DataService} from '../../service/data.service';
import {User} from '../../model/User';
import {ActivatedRoute, Router} from '@angular/router';
import {FormResetService} from '../../service/form-reset.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Array<User>;
  selectedUser: User;
  action: string;
  loadingData = true;
  message = 'Please wait... getting the list of users';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void{
    this.dataService.getUsers().subscribe( (next) => {
      this.users = next;
      this.loadingData = false;
      this.processUrlParams();
    }, error => {
      console.log('error', error);
      this.message = 'Something went wrong, please try again';
    });
  }

  processUrlParams(): void{
    this.route.queryParams.subscribe(
      (params) => {
        const id = params.id;
        this.action = params.action;
        if (id){
          this.selectedUser = this.users.find(room =>  room.id === +id);
        }
        if (this.action === 'add'){
          this.selectedUser = new User();
          this.formResetService.resetUserFormEvent.emit(this.selectedUser);
        }
      }
    );
  }

  setUser(id: number): void{
    this.router.navigate(['admin', 'users'], {queryParams : { action : 'view', id }});
  }

  addUser(): void{
    this.router.navigate(['admin', 'users'], {queryParams : { action : 'add'}});
  }
}
