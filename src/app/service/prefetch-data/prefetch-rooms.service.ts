import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Room} from '../../model/Room';
import {DataService} from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchRoomsService implements Resolve<Observable<Array<Room>>>{

  constructor(private dataService: DataService) { }

  resolve(): Observable<Array<Room>> {
    return this.dataService.getRooms();
  }
}
