import axios from "axios";
import Ticket from "../components/Ticket"; // Component to display a ticket
import { useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import ScrollToTopButton from "../components/ScrollToTopButton";
import "./Home.css";

export default function IndexPage() {
  const [tickets, setTickets] = useState([]);
  const [searchedTickets, setSearchedTickets] = useState(null); // initialize with null
  const [currentPage, setCurrentPage] = useState(1);

  // pagination
  const ticketsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tickets") 
      .then((response) => {
        setTickets(response.data);
        setSearchedTickets(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const searchTickets = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.trim() === "") {
      setSearchedTickets(tickets);
    } else {
      setSearchedTickets(
        tickets.filter((ticket) => {
          const ticketTags = ticket.tags ? ticket.tags.map((tag) => tag.toLowerCase()) : [];
          return (
            ticket.title.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticketTags.some((tag) => tag.includes(searchTerm))
          );
        })
      );
    }
  };

  // calculate pages count based on searchedTickets
  const pagesCount = searchedTickets ? Math.ceil(searchedTickets.length / ticketsPerPage) : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const ticketsToShow = searchedTickets ? searchedTickets.slice(startIndex, endIndex) : [];

  return (
    <div>
    <div className="main-desc">
      <p>{searchedTickets?.length} Tickets </p>
      <div className="main-filter">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => searchTickets(e)}
        />
      
      </div>
    </div>
  
    <div className="ticket-container">
      {searchedTickets && searchedTickets.length > 0 ? (
        ticketsToShow.map((ticket) => (
          <div className="ticket-card" key={ticket._id}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <div className={`ticket-status ${ticket.status.toLowerCase()}`}>
              {ticket.status}
            </div>
          </div>
        ))
      ) : (
        <p>{searchedTickets === null ? "Loading..." : "No tickets found."}</p>
      )}
    </div>
  
    <div className="pagination">
      {Array.from({ length: pagesCount }, (_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          disabled={currentPage === i + 1}
          className={currentPage === i + 1 ? "active" : ""}>
          {i + 1}
        </button>
      ))}
    </div>
  
    <ScrollToTopButton />
  </div>
  
  );
}
