import React from "react";
import Contact from "./Contact";
import Spinner from "../Spinner";
import { CURRENTLINE, ORANGE, PINK } from "../../helpers/colors";
import { Link } from "react-router-dom";

const Contacts = ({ contacts, loading, confirm }) => {
  return (
    <React.Fragment>
      <section className="container">
        <div className="grid">
          <div className="row">
            <div className="col">
              <p className="h3">
                <Link
                  to={"/contacts/add"}
                  className="btn mx-2"
                  style={{ backgroundColor: PINK }}
                >
                  Create new contact
                  <i className="fa fa-plus-circle"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <Spinner />
      ) : (
        <section className="container">
          <div className="row">
            {contacts.length > 0 ? (
              contacts.map((c) => (
                <Contact
                  key={c._id}
                  confirm={() => confirm(c._id, c.fullname)}
                  contact={c}
                />
              ))
            ) : (
              <div
                className="text-center py-5"
                style={{ backgroundColor: CURRENTLINE }}
              >
                <p className="h3" style={{ color: ORANGE }}>
                  Contact not found
                </p>
                <img
                  className="w-25"
                  src={require("../../assets/no-found.gif")}
                  alt=""
                />
              </div>
            )}
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

export default Contacts;
