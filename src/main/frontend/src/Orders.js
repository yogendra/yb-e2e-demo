import * as React from 'react';
import {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import dateFormat from "dateformat";
import {MenuItem, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return {id, date, name, shipTo, paymentMethod, amount};
}

function preventDefault(event) {
  event.preventDefault();
}

const PAYMENT_METHODS = ["AMEX", "JCB", "RUPAY", "MC", "VISA"];
const NEW_ORDER = {
  orderDate:dateFormat(new Date(), "yyyy-mm-dd"),
  name: "",
  shipTo: "",
  paymentMethod: PAYMENT_METHODS[0],
  paymentId: "",
  amount: 0.00
};
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState(NEW_ORDER);

  const refresh = () => {
    fetch("/api/v1/orders")
    .then(res => {
      return res.json()
    })
    .then(orders => {
      setOrders(orders["_embedded"].orders)
    });
  }

  const save = evt => {
    let data = newOrder;
    console.log(newOrder);
    fetch("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(response => {
      setNewOrder(NEW_ORDER);
      setShowForm(false);
      refresh();
    })
    .catch(error => console.error("Error:", error));
  };
  useEffect(() => {
    refresh();
  }, []);

  const handleFormChange = e => {
     let order = {...newOrder};
     order[e.target.name] = e.target.value;
    setNewOrder(order);
  };
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order["_links"].self.href}>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.paymentMethod} ⠀•••• {order.paymentId}</TableCell>
              <TableCell align="right">{`$${order.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {showForm ?
          <TableBody sx={{visibility: showForm ? "visible" : "hidden"}}>

            <TableRow key="_new">
              <TableCell>
                <TextField
                  required
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  onChange={handleFormChange}
                  value={newOrder.orderDate}
                />
              </TableCell>
              <TableCell>
                <TextField
                  required
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleFormChange}
                  value={newOrder.name}
                />
              </TableCell>
              <TableCell>
                <TextField
                  required
                  id="shipTo"
                  name="shipTo"
                  type="text"
                  onChange={handleFormChange}
                  value={newOrder.shipTo}

                />
              </TableCell>
              <TableCell>

                <TextField
                  id="paymentMethod"
                  name="paymentMethod"
                  select
                  variant="outlined"
                  onChange={handleFormChange}
                  value={newOrder.paymentMethod}

                >
                  {PAYMENT_METHODS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  label="Id"
                  sx={{width: 80}}
                  id="paymentId"
                  name="paymentId"
                  type="text"
                  onChange={handleFormChange}
                  value={newOrder.paymentId}
                />
              </TableCell>
              <TableCell>
                <TextField
                  required
                  id="amount"
                  name="amount"
                  type="number"
                  onChange={handleFormChange}
                  value={newOrder.amount}
                />
              </TableCell>
            </TableRow>
          </TableBody>
          : <></>
        }
      </Table>

      <Box
        sx={{
          mt: 2, ml: 2,
          typography: 'body1',
          '& > :not(style) + :not(style)': {
            ml: 2,
          },
        }}
        onClick={preventDefault}
      >
        {showForm ?
          (<>
              <Link href="#" onClick={() => {
                save();
              }}>Save</Link>
              <Link href="#" onClick={() => {
                setNewOrder(NEW_ORDER);
                setShowForm(false);
              }}>Cancel</Link>
            </>
          ) :
          <Link href="#" onClick={() => {
            setShowForm(true);
          }}>+ Insert Order</Link>
        }
        <Link href="#" onClick={refresh}>
          Refresh
        </Link>
      </Box>
    </React.Fragment>
  );
}

function formatDate(d) {
  const date = new Date(d);
  return dateFormat(date, "dd mmm, yyyy")
}
