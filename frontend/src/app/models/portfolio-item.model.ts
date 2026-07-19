export interface PortfolioItem {
  id: number;
  ownerId: number;
  fileURL: string;
  title?: string;
  description?: string;
  uploadDate: string;
}
