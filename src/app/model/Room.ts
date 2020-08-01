
export class Room {
  id: number;
  name: string;
  location: string;
  capacities = new Array<LayoutCapacity>();

  static fromHttp(room: Room): Room{
    const newRoom = new Room();
    newRoom.id = room.id;
    newRoom.name = room.name;
    newRoom.location = room.location;
    newRoom.capacities = Array<LayoutCapacity>();
    for (const lc of room.capacities){
      newRoom.capacities.push(LayoutCapacity.fromHttp(lc));
    }
    return newRoom;
  }
}

export class LayoutCapacity{
  layout: Layout;
  capacity: number;

  static fromHttp(layoutCapacity: LayoutCapacity): LayoutCapacity{
    const newLayout = new LayoutCapacity();
    newLayout.layout = Layout[layoutCapacity.layout];
    newLayout.capacity = layoutCapacity.capacity;
    return newLayout;
  }
}

export enum Layout{
  THEATER= 'Theater',
  USHAPE = 'U-shape',
  BOARD = 'Board Meeting'
}
