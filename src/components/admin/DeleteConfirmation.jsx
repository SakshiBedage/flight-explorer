import "../../styles/DeleteConfirmation.scss";

function DeleteConfirmation({ flightId, onConfirm, onCancel }) {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete flight {flightId}?</p>
        <div className="confirmation-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
