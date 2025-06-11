import { useCart } from '../../context/CartContext.jsx';
import styles from '../../styles/ProductCard.module.css';


export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className={`${styles.card} dark:bg-zinc-900 dark:hover:bg-zinc-800 group relative`}>
      <div className={`${styles.imageContainer} dark:bg-gray-700`}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />
        {product.isNew && (
          <span className={`${styles.newBadge} dark:bg-primary-dark`}>New</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
        <div className={styles.category}>{product.category}</div>
        <div className={styles.stock}>{product.stock} left</div>
        </div>

        <h2 className={`${styles.title} dark:text-white`}>{product.name}</h2>
        <p className={`${styles.description} dark:text-white`}>{product.description}</p>
        <div className={styles.footer}>
          <div className={`${styles.price} dark:text-white`}>
            <span className={styles.amount}>{product.price}</span>
            <span className={styles.currency}>€</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className={`${styles.addToCart}  dark:bg-primary-dark dark:hover:bg-terciary-dark group-hover:opacity-100 transition-opacity duration-300`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
