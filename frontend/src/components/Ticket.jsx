// Ticket.jsx
export default function Ticket({ title, description, status, createdAt }) {
    return (
      <div className="ticket">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>Status: {status}</p>
        <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
      </div>
    );
  }
  