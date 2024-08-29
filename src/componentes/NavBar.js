import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaBars } from "react-icons/fa";
import { MdOutgoingMail } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const NavBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  if (location.pathname === '/') {
    return <>{children}</>; // Return only the children component if on login page
  }
  const confirDelete = () => {
    MySwal.fire({
      title: "Cierre de sesión",
      text: "¿Esta usted seguro que desea cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'login.js';   
      }
    });
  }
  const menuItems = [
    {
      path: "/Show",
      name: "Pagina Principal",
      icon: <FaHome />
    },
    {
      path: "https://mail.google.com/mail/u/0/#inbox?authuser=tombsiteapp@gmail.comhttps://accounts.google.com/signin/v2/identifier?continue=https://mail.google.com/mail/&scc=1&service=mail&ltmpl=default&hl=en&email=tombsiteapp@gmail.com",
      name: "Ir a Gmail",
      icon: <MdOutgoingMail />,
      target: "_blank",
      rel: "noopener noreferrer"
    },
    {
      path: "/Create",
      name: "Añadir Registro",
      icon: <IoMdPersonAdd />
    },
    {
      path: "/",
      name: "Cerrar Sesión",
      icon: <FaSignOutAlt />,
      onClick: () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
          // Clear login fields
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
          // Perform any other necessary actions, such as logging out the user
        }
      }
    }
  ];

  return (
    <div className='container'>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className='top_section'>
                   
          <div className='bars'>
            <FaBars onClick={toggle} />
          </div>
        </div>
        {
          menuItems.map((item, index) => (
            item.path.startsWith('http') ? (
              <a href={item.path} target="_blank" rel="noopener noreferrer" key={index} className="link">
                <div className='icon'>{item.icon}</div>
                <div style={{ display: isOpen ? "block" : "none" }} className='link_text'>{item.name}</div>
              </a>
            ) : (
              <NavLink to={item.path} key={index} className="link" activeClassName="active">
                <div className='icon'>{item.icon}</div>
                <div style={{ display: isOpen ? "block" : "none" }} className='link_text'>{item.name}</div>
              </NavLink>
            )
          ))
        }
      </div>
      <main>
        {children}
      </main>
    </div>
  );
};
export default NavBar;