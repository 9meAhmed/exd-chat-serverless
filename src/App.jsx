import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { ChatMessage } from "./components/ChatMessage";
import { ContactSidebar } from "./components/ContactSidebar";

const sampleContacts = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "Pretty good! Just working on some projects.",
    timestamp: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: "See you tomorrow!",
    timestamp: "1h ago",
    online: true,
  },
  {
    id: 3,
    name: "Mike Wilson",
    lastMessage: "Thanks for your help",
    timestamp: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    lastMessage: "That sounds great!",
    timestamp: "1d ago",
    online: false,
  },
  {
    id: 5,
    name: "David Brown",
    lastMessage: "Let me know when you're free",
    timestamp: "2d ago",
    online: true,
  },
];

const contactMessages = {
  1: [
    {
      id: 1,
      text: "Hey! How are you?",
      sender: "other",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      text: "I'm doing great, thanks! How about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: 3,
      text: "Pretty good! Just working on some projects.",
      sender: "other",
      timestamp: new Date(Date.now() - 180000),
    },
  ],
  2: [
    {
      id: 1,
      text: "Don't forget about the meeting tomorrow",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      text: "Thanks for reminding me!",
      sender: "user",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: 3,
      text: "See you tomorrow!",
      sender: "other",
      timestamp: new Date(Date.now() - 3400000),
    },
  ],
  3: [
    {
      id: 1,
      text: "Can you help me with the project?",
      sender: "other",
      timestamp: new Date(Date.now() - 10800000),
    },
    {
      id: 2,
      text: "Sure, what do you need?",
      sender: "user",
      timestamp: new Date(Date.now() - 10700000),
    },
    {
      id: 3,
      text: "Thanks for your help",
      sender: "other",
      timestamp: new Date(Date.now() - 10600000),
    },
  ],
  4: [
    {
      id: 1,
      text: "Want to grab coffee sometime?",
      sender: "other",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: 2,
      text: "That sounds great!",
      sender: "other",
      timestamp: new Date(Date.now() - 86300000),
    },
  ],
  5: [
    {
      id: 1,
      text: "Let me know when you're free",
      sender: "other",
      timestamp: new Date(Date.now() - 172800000),
    },
  ],
};

export default function App() {
  const [activeContactId, setActiveContactId] = useState(1);
  const [messages, setMessages] = useState(contactMessages[1]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSelectContact = (contactId) => {
    setActiveContactId(contactId);
    setMessages(contactMessages[contactId] || []);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  const activeContact = sampleContacts.find((c) => c.id === activeContactId);

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      {/* Header */}
      <Row className="bg-primary text-white m-0">
        <Col className="py-3 px-4">
          <h4 className="mb-0">Chat Application</h4>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="flex-grow-1 m-0 overflow-hidden">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3} className="p-0 h-100 d-none d-md-block">
          <ContactSidebar
            contacts={sampleContacts}
            activeContactId={activeContactId}
            onSelectContact={handleSelectContact}
          />
        </Col>

        {/* Chat Area */}
        <Col xs={12} md={8} lg={9} className="p-0 h-100 d-flex flex-column">
          {/* Chat Header */}
          <div className="border-bottom p-3 bg-white">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 position-relative"
                style={{ width: "40px", height: "40px" }}
              >
                <span>{activeContact?.name.charAt(0)}</span>
                {activeContact?.online && (
                  <span
                    className="position-absolute bg-success rounded-circle border border-2 border-white"
                    style={{
                      width: "10px",
                      height: "10px",
                      bottom: "2px",
                      right: "2px",
                    }}
                  />
                )}
              </div>
              <div>
                <h6 className="mb-0">{activeContact?.name}</h6>
                <small className="text-muted">
                  {activeContact?.online ? "Online" : "Offline"}
                </small>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-grow-1 overflow-auto p-3"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
          </div>

          {/* Input Area */}
          <div className="border-top p-3 bg-white">
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
