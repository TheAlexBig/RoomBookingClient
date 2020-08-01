import {Injectable} from '@angular/core';
import {Layout, LayoutCapacity, Room} from '../model/Room';
import {User} from '../model/User';
import {Observable, of} from 'rxjs';
import {Booking} from '../model/Booking';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class DataService {

  readonly rooms: Array<Room>;
  readonly users: Array<User>;
  readonly bookings: Array<Booking>;

  getUsers(): Observable<Array<User>> {
    return of(this.users);
  }

  updateUser(user: User): Observable<User> {
    const originalUser = this.users.find(u => u.id === user.id);
    originalUser.name = user.name;
    return of(originalUser);
  }

  addUser(newUser: User, password: string): Observable<User> {
    password = 'secret';
    let id = 0;
    for (const user of this.users) {
      if (user.id > id) {
        id = user.id;
      }
    }
    newUser.id = id + 1;
    this.users.push(newUser);
    return of(newUser);
  }

  deleteUser(id: number): Observable<any> {
    const originalUser = this.users.find(r => r.id === id);
    this.users.splice(this.users.indexOf(originalUser), 1);
    return of(null);
  }

  resetPassword(id: number): Observable<any> {
    return of(null);
  }

  getRooms(): Observable<Array<Room>> {
    return of(this.rooms);
  }

  updateRoom(room: Room): Observable<Room> {
    const originalRoom = this.rooms.find(r => r.id === room.id);
    originalRoom.name = room.name;
    originalRoom.location = room.location;
    originalRoom.capacities = room.capacities;
    return of(originalRoom);
  }

  addRoom(newRoom: Room): Observable<Room> {
    let id = 0;
    for (const room of this.rooms) {
      if (room.id > id) {
        id = room.id;
      }
    }
    newRoom.id = id + 1;
    this.rooms.push(newRoom);
    return of(newRoom);
  }

  deleteRoom(id: number): Observable<any> {
    const originalRoom = this.rooms.find(r => r.id === id);
    this.rooms.splice(this.rooms.indexOf(originalRoom), 1);
    return of(null);
  }

  getBookings(date: string): Observable<Array<Booking>> {
    return of(this.bookings.filter(b => b.date === date));
  }

  validateUser(name: string, password: string): Observable<{ result: string }>{
    return of({result: 'ok'});
  }

  updateBooking(booking: Booking): Observable<Booking> {
    const originalBooking = this.bookings.find(b => b.id === booking.id);
    originalBooking.date = booking.date;
    originalBooking.title = booking.title;
    originalBooking.user = booking.user;
    originalBooking.room = booking.room;
    originalBooking.layout = booking.layout;
    originalBooking.startTime = booking.startTime;
    originalBooking.endTime = booking.endTime;
    originalBooking.participants = booking.participants;
    return of(originalBooking);
  }

  addBooking(newBooking: Booking): Observable<Booking> {
    let id = 0;
    for (const booking of this.bookings) {
      if (booking.id > id) {
        id = booking.id;
      }
    }
    newBooking.id = id + 1;
    this.bookings.push(newBooking);
    return of(newBooking);
  }

  deleteBooking(id: number): Observable<any>{
    const originalBooking = this.bookings.find(r => r.id === id);
    this.bookings.splice(this.bookings.indexOf(originalBooking), 1);
    return of(null);
  }

  constructor() {
    this.rooms = new Array<Room>();
    this.users = new Array<User>();
    this.bookings = new Array<Booking>();

    const room1 = new Room();
    room1.id = 1;
    room1.name = 'First Room';
    room1.location = 'First floor';

    const capacity1 = new LayoutCapacity();
    capacity1.layout = Layout.THEATER;
    capacity1.capacity = 50;

    const capacity2 = new LayoutCapacity();
    capacity2.layout = Layout.USHAPE;
    capacity2.capacity = 20;

    room1.capacities.push(capacity1, capacity2);

    const room2 = new Room();
    room2.id = 2;
    room2.name = 'Second Room';
    room2.location = 'Third floor';

    const capacity3 = new LayoutCapacity();
    capacity3.layout = Layout.THEATER;
    capacity3.capacity = 60;

    room2.capacities.push(capacity3);

    this.rooms.push(room1, room2);

    const user1 = new User();
    user1.id = 1;
    user1.name = 'Alex';
    const user2 = new User();
    user2.id = 2;
    user2.name = 'Norman';

    this.users.push(user1, user2);
    const dateToday = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    const booking1 = new Booking();
    booking1.date = dateToday;
    booking1.id = 1;
    booking1.title = 'Meeting with CEO';
    booking1.room = room1;
    booking1.user = user1;
    booking1.layout = Layout.THEATER;
    booking1.participants = 12;
    booking1.startTime = '11:30';
    booking1.endTime = '14:00';


    const booking2 = new Booking();
    booking2.date = dateToday;
    booking2.id = 2;
    booking2.title = 'Meeting with CEO';
    booking2.room = room2;
    booking2.user = user2;
    booking2.layout = Layout.USHAPE;
    booking2.participants = 24;
    booking2.startTime = '12:30';
    booking2.endTime = '15:00';

    this.bookings.push(booking1, booking2);

  }

  getRole(token: string): string{
    return 'ADMIN';
  }
}

