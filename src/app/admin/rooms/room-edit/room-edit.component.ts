import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Layout, LayoutCapacity, Room} from '../../../model/Room';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {Router} from '@angular/router';
import {FormResetService} from '../../../service/form-reset.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit, OnDestroy {
  @Input()
  room: Room;
  @Output()
  dataChangedEvent = new EventEmitter();

  layouts = Object.keys(Layout);
  layoutEnum = Layout;
  roomForm: FormGroup;
  resetEventSubscription: Subscription;
  message: string;

  constructor(private dataService: DataService,
              private formBuilder: FormBuilder,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.resetEventSubscription = this.formResetService.resetRoomFormEvent.subscribe(
      room => {
        this.room = room;
        this.initializeForm();
      }
    );
  }

  initializeForm(): void{
    this.roomForm = this.formBuilder.group(
      {
        roomName : [this.room.name, Validators.required],
        roomLocation : [this.room.location, [Validators.required, Validators.minLength(2)]]
      }
    );

    for (const layout of this.layouts){
      const layoutCapacity = this.room.capacities.find( (it) => it.layout === Layout[layout]);
      const initialCapacity = layoutCapacity == null ? 0 : layoutCapacity.capacity;
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity));
    }
  }

  onSubmit(): void{
    this.message = 'Saving...';
    this.room.name = this.roomForm.value.roomName;
    this.room.location = this.roomForm.value.roomLocation;
    this.room.capacities = new Array<LayoutCapacity>();
    for (const layout of this.layouts){
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = Layout[layout];
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }
    if (this.room.id == null){
      this.dataService.addRoom(this.room).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.redirectToView(next.id);
        }
      , error => {
          console.log('error', error);
          this.message = this.message = 'Something went wrong and data wasn\'t saved .You may want to try again';
        });
    }
    else {
      this.dataService.updateRoom(this.room).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.redirectToView(next.id);
        }
        , error => {
          console.log('error', error);
          this.message = this.message = 'Something went wrong and data wasn\'t saved .You may want to try again';
        });
    }
  }

  redirectToView(id: number): void{
    this.router.navigate(['admin', 'rooms'], {queryParams: {action : 'view', id}});
  }

  ngOnDestroy(): void {
    this.resetEventSubscription.unsubscribe();
  }
}
