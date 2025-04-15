import {useEffect, useState} from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const URL = "http://localhost:5000"

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${URL}/products`)
                const data = await response.json()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        }

        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}
