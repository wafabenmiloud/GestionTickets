import React from 'react'
import './ScrollToTopButton.css'
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      <div>
        {isVisible && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        )}
      </div>
    );
  }
  
