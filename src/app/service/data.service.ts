import {Injectable} from '@angular/core';
import {Layout, Room} from '../model/Room';
import {User} from '../model/User';
import {Observable} from 'rxjs';
import {Booking} from '../model/Booking';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  private static getCorrectRoom(room: Room): { name: string; location: string; capacities: any[]; id: number }{
    const correctedRoom = {id : room.id, name : room.name, location : room.location, capacities : []};
    for (const lc of room.capacities){
      let trueLayout: string;
      for (const member in Layout) {
        if (Layout.hasOwnProperty(member)){
          if (Layout[member] === lc.layout)
          {
            trueLayout = member;
            break;
          }
        }
      }
      const correctedLayout = {layout : trueLayout, capacity : lc.capacity};
      correctedRoom.capacities.push(correctedLayout);
    }
    return correctedRoom;
  }

  getUsers(): Observable<Array<User>> {
    let users;
    return this.http.get<Array<User>>(environment.restUrl + '/api/users/', {withCredentials: true}).pipe(
      map (
        data => {
          users = new Array<User>();
          data.forEach( u => {
            users.push(User.fromHttp(u));
          });
          return users;
        }
      ),
      retry(2),
      catchError((err) => {
        console.log('error', err);
        throw (err);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(environment.restUrl + '/api/users/', user, {withCredentials: true});
  }

  addUser(newUser: User, password: string): Observable<User> {
    const fullUser = {
      id : newUser.id,
      name : newUser.name,
      password
    };
    return this.http.post<User>(environment.restUrl + '/api/users/', fullUser, {withCredentials: true});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + '/api/users/' + id, {withCredentials: true});
  }

  resetPassword(id: number): Observable<any> {
    return this.http.get(environment.restUrl + '/api/users/resetPassword/' + id, {withCredentials: true});
  }

  getRooms(): Observable<Array<Room>> {
    let rooms;
    return this.http.get<Array<Room>>(environment.restUrl + '/api/rooms/', {withCredentials: true}).pipe(
      map (
        data => {
          rooms = new Array<Room>();
          data.forEach( r => {
            rooms.push(Room.fromHttp(r));
          });
          return rooms;
        }
      ),
      retry(2),
      catchError((err) => {
        console.log('error', err);
        throw (err);
      })
    );
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(environment.restUrl + '/api/rooms/', DataService.getCorrectRoom(room), {withCredentials: true});
  }

  addRoom(newRoom: Room): Observable<Room> {
    console.log(DataService.getCorrectRoom(newRoom));
    return this.http.post<Room>(environment.restUrl + '/api/rooms/', DataService.getCorrectRoom(newRoom), {withCredentials: true});
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(environment.restUrl + '/api/rooms/' + id, {withCredentials: true});
  }

  getBookings(date: string): Observable<Array<Booking>> {
    let booking;
    return this.http.get<Array<Booking>>(environment.restUrl + '/api/bookings/date', {params : {date}, withCredentials: true}).pipe(
      map (
        data => {
          booking = new Array<Booking>();
          data.forEach( b => {
            booking.push(Booking.fromHttp(b));
          });
          return booking;
        }
      ),
      retry(2),
      catchError((err) => {
        console.log('error', err);
        throw (err);
      })
    );
  }

  getBooking(id: number): Observable<Booking>{
    return this.http.get<Booking>(environment.restUrl + '/api/bookings/' + id).pipe(
      map (data => {
         return Booking.fromHttp(data);
        }
        ),
        retry(2),
        catchError((err) => {
          console.log('error', err);
          throw (err);
        })
    );
  }

  updateBooking(booking: Booking): Observable<Booking> {
    booking.room = DataService.getCorrectRoom(booking.room);
    return this.http.put<Booking>(environment.restUrl + '/api/bookings/', booking, {withCredentials: true});
  }

  addBooking(newBooking: Booking): Observable<Booking> {
    newBooking.room = DataService.getCorrectRoom(newBooking.room);
    return this.http.post<Booking>(environment.restUrl + '/api/bookings/', newBooking, {withCredentials: true});
  }

  deleteBooking(id: number): Observable<any>{
    return this.http.delete(environment.restUrl + '/api/bookings/' + id, {withCredentials: true});
  }

  validateUser(name: string, password: string): Observable<{ result: string }>{
    const authData = btoa(`${name}:${password}`);
    const headers = new HttpHeaders().append('Authorization', 'Basic ' + authData)
      .append('X-Requested-With', 'XMLHttpRequest');
    return this.http.get<{ result: string }>(environment.restUrl + '/api/basicAuth/validate', {headers, withCredentials: true });
  }


  getUser(id: number): Observable<User>{
    return this.http.get<User>(environment.restUrl + '/api/users/' + id).pipe(
      map( data => {
        return User.fromHttp(data);
      })
    );
  }
  getRole(): Observable<{role: string}>{
    const headers = new HttpHeaders().append('X-Requested-With', 'XMLHttpRequest');
    return this.http.get<{role: string}>(environment.restUrl + '/api/users/currentUserRole', { headers, withCredentials: true});
  }
}
