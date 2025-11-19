import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { ChatMessage } from "./components/ChatMessage";
import { ContactSidebar } from "./components/ContactSidebar";
import useAxios from "./hooks/useAxios";
import { pusherClient } from "./pusher";

export default function App() {
  const contactsApi = useAxios();
  const messagesApi = useAxios();
  const sendMsgApi = useAxios();

  const senderName = "Danish Ikram";

  const [sender, setSender] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const channel = pusherClient.subscribe("adored-sage-858");

    const handler = (data) => {
      console.log("New message event:", data);

      setMessages((prev) => [...prev, data]);
    };

    channel.bind("new-message", handler);

    return () => {
      channel.unbind("new-message", handler);
      pusherClient.unsubscribe("chat-channel");
    };
  }, []);

  useEffect(() => {
    if (contactsApi.response) {
      setContacts(filterConstacts(contactsApi.response));
      setActiveContact(contactsApi.response[0]);
      setSender(findSender(contactsApi.response));
    }
  }, [contactsApi.response]);

  useEffect(() => {
    if (messagesApi.response) {
      setMessages(messagesApi.response);
    }
  }, [messagesApi.response]);

  useEffect(() => {
    contactsApi.fetchData({ url: "api/chats", method: "GET" });
  }, []);

  useEffect(() => {
    if (activeContact !== null) {
      messagesApi.fetchData({
        url: "api/messages",
        method: "POST",
        data: { chat: activeContact, sender },
      });
    }
  }, [activeContact]);

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const data = {
      sender,
      contact: activeContact,
      message: inputMessage,
    };

    sendMsgApi.fetchData({ url: "api/send", method: "POST", data });

    // const newMessage = {
    //   id: messages.length + 1,
    //   text: inputMessage,
    //   sender: "user",
    //   timestamp: new Date(),
    // };

    // setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  const findSender = (contacts) => {
    return contacts.find((contact) => contact.name === senderName);
  };

  const filterConstacts = (contacts) => {
    return contacts;
    // return contacts.filter((contact) => contact.name !== senderName);
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      {/* Header */}
      <Row className="bg-primary text-white m-0">
        <Col className="py-3 px-4">
          <h4 className="mb-0">Chat Application ({senderName})</h4>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="flex-grow-1 m-0 overflow-hidden">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3} className="p-0 h-100 d-none d-md-block">
          <ContactSidebar
            contacts={contacts}
            activeContact={activeContact}
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
