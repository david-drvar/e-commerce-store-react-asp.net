import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";


export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      //fetch('https://localhost:5001/api/products').then(response => response.json()).then(data => setProducts(data))

      agent.Catalog.list().then(products => setProducts(products))
    }, [])
  

  
    return (
        <>
            <ProductList products={products} />
        </>
    )
}