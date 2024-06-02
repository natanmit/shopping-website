/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Label, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import registerImg from '../../assets/img/register.png';
import { useRegisterUserMutation } from '../../redux/api/authAPI';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 👇 Calling the Register Mutation
    const [registerUser, { isLoading, isSuccess, error, isError, data }] = useRegisterUserMutation();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        registerUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/login');
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
                        <img className="img-fluid" src={registerImg} alt="Register" />
                    </div>
                </div>
                <div className="d-flex col-lg-4 align-items-center auth-bg px-2 p-lg-5">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="fw-bold mb-3" style={{ fontSize: '28px' }}>Create your account</h2>
                                <p className="body-2 md-vertical-spacing">
                                    Already have an account?{' '}
                                    <Link to="/login" className="primary-link">
                                        <span>&nbsp;Log in</span>
                                    </Link>{' '}
                                </p>
                            </div>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-2'>
                                <Label>Firstname</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.firstname })}`}
                                    type="text"
                                    id="firstname"
                                    {...register('firstname', { required: true })}
                                />
                                {errors.firstname && <span className="text-danger"><small>Firstname is required</small></span>}
                            </div>
                            <div className='mb-2'>
                                <Label>Lastname</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.lastname })}`}
                                    type="text"
                                    id="lastname"
                                    {...register('lastname', { required: true })}
                                />
                                {errors.lastname && <span className="text-danger"><small>Lastname is required</small></span>}
                            </div>
                            <div className='mb-2'>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <span className="text-danger"><small>Email is required</small></span>}
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
                                    type="text"
                                    id="address"
                                    {...register('address', { required: true })}
                                />
                                {errors.address && <span className="text-danger"><small>Address is required</small></span>}
                            </div>
                            <div className='mb-2'>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <span className="text-danger"><small>Password is required</small></span>}
                            </div>
                            <div className="mt-4">
                                <Button color="primary" className="btn-block w-100" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
