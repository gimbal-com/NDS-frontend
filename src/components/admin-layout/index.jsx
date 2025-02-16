import { AimOutlined, DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../store/user/userSlice";

import './style.css';

const menuItems = [
    {
        label: "Job Management",
        key: 'jobs',
        icon: <DashboardOutlined />
    },
    {
        label: "User Management",
        key: 'users',
        icon: <AimOutlined />
    }
]

const authMenuItems = [
    {
        label: "Log out",
        key: 'logout',
        icon: <LogoutOutlined />
    }
]

const AdminLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector(store => store.user.user);

    const handleMenuItemClick = ({ item, key }) => {
        console.log(item, key);

        navigate(`/admin/${key}`);
    }

    const handleAuthMenuItemClick = ({item, key}) => {
        if(key === 'logout') {
            dispatch(logout());
            navigate('/');
        }
    }

    return (
        <div className="admin-layout">
            <div className="sidebar">
                <div className="logo">
                    <img src="/images/logo.png" />
                </div>
                <Menu
                    items={menuItems}
                    onClick={(handleMenuItemClick)}
                />
            </div>
            <div className="content">
                <div className="header">
                    <span className="title">National Drone</span>
                    <Dropdown 
                        menu={{
                            items: authMenuItems,
                            onClick: handleAuthMenuItemClick
                        }}
                        trigger={['click']}
                    >
                        <div className="auth">
                            <Avatar size={40} />
                            <div className="auth-info">
                                <span className="name">{userInfo?.u_username}</span>
                                <span className="email">{userInfo?.u_email}</span>
                            </div>
                        </div>
                    </Dropdown>
                </div>
                <div className="main">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout;