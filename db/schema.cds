namespace movierental;

entity Movies {
  key ID: Integer;
  title: String;
  genre: String;
  stock: Integer;
  rentedCount: Integer;
}

entity Rentals {
  key ID: Integer;
  movie_ID: Integer;
  movie: Association to movierental.Movies on movie.ID = movie_ID;
  customer: String;
  quantity: Integer;
  rentalDate: DateTime;
  returned: Boolean default false;
}