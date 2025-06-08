import "../../styles/BookingDetails.scss";

function ActionButtons({ onPay, onCancel, paymentLoading }) {
  return (
    <div className="action-buttons">
      <button
        className="pay-now-button"
        onClick={onPay}
        disabled={paymentLoading}
      >
        {paymentLoading ? (
          <span>
            <span className="spinner"></span> Processing Payment...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>
      <button
        className="cancel-button"
        onClick={onCancel}
        disabled={paymentLoading}
      >
        Cancel
      </button>
    </div>
  );
}

export default ActionButtons;
