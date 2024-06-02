/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, Row } from "reactstrap";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { useCheckoutCartMutation, useDeleteCartMutation, useGetMyCartsQuery } from "../../redux/api/cartAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Link } from "react-router-dom";
import { Trash2 } from "react-feather";

const UserCart = () => {
    const { data: mycarts, refetch: refetchMyCart, isLoading } = useGetMyCartsQuery();
    const [deleteCart] = useDeleteCartMutation();
    const [checkoutCart, { isLoading: checkoutIsLoading, isSuccess, error, isError, data }] = useCheckoutCartMutation();
    const [cartItems, setCartItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        if (mycarts) {
            setCartItems(mycarts);
        }
        refetchMyCart();
    }, [mycarts, refetchMyCart]);

    const handleQuantityChange = (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCartItems = cartItems.map((item) =>
            item._id === cartId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
    };

    const handleDelete = (cartId) => {
        const updatedCartItems = cartItems.filter((item) => item._id !== cartId);
        setCartItems(updatedCartItems);
        deleteCart(cartId);
    };

    const handleCheckboxChange = (cartId, quantity) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [cartId]: prevState[cartId] ? undefined : quantity // Toggle check/uncheck status
        }));
    };

    const handleCheckout = () => {
        const checkedCartItemsArray = cartItems.filter(cart => checkedItems[cart._id]).map(cart => ({
            cart: cart._id,
            name: cart.product?.name,
            unitPrice: cart.product?.price,
            quantity: parseFloat(cart.quantity),
            totalPrice: parseFloat(cart.quantity) * parseFloat(cart.product?.price),
            product: cart.product?._id,
            user: cart.user?._id,
        }));

        if (checkedCartItemsArray.length > 0) {
            checkoutCart(checkedCartItemsArray);
        } else {
            toast.error('Please select items.', {
                position: 'top-right',
            });
        }

    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            refetchMyCart();
        }
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
    }, [checkoutIsLoading]);
    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-board">
                    <Container>
                        <Row className="my-1">
                            <Col>
                                <h4 className="my-3">My Cart</h4>
                            </Col>
                        </Row>
                        <Row className="my-1">
                            <Col>
                                <div className="d-flex my-2">
                                    <div className="mycart-item">
                                        Item
                                    </div>
                                    <div className="mycart-item">
                                        Item Price
                                    </div>
                                    <div className="mycart-item">
                                        Quantity
                                    </div>
                                    <div className="mycart-item">
                                        Price
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <>
                            {
                                cartItems.length > 0 ? (
                                    cartItems.map((cart, index) => (
                                        <Row key={index}>
                                            <Col xs={12} className="mb-1 mycart-item-detail">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                    {/* Checkbox Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '50px' }}>
                                                        <div className="form-check text-center">
                                                            <input className="form-check-input" type="checkbox" id={`checkbox-${cart._id}`}
                                                                value="" onChange={() => handleCheckboxChange(cart._id, cart.quantity)}
                                                                checked={!!checkedItems[cart._id]} />
                                                        </div>
                                                    </div>

                                                    {/* Product Name Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '120px', fontWeight: '600' }}>
                                                        {cart.product?.name}
                                                    </div>

                                                    {/* Price Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '80px', fontWeight: '600' }}>
                                                        {cart.product?.price?.toFixed(2)}
                                                    </div>

                                                    {/* Quantity Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '150px' }}>
                                                        <div className="cart_quantity_button d-flex justify-content-center align-items-center">
                                                            <button className="cart_quantity_up" onClick={() => handleQuantityChange(cart._id, cart.quantity + 1)}> + </button>
                                                            <input className="cart_quantity_input" type="text" name="quantity" value={cart.quantity} autoComplete="off" size={2} readOnly />
                                                            <button className="cart_quantity_down" onClick={() => handleQuantityChange(cart._id, cart.quantity - 1)}> - </button>
                                                        </div>
                                                    </div>

                                                    {/* Total Price Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '80px', fontWeight: '600' }}>
                                                        {(parseFloat(cart.quantity) * parseFloat(cart.product?.price)).toFixed(2)}
                                                    </div>

                                                    {/* Delete Button Column */}
                                                    <div className="p-2 flex-fill" style={{ minWidth: '80px' }}>
                                                        <button className="cart-delete btn btn-danger btn-sm" onClick={() => handleDelete(cart._id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                                ) : (
                                    <div className="text-center my-4">There is no data</div>
                                )
                            }

                            <div className="d-flex mt-3 justify-content-between">
                                <Link to="/dashboard" className="btn btn-primary btn-sm">Go shopping</Link>
                                {cartItems.length > 0 && (
                                    <button type="button" className="btn btn-success btn-sm" onClick={handleCheckout}>Check out</button>
                                )}
                            </div>
                        </>
                    </Container>
                </div>
            )}
        </>
    )
}

export default UserCart;