// src/Views/Projects/BidForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Stack, Typography } from '@mui/material';

const BidForm = ({ onBidSubmit, minBid }) => {
  const formik = useFormik({
    initialValues: {
      bidAmount: '',
    },
    validationSchema: Yup.object({
      bidAmount: Yup.number()
        .typeError('Debe ser un número')
        .positive('El monto debe ser positivo')
        .required('El monto de la puja es obligatorio')
        .min(minBid, `El monto de la puja debe ser mayor o igual a ${minBid} €`)


    }),
    onSubmit: (values, { setSubmitting }) => {
      onBidSubmit(values.bidAmount);
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label={`Monto de mínimo la Puja: ${minBid} (€/MWh)`}
          name="bidAmount"
          type="number"
          value={formik.values.bidAmount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
          helperText={formik.touched.bidAmount && formik.errors.bidAmount}
        />
        {formik.errors.submit && (
          <Typography color="error" variant="body2">
            {formik.errors.submit}
          </Typography>
        )}
        <Button type="submit" variant="contained">
          Subastar
        </Button>
      </Stack>
    </form>
  );
};

export default BidForm;