import {Component, Input, OnInit} from '@angular/core';
import {Booking} from '../../model/Booking';
import {DataService} from '../../service/data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Layout, Room} from '../../model/Room';
import {User} from '../../model/User';
import {formatDate} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent implements OnInit {

  @Input()
  booking: Booking;
  rooms: Array<Room>;
  users: Array<User>;
  bookingForm: FormGroup;
  layouts = Object.keys(Layout);
  layoutEnum = Layout;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.rooms = this.route.snapshot.data.rooms;
    this.users = this.route.snapshot.data.users;
    this.bookingForm = this.formBuilder.group({
      bookingDate :  [formatDate(this.booking.date, 'yyyy-MM-dd', 'en'),  Validators.required],
      bookingStart : [this.booking.startTime, Validators.required],
      bookingEnd : [this.booking.endTime, Validators.required],
      bookingRoom : [],
      bookingUser : [],
      bookingLayout : [this.booking.layout],
      bookingParticipants : [this.booking.participants, [Validators.required, Validators.min(1)]],
      bookingTitle : [this.booking.title, Validators.required]
    });
    if  (this.booking.id){
      this.bookingForm.controls.bookingRoom.patchValue(this.rooms.find(value => value.id === this.booking.room.id));
      this.bookingForm.controls.bookingUser.patchValue(this.users.find(value => value.id === this.booking.user.id));
    }
  }

  setValues(): void{
    this.booking.date = this.bookingForm.value.bookingDate;
    this.booking.title = this.bookingForm.value.bookingTitle;
    this.booking.user = this.bookingForm.value.bookingUser;
    this.booking.room = this.bookingForm.value.bookingRoom;
    this.booking.layout = this.bookingForm.value.bookingLayout;
    this.booking.endTime =  this.bookingForm.value.bookingEnd;
    this.booking.startTime = this.bookingForm.value.bookingStart;
    this.booking.participants = this.bookingForm.value.bookingParticipants;
  }

  submitBooking(): void{
    this.setValues();
    console.log(this.booking);
    if (this.booking.id){
      this.dataService.updateBooking(this.booking).subscribe(
        () => {
          this.router.navigate([], {queryParams : {action : 'view'}});
        },
        error => {
          console.log('error', error);
        }
      );
    }
    else {
      console.log(this.booking);
      this.dataService.addBooking(this.booking).subscribe(
        () => {
          this.router.navigate([], {queryParams : {action : 'view'}});
        },
        error => {
          console.log('error', error);
        }
      );
    }
  }
}
