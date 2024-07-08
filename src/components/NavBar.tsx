import React from "react";
import Link from "next/link";
import styled from "styled-components";

const Navbar = () => {
  return (
    <Nav>
      <NavItem>
        <Link href="/">Home</Link>
      </NavItem>
      <NavItem>
        <Link href="/tasks">Tasks</Link>
      </NavItem>
      <NavItem>
        <Link href="/add-task">Add Task</Link>
      </NavItem>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  background-color: #0070f3;
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const NavItem = styled.div`
  margin: 0 15px;

  a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.3s ease;

    &:hover {
      color: #eaeaea;
    }
  }
`;
