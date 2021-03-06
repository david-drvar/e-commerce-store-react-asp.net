import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { removeItem, setBasket } from "./basketSlice";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {
  const { basket } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState({
    name: '',
    loading: false
  })

  function handleAddItem(productId: number, name: string) {
    setStatus({
      loading: true,
      name
    });
    agent.Basket.addItem(productId).then(basket => dispatch(setBasket(basket))).catch(err => console.log(err)).finally(() => setStatus({ loading: false, name: '' }));
  }

  function handleRemoveItem(productId: number, quantity: number, name: string) {
    setStatus({
      loading: true,
      name
    });
    agent.Basket.removeItem(productId, quantity).then(() => dispatch(removeItem({productId, quantity}))).catch(err => console.log(err)).finally(() => setStatus({ loading: false, name: '' }));
  }

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>

  return (
    <>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map(item => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display='flex' alignItems='center'>
                    <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                <TableCell align="center">
                  <LoadingButton color='error' loading={status.loading && status.name === 'rem' + item.productId} onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)}>
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton color='secondary' loading={status.loading && status.name === 'add' + item.productId} onClick={() => handleAddItem(item.productId, 'add' + item.productId)}>
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                <TableCell align="right">
                  <LoadingButton color='error' loading={status.loading && status.name === 'remAll' + item.productId} onClick={() => handleRemoveItem(item.productId, item.quantity, 'remAll' + item.productId)}>
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button component={Link} to='/checkout' variant='contained' size='large' fullWidth>Checkout</Button>
        </Grid>
      </Grid>
    </>
  )
}