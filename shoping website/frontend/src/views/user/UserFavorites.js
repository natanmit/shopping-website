/* eslint-disable react-hooks/exhaustive-deps */
import { Container, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from "reactstrap";
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDeleteFavoriteMutation, useGetFavoritesQuery } from "../../redux/api/favoriteAPI";

const UserFavorites = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: favoriteData, isLoading, refetch } = useGetFavoritesQuery();
    const [deleteProduct, { isLoading: deleteLoading, isSuccess: deleteSuccess, error, isError, data }] = useDeleteFavoriteMutation();
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderImage = (row) => {
        if (row.product?.productImg) {
            return <img src={row.product?.productImg} alt="product" className="img-fluid p-2" style={{ height: '60px', width: 'auto' }} />;
        }
        return (<></>);
    };

    useEffect(() => {
        if (deleteSuccess) {
            toast.success(data?.message);
            navigate('/user-favorites');
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
            selector: row => row.product?.name,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.product?.stock,
            sortable: true
        },
        {
            name: 'Price',
            selector: row => row.product?.price,
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
                        <Row className="my-1">
                            <Col>
                                <h4 className="my-3">My Favorites</h4>
                            </Col>
                        </Row>
                        <DataTable
                            title="User Favorites"
                            data={favoriteData}
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

export default UserFavorites;
