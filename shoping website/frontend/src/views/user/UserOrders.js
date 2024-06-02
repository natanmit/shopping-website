/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import DataTable from 'react-data-table-component';
import { useEffect } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Archive, ChevronDown, MoreVertical } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderAPI";
import { getDateFormat } from "../../utils/Utils";

const UserOrders = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: myorderData, isLoading, refetch } = useGetMyOrdersQuery();
    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderImage = (row) => {
        if (row.product?.productImg) {
            return <img src={row.product?.productImg} alt="product" className="img-fluid p-2" style={{ height: '60px', width: 'auto' }} />;
        }
        return (<></>);
    };

    const columns = [
        {
            name: '',
            selector: (row) => renderImage(row),
        },
        {
            name: 'Order Number',
            selector: row => row.orderNumber,
            sortable: true
        },
        {
            name: 'Product Name',
            selector: row => row.product?.name,
            sortable: true
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true
        },
        {
            name: 'Total Price',
            selector: row => row.totalPrice,
            sortable: true
        },
        {
            name: 'Order Date',
            selector: row => getDateFormat(row.createdAt),
            sortable: true
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => (
                <>
                    <UncontrolledDropdown>
                        <DropdownToggle tag="div" className="btn btn-sm">
                            <MoreVertical size={14} className="cursor-pointer action-btn" />
                        </DropdownToggle>
                        <DropdownMenu end container="body">
                            <DropdownItem className="w-100" onClick={() => navigate(`/user-orders/view/${row._id}`)}>
                                <Archive size={14} className="mr-50" />
                                <span className="align-middle mx-2">View</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
        },
    ];

    return (
        <>
            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="main-board">
                    <Container>
                        <Row className="my-1">
                            <Col>
                                <h4 className="my-3">My Orders</h4>
                            </Col>
                        </Row>
                        <DataTable
                            title="MyOrders"
                            data={myorderData}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                        />
                    </Container>
                </div>
            )}
        </>
    );
};

export default UserOrders;
