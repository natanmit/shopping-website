/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import productImg from "../../assets/img/product.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery, useManageFavouriteMutation } from "../../redux/api/productAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateCartMutation } from "../../redux/api/cartAPI";
import { toast } from 'react-toastify';
import { Heart, ShoppingCart } from "react-feather";

const ProductItem = () => {
    const { id } = useParams();
    const { data: item, refetch: refetchProduct, isLoading } = useGetProductQuery(id);
    const [quantity, setQuantity] = useState(1);
    const [isFavorited, setIsFavorited] = useState();
    const [createCart, { isLoading: cartIsLoading, isSuccess, error, isError, data }] = useCreateCartMutation();
    const [manageFavourite, { isLoading: heartIsLoading, isSuccess: heartSuccess, error: heartError, isError: heartIsError, data: heartData }] = useManageFavouriteMutation();
    const navigate = useNavigate();
    const handleCart = () => {
        const data = {
            'quantity': quantity,
            'product': id,
        }
        createCart(data);
    }

    useEffect(() => {
        refetchProduct();
    }, []);

    useEffect(() => {
        if (item) {
            setIsFavorited(item.isFavorited);
        }
    }, [item]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/dashboard');
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
    }, [cartIsLoading]);

    useEffect(() => {
        if (heartSuccess) {
            toast.success(data?.message);
        }

        if (heartIsError) {
            if (heartSuccess && heartData?.message) {
                toast.success(heartData.message);
            } else if (heartIsError && heartError?.data) {
                const errorMessage = typeof heartError.data === 'string' ? heartError.data : heartError.data?.message;
                toast.error(errorMessage || 'An unknown error occurred', {
                    position: 'top-right',
                });
            }
        }
    }, [heartIsLoading]);

    const handleDecrement = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleFavourite = () => {
        const favouriteData = {
            productId: id
        };
        manageFavourite(favouriteData).then(() => {
            // Update the local isFavorited state to reflect the new status
            setIsFavorited(!isFavorited);
            // Optionally, you may want to refetch product data to get the updated favorites
            refetchProduct();
        });
    }

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-board">
                    <Container>
                        <Row className="mb-3">
                            <Col>
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Go back</button>
                            </Col>
                        </Row>
                        <Card>
                            <CardBody>
                                <Row className="my-3">
                                    <Col md={4} className="d-flex justify-content-center align-items-center">
                                        <img
                                            id="product-preview"
                                            src={item.productImg || productImg}
                                            alt="Product"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-3">
                                            <h4 style={{ color: '#343a40' }}>{item.name}</h4>
                                        </div>

                                        <div className="card-text mb-3">
                                            {item.stock > 0 ? (
                                                <span className="text-success">Available - In stock</span>
                                            ) : (
                                                <span className="text-danger">Unavailable - Out of stock</span>
                                            )}
                                        </div>

                                        <div className="card-text mb-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            Price: <span style={{ color: '#f57c00' }}>${item.price}</span>
                                        </div>

                                        <div className="card-text mb-3">
                                            Stock: <span style={{ color: item.stock > 0 ? '#28a745' : '#dc3545' }}>{item.stock}</span>
                                        </div>

                                        <p className="card-text mb-3" style={{ color: '#6c757d' }}>
                                            {item.detail}
                                        </p>

                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <button
                                                    className="custom-add-to-cart-button"
                                                    disabled={item.stock === 0}
                                                    onClick={handleCart}
                                                >
                                                    <ShoppingCart size={22} />
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className="custom-favourite-button"
                                                    disabled={item.stock === 0}
                                                    onClick={handleFavourite}
                                                >
                                                    <Heart size={22} fill={isFavorited ? 'red' : 'white'} stroke={isFavorited ? 'red' : 'black'} />
                                                    Favourite
                                                </button>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <button
                                                            className="btn btn-outline-secondary btn-minus"
                                                            type="button"
                                                            onClick={handleDecrement}
                                                            disabled={quantity <= 0}
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="form-control quantity text-center"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                                        disabled={item.stock === 0}
                                                    />
                                                    <div className="input-group-append">
                                                        <button
                                                            className="btn btn-outline-secondary btn-plus"
                                                            type="button"
                                                            onClick={handleIncrement}
                                                            disabled={quantity >= item.stock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Container>
                </div>
            )}
        </>


    )
}

export default ProductItem;