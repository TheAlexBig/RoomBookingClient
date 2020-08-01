import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from '../../../model/Room';
import {Router} from '@angular/router';
import {DataService} from '../../../service/data.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {

  @Input()
  room: Room;
  message: string;
  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  editRoom(): void{
    this.router.navigate(['admin', 'rooms'], {queryParams : {action : 'edit', id : this.room.id}});
  }

  deleteRoom(): void{
    this.message = 'Deleting...';
    this.dataService.deleteRoom(this.room.id).subscribe(
      () => {
        this.dataChangedEvent.emit();
        this.router.navigate(['admin', 'rooms']);
      }, error => {
        console.log('error', error);
        this.message = this.message = 'Something went wrong and data wasn\'t deleted .You may want to try again';
      }
    );
  }

}
