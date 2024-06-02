/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, FormGroup, Label } from "reactstrap";
import classnames from 'classnames';
import loginImg from '../../assets/img/login.png';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/api/authAPI";
import { useEffect } from "react";
import { getHomeRouteForLoggedInUser, getUserData } from "../../utils/Utils";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loginUser, { isLoading, isError, error, isSuccess, data }] = useLoginUserMutation();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            const user = getUserData();
            toast.success('You successfully logged in');
            navigate(getHomeRouteForLoggedInUser(user.role))
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

    return (
        <div className="auth-wrapper auth-cover">
            <div className="auth-inner row m-0">
                <div className="d-none d-lg-flex col-lg-8 align-items-center p-5">
                    <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                        <img className="img-fluid" src={loginImg} alt="Login" />
                    </div>
                </div>
                <div className="d-flex col-lg-4 align-items-center auth-bg px-2 p-lg-5">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                        <h2 className="fw-bold mb-3" style={{ fontSize: '28px' }}>Welcome to our Website!</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <span className="text-danger">
                                    <small>Email is required.</small></span>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <span className="text-danger"><small> Password is required</small></span>}
                            </FormGroup>

                            <div className="mt-4">
                                <Button color="primary" className="btn-block w-100" type="submit">
                                    Submit
                                </Button>
                            </div>
                            <div className="mt-4 text-center">
                                <p>
                                    Not a member? {' '}
                                    <Link to="/register" className="primary-link">
                                        <span>Register</span>
                                    </Link>{' '}
                                </p>
                            </div>
                        </Form>
                    </div>
                </div>

            </div >
        </div >
    )
}

export default Login;