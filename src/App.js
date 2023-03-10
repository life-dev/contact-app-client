import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { ContactContext } from "./components/context/contactsContext";
import {
  AddContact,
  Contact,
  Contacts,
  EditContact,
  Navbar,
  SearchContact,
  ViewContact,
} from "./components";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  getAllContacts,
  getAllGroup,
  createContact,
  getAllGroups,
  deleteContact,
} from "./helpers/fetchService";
import "./App.css";
import {
  COMMENT,
  CURRENTLINE,
  FOREGROUND,
  PURPLE,
  YELLOW,
} from "./helpers/colors";

function App() {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredContacts, setFilteredContact] = useState([]);

  const [contact, setContact] = useState({
    fullname: "",
    photo: "",
    mobile: "",
    email: "",
    job: "",
    group: "",
  });

  const [contactQuery, setcontactQuery] = useState({ text: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();

        console.log(groupsData);
        setContacts(contactsData);
        setFilteredContact(contactsData);
        setGroups(groupsData);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const confirmDelete = (contactId, contactFullname) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            dir="ltr"
            style={{
              backgroundColor: CURRENTLINE,
              border: `1px solid ${PURPLE} `,
              borderRadius: "1em",
            }}
            className="p-4"
          >
            <h1 style={{ color: YELLOW }}>Remove contact</h1>
            <p style={{ color: FOREGROUND }}>
              {" "}
              Are you sure to delete {contactFullname} ?{" "}
            </p>
            <button
              onClick={() => {
                removeContact(contactId);
                onClose();
              }}
              className=" btn   mx-2"
              style={{ backgroundColor: PURPLE }}
            >
              Yeah
            </button>
            <button
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: COMMENT }}
            >
              Cancel
            </button>
          </div>
        );
      },
    });
  };

  const removeContact = async (contactId) => {
    try {
      setLoading(true);
      const response = await deleteContact(contactId);
      if (response) {
        const { data: contactsData } = await getAllContacts();
        setContacts(contactsData);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const createContactForm = async (event) => {
    event.preventDefault();
    try {
      const { status } = await createContact(contact);

      if (status == 200) {
        setContact({});

        navigate("/contacts");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onContactChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const contactSearch = (event) => {
    setcontactQuery({ ...contactQuery, text: event.target.value });
    const allContacts = contacts.filter((contact) => {
      return contact.fullname
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setFilteredContact(allContacts);
    console.log(`All ${allContacts}`);
  };

  return (
    <ContactContext.Provider
      value={{
        loading,
        setLoading,
        contact,
        setContact,
        contactQuery,
        contacts,
        filteredContacts,
        groups,
        onContactChange,
        deleteContact: confirmDelete,
        createContact: createContactForm,
        contactSearch,
      }}
    >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" />} />
          <Route
            path="/contacts"
            element={
              <Contacts
                contacts={filteredContacts}
                loading={loading}
                confirm={confirmDelete}
              />
            }
          />
          <Route
            path="/contacts/add"
            element={
              <AddContact
                loading={loading}
                setContactInfo={onContactChange}
                contact={contact}
                groups={groups}
                createContactForm={createContactForm}
              />
            }
          />
          <Route path="/contacts/:contactId" element={<ViewContact />} />
          <Route path="/contacts/edit/:contactId" element={<EditContact />} />
        </Routes>
      </div>
    </ContactContext.Provider>
  );
}

export default App;
