/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardBody, Col, Container, Form, Label, Row } from "reactstrap";
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import uploadImg from "../../assets/img/product.png";
import { useEffect, useState } from "react";
import { useCreateProductMutation, useUploadProductImgMutation } from "../../redux/api/productAPI";
import { useNavigate } from "react-router-dom";

const AdminProductCreate = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [productFile, setProductFile] = useState(null);
    const [uploadProductImg] = useUploadProductImgMutation();
    const [createProduct, { isLoading, isSuccess, error, isError, data }] = useCreateProductMutation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        if (productFile) {
            data.productImg = productFile;
        }
        createProduct(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/admin/products');
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
    }, [isLoading]);

    const handleImageChange = async (e) => {
        e.preventDefault();

        // Check if files array is present and has at least one file.
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Ensure that the file is of File or Blob type (File inherits from Blob).
            if (file instanceof Blob) {
                let reader = new FileReader();

                reader.onloadend = () => {
                    // Assuming setImagePreviewUrl is a function that sets the state
                    // Make sure this function is correctly defined in your component
                    setImagePreviewUrl(reader.result);
                };

                reader.readAsDataURL(file);
                try {
                    const uploadResult = await uploadProductImg({ productFile: file }).unwrap();
                    setProductFile(uploadResult.imageUri)
                } catch (error) {
                    // Handle the error case here
                    console.error('An error occurred during image upload:', error);
                }
            } else {
                // Handle the error case where the file is not a Blob
                console.error('The provided file is not of type Blob.');
            }
        } else {
            // Handle the case where no file was selected
            console.error('No file selected.');
        }
    };


    return (
        <div className="main-board">
            <Container>
                <Row className="mb-2">
                    <Col>
                        <h3>Create Product</h3>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="my-3">
                                <Col md="5" className="d-flex justify-content-center">
                                    <div className="mb-3">
                                        <Label>Product Image</Label>
                                        <input
                                            type="file"
                                            id="productImg"
                                            className="form-control"
                                            name="productImg"
                                            onChange={handleImageChange}
                                            accept=".png, .jpg, .jpeg"
                                            style={{ display: 'none' }} // hide the input
                                        />
                                        <label htmlFor="productImg" className="d-flex" style={{ cursor: 'pointer' }}>
                                            <img
                                                id="product-preview"
                                                src={imagePreviewUrl ? imagePreviewUrl : uploadImg}
                                                alt="Preview"
                                                width="200px"
                                                height="200px"
                                            />
                                        </label>
                                    </div>
                                </Col>
                                <Col md="7">
                                    <div className='mb-2'>
                                        <Label>Product Name</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                            type="text"
                                            id="name"
                                            {...register('name', { required: true })}
                                        />
                                        {errors.name && <small className="text-danger">Product Name is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Product Detail</Label>
                                        <textarea
                                            className={`form-control ${classnames({ 'is-invalid': errors.detail })}`}
                                            id="password"
                                            {...register('detail', { required: true })}
                                        ></textarea>
                                        {errors.detail && <small className="text-danger">Product Detail is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Product Stock</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.stock })}`}
                                            type="number"
                                            id="stock"
                                            {...register('stock', { required: true })}
                                        />
                                        {errors.stock && <small className="text-danger">Product Stock is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Product Price</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.price })}`}
                                            type="number"
                                            id="password"
                                            {...register('price', { required: true })}
                                        />
                                        {errors.price && <small className="text-danger">Product Price is required.</small>}
                                    </div>
                                    <div className="mt-4">
                                        <Button color="primary" className="btn-block" type="submit">
                                            Submit
                                        </Button>
                                    </div>

                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default AdminProductCreate;