import ProductCard from './ProductCard.jsx';

export default function ProductList({products}) {
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);

    return (
        <div className="grid grid-cols-1 landscape:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shuffledProducts.map(product => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}
