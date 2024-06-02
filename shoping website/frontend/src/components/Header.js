/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Badge } from "reactstrap";
import { useAppSelector } from "../redux/store";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import logoImg from '../assets/img/logo.png';
import cartImg from '../assets/img/cart.png';
import userImg from '../assets/img/user.png';
import { useLogoutUserMutation } from "../redux/api/authAPI";

const Header = () => {
    const user = useAppSelector(state => state.userState.user);
    const mycarts = useAppSelector(state => state.cartState.cart);
    const [isOpen, setIsOpen] = useState(false); // Initial state set to false without type annotation
    const [logoutUser, { isLoading, isSuccess, error, isError, data }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            if (isError) {
                if (isSuccess && data?.message) {
                    toast.success(data.message);
                } else if (isError && error?.data) {
                    const errorMessage = typeof error.data === 'string' ? error.data : error.data?.message;
                    toast.error(errorMessage || 'An unknown error occurred', {
                        position: 'top-right',
                    });
                }
            }
        }
    }, [isLoading]);

    const onLogoutHandler = async () => {
        await logoutUser();
    };

    return (
        <header>
            <Container>
                <Navbar expand="md">
                    <NavbarBrand
                        href={
                            user ? user?.role === 'admin' ? '/admin/products' : '/dashboard' : '/'
                        }>
                        <img
                            src={logoImg}
                            alt="Shop"
                            className="logo-image"
                        />
                        <span style={{ color: '#fff', marginLeft: '10px' }}>Shop</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto custom-toggler" />
                    <Collapse isOpen={isOpen} navbar>
                        {!user && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => { navigate('/register') }}>
                                            <button className="btn btn-danger auth-btn">Register</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive w-100">
                                        <NavLink onClick={() => { navigate('/login') }}>
                                            <button className="btn btn-light auth-btn">Login</button>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </>
                        )}
                        {user && user?.role === 'user' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/user-orders')}>
                                            Orders
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/user-favorites')}>
                                            Favorite
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/user-cart')}>
                                            <div style={{ position: 'relative' }}>
                                                <img src={cartImg} alt="Cart" className="user-img" />
                                                {mycarts.length > 0 && (
                                                    <Badge color="danger" className="badge-up" pill>
                                                        {mycarts.length}
                                                    </Badge>
                                                )}
                                            </div>
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret className="dropdown-toggle">
                                            <img src={user?.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end className="dropdown-menu-animate">
                                            <DropdownItem tag={Link} to="/profile" className="dropdown-item-custom">
                                                <span className="align-middle">Profile</span>
                                            </DropdownItem>
                                            <DropdownItem onClick={onLogoutHandler} className="dropdown-item-custom">
                                                Logout
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                        {user && user?.role === 'admin' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/admin/products')}>
                                            Products
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                    </Collapse>
                </Navbar>
            </Container>
        </header>
    );
}

export default Header;
