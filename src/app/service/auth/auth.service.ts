import {EventEmitter, Injectable} from '@angular/core';
import {DataService} from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;
  authenticationResultEvent = new EventEmitter<boolean>();
  role: string;

  constructor(private dataService: DataService) { }

  authenticate(username: string, password: string): void{
    this.dataService.validateUser(username, password).subscribe(
      () => {
        this.setUpRole();
        this.isAuthenticated = true;
        this.authenticationResultEvent.emit(true);
      },
      error => {
        this.isAuthenticated = false;
        console.log('error', error);
        this.authenticationResultEvent.emit(false);
      }
    );
  }
  setUpRole(): void{
    this.dataService.getRole().subscribe(
      next => {
        this.role = next.role;
      }
    );
  }

  checkIfTheAlreadyAuthenticated(): void{
    this.dataService.getRole().subscribe(
      next => {
        if (next.role != null){
          this.isAuthenticated = true;
          this.authenticationResultEvent.emit(true);
        }
      }
    );
  }
}
