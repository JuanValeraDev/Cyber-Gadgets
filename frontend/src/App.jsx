import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import {catalog} from "./mock-products.js";

const products = catalog.products

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <section className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">
                    Explore our universe
                  </h1>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-primary-dark
                                   hover:text-primary dark:hover:text-terciary-dark">
                      Latest
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-primary-dark
                                   hover:text-primary dark:hover:text-terciary-dark">
                      Popular
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </main>
          </div>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
