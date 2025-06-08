import "../../styles/BookingDetails.scss";

function TotalPrice({ price, passengers }) {
  const totalPrice = price * passengers;

  return (
    <div className="total-price-card">
      <h3>Total Price: ${totalPrice}</h3>
    </div>
  );
}

export default TotalPrice;
