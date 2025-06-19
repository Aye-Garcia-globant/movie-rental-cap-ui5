const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Movies, Rentals } = this.entities;

  // Antes de crear un Rental
  this.before('CREATE', Rentals, async (req) => {
    const { movie_ID, quantity } = req.data;
    const movie = await cds.transaction(req).run(
      SELECT.one.from(Movies).where({ ID: movie_ID })
    );
    if (!movie) return req.error(404, 'Movie Not Found');
    if (movie.stock < quantity) return req.error(400, 'Insufficient stock');
    // Actualiza stock y rentedCount
    await cds.transaction(req).run(
      UPDATE(Movies)
        .set({
          stock: movie.stock - quantity,
          rentedCount: movie.rentedCount + quantity
        })
        .where({ ID: movie_ID })
    );
  });

  // Acción para devolver película
  this.on('returnRental', async (req) => {
    const { ID } = req.data;
    const rental = await cds.transaction(req).run(
      SELECT.one.from(Rentals).where({ ID })
    );
    if (!rental || rental.returned) return req.error(404, 'Rental not found or already returned');
    // Reponer stock
    await cds.transaction(req).run(
      UPDATE(Movies)
        .set({ stock: { '+=': rental.quantity } })
        .where({ ID: rental.movie_ID })
    );
    // Marcar como devuelto
    await cds.transaction(req).run(
      UPDATE(Rentals)
        .set({ returned: true })
        .where({ ID })
    );
    return { message: 'Movie returned successfully' };
  });
});