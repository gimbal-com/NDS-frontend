import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom";
import { getJobDetailByClient } from "../../../store/job/jobSlice";

const ClientJobEditPage = () => {
    const dispatch = useDispatch();

    const jobDetail = useSelector(store => store.job.jobDetail);
    const { id } = useParams();

    useEffect(() => {
        dispatch(getJobDetailByClient(id));
    }, [dispatch])

    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">Add Certificate to Job</span>
                <Link to='/client/jobs'>
                    <Button icon={<ArrowLeftOutlined />} type="primary">Return to List</Button>
                </Link>
            </div>
            <div className="job-edit-content">
                <div className="job-title">
                    <h3><span style={{fontSize: 14, fontWeight: 800}}>Job Title:</span> "{jobDetail?.j_title}"</h3>
                </div>
                <div className="job-edit-main">
                    <div className="job-folders-container">
                        <span>Folder List:</span>
                    </div>
                    <div className="job-files-container">
                        <span>File List:</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientJobEditPage;