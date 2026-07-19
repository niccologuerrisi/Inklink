import { Slot } from './slot.model';
import { Purchase } from './purchase.model';
import { PortfolioItem } from './portfolio-item.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  mail: string;
  password: string;
  phone?: string;
  bio?: string;
  registrationDate: string;
  slots?: Slot[];
  purchases?: Purchase[];
  portfolioItems?: PortfolioItem[];
}
