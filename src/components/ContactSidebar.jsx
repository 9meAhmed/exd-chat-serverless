import { ListGroup, Form, Badge } from "react-bootstrap";

export function ContactSidebar({ contacts, activeContactId, onSelectContact }) {
  return (
    <div className="h-100 d-flex flex-column border-end">
      {/* Search */}
      <div className="p-3 border-bottom">
        <Form.Control
          type="search"
          placeholder="Search contacts..."
          size="sm"
        />
      </div>

      {/* Contacts List */}
      <div className="flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {contacts.map((contact) => (
            <ListGroup.Item
              key={contact.id}
              action
              active={contact.id === activeContactId}
              onClick={() => onSelectContact(contact.id)}
              className="border-0 px-3 py-3"
            >
              <div className="d-flex align-items-start">
                {/* Avatar */}
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0 position-relative"
                  style={{ width: "48px", height: "48px" }}
                >
                  <span>{contact.name.charAt(0)}</span>
                  {contact.online && (
                    <span
                      className="position-absolute bg-success rounded-circle border border-2 border-white"
                      style={{
                        width: "12px",
                        height: "12px",
                        bottom: "2px",
                        right: "2px",
                      }}
                    />
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 text-truncate">{contact.name}</h6>
                    <small className="text-muted ms-2 flex-shrink-0">
                      {contact.timestamp}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0 text-muted text-truncate small">
                      {contact.lastMessage}
                    </p>
                    {contact.unread && contact.unread > 0 && (
                      <Badge bg="primary" pill className="ms-2">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
