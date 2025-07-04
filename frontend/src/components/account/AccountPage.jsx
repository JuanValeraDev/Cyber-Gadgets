import { useLocation } from "react-router-dom";
import AccountHome from "./AccountHome";

const AccountPage = () => {
    const location = useLocation();
    const { userData } = location.state || {};
    return <AccountHome userData={userData} />;
};

export default AccountPage;
