namespace rentals;

entity Movies {
  key ID: Integer;
  title: String;
  img: String;
  genre: String;
  stock: Integer;
  rentedCount: Integer;
}

entity Rentals {
  key ID: Integer;
  movie_ID: Integer;
  movie: Association to rentals.Movies on movie.ID = movie_ID;
  img: String;
  customer: String;
  quantity: Integer;
  rentalDate: DateTime;
  returned: Boolean default false;
}