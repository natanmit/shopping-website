/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Container, Row } from "reactstrap";
import { Search } from 'react-feather';
import logoImg from '../assets/img/logo.png';
import { useGetHomeProductsQuery, useGetSearchProductMutation } from "../redux/api/homeAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [searchItem, setSearchItem] = useState('');
    const [visibleProductCount, setVisibleProductCount] = useState(8);
    const [productList, setProductList] = useState([]);
    const { data: productData, isLoading, refetch } = useGetHomeProductsQuery();
    const [getSearchProduct] = useGetSearchProductMutation();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (productData && productData.products) {
            setProductList(productData.products);
        }
    }, [productData]);


    const handleSearchChange = (e) => {
        setSearchItem(e.target.value);
    };

    // Event handler for Enter key up in the input field
    const handleKeyUp = async (event) => {
        if (event.key === 'Enter') {
            if (searchItem) {
                const { data } = await getSearchProduct({ searchItem: searchItem })
                setProductList(data);
            } else {
                setProductList(productData.products);
            }
        }
    };

    // Event handler for search button click
    const handleSearchClick = async () => {
        if (searchItem) {
            const { data } = await getSearchProduct({ searchItem: searchItem })
            setProductList(data);
        } else {
            setProductList(productData.products);
        }
    };

    return (
        <div className="board">
            <div className="search-board">
                <Container>
                    <div className="text-center search-board-style">
                        <div className="search-title">
                            Irresistible luxury from head to toe
                        </div>
                        <div className="my-2">
                            <small className="search-subtitle">
                                Rare sneakers, jewelry and bags by the world's leading designers.
                            </small>
                        </div>

                        <div className="search-input-group d-flex justify-content-center mt-3">
                            <input
                                type="text"
                                name="productSearch"
                                autoComplete="off"
                                placeholder="Search Product"
                                className="form-control search-input"
                                value={searchItem}
                                onChange={handleSearchChange}
                                onKeyUp={handleKeyUp}
                            />
                            <button className="btn btn-shop-primary" type="button" style={{ borderRadius: '0px 5px 5px 0px' }} onClick={handleSearchClick}>
                                <Search size={30} />
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
            <div className="product-board mt-5">
                <Container>
                    <Row>
                        {!isLoading && (
                            productList.length > 0 ? (
                                <>
                                    {productList.slice(0, visibleProductCount).map((product, index) => (
                                        <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4 d-flex">
                                            <div className="product-card overflow-hidden flex-fill d-flex flex-column">
                                                <Link to={`/products/review/${product._id}`}>
                                                    <div className="a-section a-spacing-base flex-fill d-flex flex-column">
                                                        <div className="aok-relative text-center s-image-overlay-grey puis-image-overlay-grey s-padding-left-small s-padding-right-small puis-spacing-small" style={{ paddingTop: "0px !important" }}>
                                                            <div className="a-section aok-relative s-image-square-aspect">
                                                                <img className="s-image" src={product.productImg || logoImg} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex-grow-1 d-flex flex-column">
                                                            <div className="product-content flex-fill">
                                                                <h5 className="text-center product-title" style={{ fontWeight: 'bold' }}>{product.name}</h5>
                                                                <p className="text-center product-description">
                                                                    {product.detail.length > 120 ? `${product.detail.substring(0, 100)}...` : product.detail}
                                                                </p>
                                                                <div className="text-center my-1 product-price" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                                                                    <span style={{ fontSize: '1.2rem' }}>${product.price}</span>
                                                                </div>
                                                                <div className="text-center my-1 product-stock">
                                                                    {product.stock > 0 ?
                                                                        (<span style={{ fontSize: '0.9rem', color: '#27ae60', fontWeight: 'bold' }}>In Stock: {product.stock}</span>)
                                                                        : (<span style={{ fontSize: '0.9rem', color: '#e74c3c', fontWeight: 'bold' }}>Out of Stock</span>)
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>

                                            </div>
                                        </Col>
                                    ))}
                                    {productList.length > visibleProductCount && (
                                        <div className="my-3 d-flex justify-content-center">
                                            <Button
                                                color='primary'
                                                size='sm'
                                                className="my-2"
                                                onClick={() => setVisibleProductCount(visibleProductCount + 8)}
                                            >
                                                Load More
                                            </Button>
                                        </div>

                                    )}
                                </>
                            ) : (
                                <Col xs={12} className="text-center">
                                    <div className="empty-product-image">
                                        <img src={logoImg} alt="No Products Found" />
                                    </div>
                                    <p>No products found.</p>
                                </Col>
                            )
                        )}

                    </Row>
                </Container>
            </div>
        </div>

    )
}

export default Home;