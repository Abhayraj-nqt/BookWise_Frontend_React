import React from "react";
import { render, screen } from '../../test-utils'
import Sidebar from "./Sidebar";
import { adminSidebarLinks } from "../../libs/constants";

jest.mock('../button/Button', () => ({ onClick, children }) => (
    <button onClick={onClick}>{children}</button>
));

describe('Sidebar component', () => { 
    test('renders Dashboard link correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const dashboardLinks = screen.getAllByRole('link', {
            name: /dashboard/i
        })

        dashboardLinks.forEach(link => expect(link).toBeInTheDocument());
    })

    test('renders Category link correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const categoryLinks = screen.getAllByRole('link', {
            name: /category/i
        })

        categoryLinks.forEach(link => expect(link).toBeInTheDocument());
    })

    test('renders Book link correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const bookLinks = screen.getAllByRole('link', {
            name: /book/i
        })

        bookLinks.forEach(link => expect(link).toBeInTheDocument());
    })

    test('renders User link correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const userLinks = screen.getAllByRole('link', {
            name: /user/i
        })

        userLinks.forEach(link => expect(link).toBeInTheDocument());
    })

    test('renders Issuance link correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const issuanceLinks = screen.getAllByRole('link', {
            name: /issuance/i
        })

        issuanceLinks.forEach(link => expect(link).toBeInTheDocument());
    })

    test('renders Logout button correctly', () => {
        render(<Sidebar sidebarLinks={adminSidebarLinks} />)
        const logoutButton = screen.getByRole('button', {
            name: /logout/i
        })

        expect(logoutButton).toBeInTheDocument();
    })

})