export enum SlotStatus {
  OPEN = 'OPEN',
  OCCUPIED = 'OCCUPIED'
}

export interface Slot {
  id: number;
  title: string;
  price: number;
  status: SlotStatus;
  artistId: number;
}
