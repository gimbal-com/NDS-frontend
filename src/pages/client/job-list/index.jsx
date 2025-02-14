import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

const ClientJobListPage = () => {
    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">My Job List</span>
                <Link to='/client/jobs/new'>
                    <Button icon={<PlusOutlined />} type="primary">Create a New Job</Button>
                </Link>
            </div>

        </div>
    )
}

export default ClientJobListPage;