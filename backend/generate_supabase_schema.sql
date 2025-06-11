-- ============================================
-- Cyber Gadgets - Configuración de Base de Datos
-- ============================================
-- Este script configura la base de datos para la aplicación Cyber Gadgets
-- Ejecuta este script completo en el SQL Editor de Supabase

-- Crear tabla products
CREATE TABLE IF NOT EXISTS public.products
(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0,
    isNew BOOLEAN DEFAULT false,
    category TEXT
    );
-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_isNew ON public.products(isNew);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
-- Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- Política para lectura (todos pueden leer productos)
CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);
-- ============================================
-- Configuración del Storage Bucket
-- ============================================
-- Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
-- Políticas para el bucket product-images
-- Permitir subidas autenticadas
CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );
-- Permitir lectura pública
CREATE POLICY "Allow public reads" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');
-- Permitir visualización pública de imágenes
CREATE POLICY "Allow public to view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');
-- Comentarios para documentación
COMMENT ON TABLE public.products IS 'Tabla de productos para la aplicación Cyber Gadgets';
COMMENT ON COLUMN public.products.id IS 'ID único autogenerado';
COMMENT ON COLUMN public.products.name IS 'Nombre del producto';
COMMENT ON COLUMN public.products.price IS 'Precio del producto con 2 decimales';
COMMENT ON COLUMN public.products.description IS 'Descripción del producto';
COMMENT ON COLUMN public.products.image IS 'URL de la imagen del producto';
COMMENT ON COLUMN public.products.stock IS 'Cantidad disponible en inventario';
COMMENT ON COLUMN public.products.isNew IS 'Indica si el producto es nuevo';
COMMENT ON COLUMN public.products.category IS 'Categoría del producto';
-- Insertar datos de ejemplo
INSERT INTO public.products (name, price, description, image, stock, isNew, category)
VALUES ('SynapseLink Neural Headband', 449.99,
        'Learn skills through direct cortical uploads (3 languages included). Warning: May cause temporary déjà vu',
        NULL, 87, true, 'Neural Enhancement'),
       ('Pocket Quantum Computer Kit', 2999.99,
        'Solve real-world optimization problems mientras se carga. Incluye un procesador de 1 qubit y carcasa anti-decohere...', NULL, 134, false, 'Quantum Computing Accessories'),
       ('Holowork 360° Projection Station', 899.50,
        'Espacio de reunión 4D con retroalimentación háptica. Compatible con todas las grandes plataformas de metaverso', NULL, 97, true, 'Holographic Interfaces'),
       ('EgoSphere Personal AI', 149.99,
        'Gemelo digital autoevolutivo que gestiona tu vida digital...', NULL, 99, false, 'AI Companions'),
       ('AtmoDome Personal Shelter', 25999.00,
        'Refugio personal para Marte con granja de oxígeno integrada...', NULL, 58, false, 'Space Exploration Gear'),
       ('NanoClean Air Drone', 799.00,
        'Dron limpiador de aire con créditos de huella de carbono...', NULL, 42, false, 'Eco-Tech Solutions'),
       ('Nebula Voice Assistant Orb', 249.95,
        'Asistente flotante que modula su color según el tono de la conversación...', NULL, 62, true, 'AI Companions'),
       ('HoloChef Projection Cooktop', 1799.00,
        'Instrucciones de cocina en AR...', NULL, 54, false, 'Holographic Interfaces'),
       ('Quantum Router X', 599.00,
        'Punto de acceso multimensional...', NULL, 112, false, 'Quantum Computing Accessories'),
       ('Cerebral HUD Contact Lenses', 799.00,
        'Lentes que muestran realidad aumentada...', NULL, 221, false, 'Neural Enhancement'),
       ('ExoGlove Spacewalk System', 12999.00,
        'Guantes inteligentes con micro-propulsores...', NULL, 23, false, 'Space Exploration Gear'),
       ('PlasmaWaste Converter', 4599.00,
        'Reactor casero para convertir basura en materiales...', NULL, 99, false, 'Eco-Tech Solutions') ON CONFLICT DO NOTHING;
-- Verificar que tod0 se creó correctamente
SELECT 'Setup completado exitosamente. Tabla products creada con ' || COUNT(*) || ' productos.' as status FROM public.products;
