/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardBody, Col, Container, Form, Label, Row } from "reactstrap";
import userImg from '../../assets/img/user.png';
import { getMeAPI } from "../../redux/api/getMeAPI";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useDeleteUserMutation, useUpdateUserMutation, useUploadProfileImgMutation } from "../../redux/api/userAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Edit2 } from "react-feather";

const Profile = () => {
    const { data: user, isLoading: userLoading } = getMeAPI.endpoints.getMe.useQuery(null);
    const [uploadProfileImg] = useUploadProfileImgMutation();
    const [deleteUser] = useDeleteUserMutation();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const [updateUser, { isLoading, isSuccess, error, isError, data }] = useUpdateUserMutation();

    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (user) {
            const fields = ['firstname', 'lastname', 'email', 'phone', 'address'];
            fields.forEach((field) => {
                setValue(field, user[field]);
            });
            if (user.avatar) {
                setAvatarFile(user.avatar);
            }
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
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

    const onSubmit = (data) => {
        updateUser(data);
    };

    const handleUserImage = () => {
        const fileInput = document.getElementById('updateUserImage');
        if (fileInput) {
            fileInput.click();
        }
    };

    const manageUserImage = async (e) => {
        const input = e.target;
        const file = input.files ? input.files[0] : undefined;

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    setAvatarFile(result);
                }
            };

            reader.readAsDataURL(file);

            // Assuming uploadProfileAvatar returns a promise with a specific type
            const result = await uploadProfileImg(file);

            const avatarData = result.data.updateAvatar.avatar;
            setAvatarFile(avatarData);
        }
    };

    const handleDeleteUser = async () => {
        await deleteUser(user._id);
        window.location.href = '/login';
    }

    return (
        <div className="main-board">
            {userLoading ? (<FullScreenLoader />) : (
                <Container>
                    <Row className="mb-2">
                        <Col>
                            <h3>Profile</h3>
                        </Col>
                    </Row>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md={4} className="mb-3 d-flex justify-content-center align-items-center">
                                    <div className="position-relative">
                                        <img
                                            src={avatarFile || userImg}
                                            alt="Profile"
                                            className="profile-img"
                                        />
                                        <label htmlFor="updateUserImage" className="position-absolute avatar-style">
                                            <button type="button" className="avatar-button" onClick={handleUserImage}>
                                                <Edit2 size={14} />
                                            </button>
                                        </label>
                                        <input
                                            type="file"
                                            id="updateUserImage"
                                            className="visually-hidden"
                                            onChange={manageUserImage}
                                            accept="image/*"
                                        />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='mb-2'>
                                            <Label>Firstname</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.firstname })}`}
                                                type="text"
                                                id="firstname"
                                                {...register('firstname', { required: true })}
                                            />
                                            {errors.firstname && <small className="text-danger">Firstname is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Lastname</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.lastname })}`}
                                                type="text"
                                                id="lastname"
                                                {...register('lastname', { required: true })}
                                            />
                                            {errors.lastname && <small className="text-danger">Lastname is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Email</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                                type="email"
                                                id="email"
                                                {...register('email', { required: true })}
                                            />
                                            {errors.email && <small className="text-danger">Email is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Phone</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                                type="text"
                                                id="phone"
                                                {...register('phone', {
                                                    required: "Phone is required",
                                                    pattern: {
                                                        value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                                                        message: "Invalid phone number",
                                                    },
                                                })}
                                            />
                                            {errors.phone && <span className="text-danger"><small>{errors.phone.message}</small></span>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Address</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                                                type="address"
                                                id="address"
                                                {...register('address', { required: true })}
                                            />
                                            {errors.address && <small className="text-danger">Address is required.</small>}
                                        </div>
                                        <div className="my-4">
                                            <Button color="success" className="btn-sm btn-block mx-1" type="submit">
                                                Submit
                                            </Button>
                                            <Button color="danger" className="btn-sm btn-block mx-1" type="button" onClick={handleDeleteUser}>
                                                Delete Account
                                            </Button>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>
                </Container>
            )}

        </div>
    )
}

export default Profile;