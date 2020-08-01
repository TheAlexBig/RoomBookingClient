import { Component, OnInit } from '@angular/core';
import {DataService} from '../../service/data.service';
import {Room} from '../../model/Room';
import {ActivatedRoute, Router} from '@angular/router';
import {FormResetService} from '../../service/form-reset.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;
  loadingData = true;
  message = 'Please wait... getting the list of rooms';

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  processUrlParams(): void{
    this.route.queryParams.subscribe(
      (params) => {
        const id = params.id;
        this.action = params.action;
        if (id){
          this.selectedRoom = this.rooms.find(room =>  room.id === +id);
        }
        if (this.action === 'add'){
          this.selectedRoom = new Room();
          this.formResetService.resetRoomFormEvent.emit(this.selectedRoom);
        }
      }
    );
  }

  loadData(): void{
    this.dataService.getRooms().subscribe( (next) => {
        this.rooms = next;
        this.loadingData = false;
        this.processUrlParams();
      },
      (error => {
        console.log('error', error);
        this.message = 'Something went wrong, please try again';
      }));
  }

  setRoom(id: number): void{
    this.router.navigate(['admin', 'rooms'], {queryParams : { action : 'view' , id }});
  }

  addRoom(): void{
    this.router.navigate(['admin', 'rooms'], {queryParams : { action : 'add'}});
  }
}
