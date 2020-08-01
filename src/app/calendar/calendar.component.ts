import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import {DataService} from '../service/data.service';
import {Booking} from '../model/Booking';
import {ActivatedRoute, Router} from '@angular/router';
import {Layout} from '../model/Room';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookings: Array<Booking>;
  selectedBooking: Booking;
  selectedDate: string;
  action: string;
  message: string;
  loadingData = false;
  layoutEnum = Layout;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.processUrlParams();
  }

  processUrlParams(): void{
    this.route.queryParams.subscribe(
      params => {
        const id = params.id;
        this.selectedDate = params.date;
        this.action = params.action;
        this.loadData(id);
      }
    );

  }

  loadData(id: number): void{
    this.loadingData = false;
    this.message = 'Please wait...';
    if (!this.selectedDate){
      this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    }
    if (id){
      this.dataService.getBooking(id).subscribe(value => { this.selectedBooking = value; });
    }
    else if (this.action === 'add' && this.selectedBooking == null){
      this.selectedBooking = new Booking();
      this.selectedBooking.date = new Date().toString();
    }
    else {
      this.selectedBooking = null;
    }

    this.dataService.getBookings(this.selectedDate).subscribe(
      next => {
        this.bookings = next;
        this.loadingData = true;
      },
      error => {
        console.log('error', error);
        this.message = 'Unable to retrieve data from the server';
    });
  }

  editBooking(id: number): void{
    this.router.navigate([], {queryParams : {action : 'edit', id}});
  }

  addBooking(): void{
    this.router.navigate([], {queryParams : {action : 'add'}});
  }

  deleteBooking(id: number): void{
    this.dataService.deleteBooking(id).subscribe(() => {
      this.loadData(id);
    }, error => {
        console.log('error', error);
      });
  }

  dateChanged(): void{
    this.router.navigate([], { queryParams : {action : 'view', date : this.selectedDate}});
  }
}
