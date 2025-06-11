/* Main content area */

import {ArrowBigUp, PlusIcon, EyeIcon, TrashIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

// Definición de las tarjetas principales del área de administración
const mainAreaCards = [
    {title: 'Insertar nuevos productos', value: 'Create', icon: 'create'},
    {title: 'Volver a la tienda', value: 'Read', icon: 'read'},
    {title: 'Modificar productos', value: 'Update', icon: 'update'},
    {title: 'Eliminar un producto', value: 'Delete', icon: 'delete'}
];

// Fecha y hora del último inicio de sesión (se muestra como mock data)
const lastLogin = new Date().toLocaleString();

// Función auxiliar para renderizar el icono correcto según el nombre
const renderIcon = (iconName) => {
    switch (iconName) {
        case 'create':
            return (
                <PlusIcon/>
            );
        case 'read':
            return (
                <EyeIcon/>
            );
        case 'update':
            return (
                <ArrowBigUp/>
            );
        case 'delete':
            return (
                <TrashIcon/>
            );
        default:
            return null;
    }
};

// Componente del área principal del panel de administración
export const AccountMainArea = ({userData, displayName, signOutWithEmail, setActiveSection}) => {
    const navigate = useNavigate()
    // Manejador de clics en las tarjetas principales
    const handleMainCardsClick = (card) => {
        switch (card.value) {
            case "Create":
                setActiveSection("create") // Cambia a la sección de creación
                break
            case "Read": {
                navigate("/") // Redirige a la página principal de la tienda
                break
            }
            case "Update":
                setActiveSection("update") // Cambia a la sección de actualización
                break
            case "Delete":
                setActiveSection("delete") // Cambia a la sección de eliminación
                break
            default:
                break
        }
    }

    return (
        <main className="flex-1 pb-8">
            <div className="mt-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Resumen</h2>

                    {/* Grid de tarjetas de acción */}
                    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {mainAreaCards.map((card) => (
                            <div key={card.title} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {/* Icono de la tarjeta */}
                                            <div className="h-6 w-6 text-gray-400 dark:text-gray-500">
                                                {renderIcon(card.icon)}
                                            </div>
                                        </div>
                                        {/* Contenido de la tarjeta */}
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-900">{card.title}</dt>
                                                <dd>
                                                    <div
                                                        className="text-2xl font-medium text-gray-900 dark:text-white ">{card.value}</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 dark:bg-zinc-900 justify-center ">
                                    <div className="text-sm inline-block w-full text-end">
                                        <button
                                            onClick={() => handleMainCardsClick(card)} // Maneja el clic en la tarjeta
                                            className=" font-medium text-secondary hover:text-primary dark:text-primary-dark dark:border-2 dark:border-primary-dark p-2 rounded-md">
                                            Abrir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
