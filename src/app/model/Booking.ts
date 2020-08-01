import {Layout, Room} from './Room';
import {User} from './User';

export class Booking {
  id: number;
  room: Room;
  user: User;
  layout: Layout;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;

  static fromHttp(booking: Booking): Booking{
    const newBooking = new Booking();
    newBooking.id = booking.id;
    newBooking.room = Room.fromHttp(booking.room);
    newBooking.user = User.fromHttp(booking.user);
    newBooking.layout = booking.layout;
    newBooking.title = booking.title;
    newBooking.date = booking.date;
    newBooking.startTime = booking.startTime;
    newBooking.endTime = booking.endTime;
    newBooking.participants = booking.participants;
    return newBooking;
  }

  getDateAsDate(): Date{
    return new Date(this.date);
  }
}
