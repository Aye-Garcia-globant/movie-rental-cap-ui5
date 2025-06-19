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
  movie_ID: Association to Movies;
  customer: String;
  quantity: Integer;
  rentalDate: DateTime;
  returned: Boolean default false;
}