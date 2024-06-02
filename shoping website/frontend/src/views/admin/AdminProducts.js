/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import DataTable from 'react-data-table-component';
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productAPI";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: productData, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct, { isLoading: deleteLoading, isSuccess: deleteSuccess, error, isError, data }] = useDeleteProductMutation();
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderImage = (row) => {
        if (row.productImg) {
            return <img src={row.productImg} alt="product" className="img-fluid p-2" style={{ height: '60px', width: 'auto' }} />;
        }
        return (<></>);
    };

    useEffect(() => {
        if (deleteSuccess) {
            toast.success(data?.message);
            navigate('/admin/products');
        }

        if (isError) {
            if (deleteSuccess && data?.message) {
                toast.success(data.message);
            } else if (isError && error?.data) {
                const errorMessage = typeof error.data === 'string' ? error.data : error.data?.message;
                toast.error(errorMessage || 'An unknown error occurred', {
                    position: 'top-right',
                });
            }
        }
    }, [deleteLoading]);

    const handleDeleteProduct = (id) => {
        deleteProduct(id);
        setModalVisibility(false);
    };

    const columns = [
        {
            name: '',
            selector: (row) => renderImage(row),
        },
        {
            name: 'Title',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.stock,
            sortable: true
        },
        {
            name: 'Price',
            selector: row => row.price,
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/admin/products/update-product/${row._id}`)}>
                                <Archive size={14} className="mr-50" />
                                <span className="align-middle mx-2">Edit</span>
                            </DropdownItem>
                            <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                                <Trash2 size={14} className="mr-50" />
                                <span className="align-middle mx-2">Delete</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                        <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
                        <ModalBody>Are you sure you want to delete?</ModalBody>
                        <ModalFooter className="justify-content-start">
                            <Button color="danger" onClick={() => handleDeleteProduct(row._id)}>
                                Yes
                            </Button>
                            <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                                No
                            </Button>
                        </ModalFooter>
                    </Modal>
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
                        <Row className="mb-2">
                            <Col>
                                <a href="/admin/products/create-product" className="btn btn-secondary btn-sm">Create Product</a>
                            </Col>
                        </Row>
                        <DataTable
                            title="Products"
                            data={productData.products}
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

export default AdminProducts;
