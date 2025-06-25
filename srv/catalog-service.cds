using { rentals as mr } from '../db/schema';

service movierental {
  entity Movies as projection on mr.Movies;
  entity Rentals as projection on mr.Rentals;
  action returnRental(ID: Integer);
}