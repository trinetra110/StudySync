import Icon from "./Icon";

export default function ConfirmModal({
  eyebrow,
  title,
  icon = "check",
  children,
  confirmLabel,
  confirmClassName = "",
  onConfirm,
  cancelLabel = "Go back",
  onCancel,
}) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <button className="modal-close" onClick={onCancel} aria-label="Close">
          ×
        </button>
        <div className="modal-icon">
          <Icon name={icon} />
        </div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {children}
        <button
          className={`confirm-button ${confirmClassName}`}
          onClick={onConfirm}
        >
          {confirmLabel} <Icon name="check" />
        </button>
        <button className="cancel-button" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
