import Icon from "./Icon";

export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name="clipboard" />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
