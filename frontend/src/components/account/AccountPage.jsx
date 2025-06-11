import { useLocation } from "react-router-dom";
import AccountHome from "./AccountHome";

// Componente de la página de la cuenta/administración
const AccountPage = () => {
    const location = useLocation();
    // Obtiene los datos del usuario pasados por el estado de la ruta
    const { userData } = location.state || {};
    return <AccountHome userData={userData} />; // Renderiza el componente AccountHome con los datos del usuario
};

export default AccountPage;
