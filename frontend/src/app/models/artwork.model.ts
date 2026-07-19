export interface Artwork {
  id: number;
  purchaseId: number;
  fileUrl: string;
  //Url scritto così e non URL perchè angular fa' il mapping automatico con i nomi
  //e in artwork.java è scritto così
  uploadDate: string;
}
