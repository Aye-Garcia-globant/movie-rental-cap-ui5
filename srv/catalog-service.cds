using {rentals as mr} from '../db/schema';

service movierental {
  @cds.redirection.target
  entity Movies as projection on mr.Movies;
  entity Rentals as projection on mr.Rentals;
  entity TopMovies as select from mr.Movies order by rentedCount desc limit 5;
  action returnRental(ID: Integer);
}