import ProductCard from './ProductCard.jsx';

export default function ProductList({products}) {
    // Mezcla aleatoriamente los productos antes de mostrarlos
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);

    return (
        <div className="grid grid-cols-1 landscape:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Mapea los productos mezclados para renderizar una tarjeta de producto por cada uno */}
            {shuffledProducts.map(product => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}
