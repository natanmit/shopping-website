/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useGetOrderQuery } from "../../redux/api/orderAPI";
import { useEffect } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { getDateFormat } from "../../utils/Utils";

const OrderView = () => {
    const { id } = useParams();
    const { data: orderItem, isLoading, refetch } = useGetOrderQuery(id);
    const navigate = useNavigate();
    useEffect(() => {
        refetch();
    }, []);

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-board">
                    <Container>
                        <Row className="mb-1">
                            <Col>
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Go back</button>
                            </Col>
                        </Row>
                        <Row className="my-1">
                            <Col>
                                <h4 className="my-2">Order Number #{orderItem.orderNumber}</h4>
                            </Col>
                        </Row>
                        <Card>
                            <CardBody className="m-3">
                                <Row>
                                    <Col md={3} className="d-flex justify-content-center align-items-center">
                                        <div>
                                            <img src={orderItem.product?.productImg} alt="product" className="img-thumbnail" />
                                        </div>
                                    </Col>
                                    <Col md={9} className="order-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Date Issued:</span>
                                            {' '}
                                            {getDateFormat(orderItem.createdAt)}
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Shipping Address:</span>
                                            {' '}
                                            {orderItem.user?.address}
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Contact:</span>
                                            {' '}
                                            {orderItem.user?.phone}
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Total Price:</span>
                                            {' $'}
                                            {orderItem.totalPrice.toFixed(2)}
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">To:</span>
                                            {' '}
                                            {`${orderItem.user?.firstname} ${orderItem.user?.lastname}`}
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Product:</span>
                                            {' '}
                                            {orderItem.product?.name}
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

export default OrderView;