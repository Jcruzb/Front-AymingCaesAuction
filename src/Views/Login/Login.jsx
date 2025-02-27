import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginMail as loginRequest } from '../../Services/AuthService';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../Contexts/AuthContext';
import { Alert, Box, Button, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';

const Login = () => {
    const { login, user } = useAuthContext();
    const navigate = useNavigate();

    const [method, setMethod] = useState('email');
    const formik = useFormik({
        initialValues: {
            email: 'jccruz@ayming.com',
            password: '12345678',
            phoneNumber: 111111,
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('debe ingresar un correo válido')
                .max(50)
                .required('Email is required'),
            password: Yup
                .string()
                .min(8, 'Must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: (values, helpers) => {
            loginRequest(values)
                .then((res) => {
                    login(res.accessToken, () => navigate('/home'))
                })
                .catch((err) => {
                    helpers.setStatus({ success: false });
                    console.log(err);
                    helpers.setErrors({ submit: err.response.data.message });
                    helpers.setSubmitting(false);
                })
        }
    })

    const handleMethodChange = useCallback(
        (event, value) => {
            setMethod(value);
        },
        []
    );
    return (
        user ? (
            <Navigate to="/home"/>
        ) : (
            <>
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        flex: '1 1 auto',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 550,
                            px: 3,
                            py: '100px',
                            width: '100%'
                        }}
                    >
                        <div>
                            <Stack
                                spacing={1}
                                sx={{ mb: 3 }}
                            >
                                <Typography variant="h4">
                                    Login
                                </Typography>
                            </Stack>
                            <Tabs
                                onChange={handleMethodChange}
                                sx={{ mb: 3 }}
                                value={method}
                            >
                                <Tab
                                    label="Email"
                                    value="email"
                                />

                            </Tabs>
                            {method === 'email' && (
                                <form
                                    noValidate
                                    onSubmit={formik.handleSubmit}
                                >
                                    <Stack spacing={3}>
                                        <TextField
                                            error={!!(formik.touched.email && formik.errors.email)}
                                            fullWidth
                                            helperText={formik.touched.email && formik.errors.email}
                                            label="Email"
                                            name="email"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="email"
                                            value={formik.values.email}
                                        />
                                        <TextField
                                            error={!!(formik.touched.password && formik.errors.password)}
                                            fullWidth
                                            helperText={formik.touched.password && formik.errors.password}
                                            label="Contraseña"
                                            name="password"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="password"
                                            value={formik.values.password}
                                        />
                                    </Stack>
                                    {formik.errors.submit && (
                                        <Typography
                                            color="error"
                                            sx={{ mt: 3 }}
                                            variant="body2"
                                        >
                                            {formik.errors.submit}
                                        </Typography>
                                    )}
                                    <Button
                                        fullWidth
                                        size="large"
                                        sx={{ mt: 3 }}
                                        type="submit"
                                        variant="contained"
                                    >
                                        Continue
                                    </Button>
                                </form>
                            )}
                            <Alert severity="info">
                                <div>
                                    si no tiene cuenta contacte al administrador al correo <b>jccruz@ayming.com</b>
                                </div>
                            </Alert>
                        </div>
                    </Box>
                </Box>
            </>
        )
    );
};


export default Login;
