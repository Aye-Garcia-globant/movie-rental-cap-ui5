using { movierental as mr } from '../db/schema';

service MovierentalService {
  entity Movies as projection on mr.Movies;
    entity Rentals as projection on mr.Rentals;
  action returnRental(ID: Integer);
}