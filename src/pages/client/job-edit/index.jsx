import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom";
import { getJobDetailByClient } from "../../../store/job/jobSlice";

const ClientJobEditPage = () => {
    const dispatch = useDispatch();

    const [isImageDetailDialogOpen, setIsImageDetailDialogOpen] = useState(false);
    const [isImageUploadDialogOpen, setIsImageUploaddialogOpen] = useState(false);
    const [isFolderCreateDialogOpen, setIsFolderCreateDialogOpen] = useState(false);

    const jobDetail = useSelector(store => store.job.jobDetail);
    const { id } = useParams();

    useEffect(() => {
        dispatch(getJobDetailByClient(id));
    }, [dispatch])

    const onFolderCreation = () => {

    }
    
    const onImageUpload = () => {
        
    }

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
                    <h3><span style={{ fontSize: 14, fontWeight: 800 }}>Job Title:</span> "{jobDetail?.j_title}"</h3>
                </div>
                <div className="job-edit-main">
                    <div className="job-folders-container">
                        <div className="job-folders-header">
                            <span>Folder List:</span>
                            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsFolderCreateDialogOpen(true)}>Add Folder</Button>
                        </div>
                    </div>
                    <div className="job-files-container">
                        <div className="job-files-header">
                            <span>File List:</span>
                            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsImageUploaddialogOpen(true)}>Add Files</Button>
                        </div>
                        <div className="job-files-container">

                        </div>
                    </div>
                </div>
            </div>
            <Modal open={isFolderCreateDialogOpen} title="Create a New Folder" onOk={onFolderCreation} onCancel={() => setIsFolderCreateDialogOpen(false)}>

            </Modal>
            <Modal 
                open={isImageDetailDialogOpen} 
                title="Image Detail"
                footer={
                    <Fragment>
                        <Button type="primary" onCancel={() => setIsImageDetailDialogOpen(false)}>Cancel</Button>
                    </Fragment>
                }
            >

            </Modal>
            <Modal
                open={isImageUploadDialogOpen} 
                title="Image Upload" 
                onOk={onImageUpload} 
                onCancel={() => setIsImageUploaddialogOpen(false)}
            >

            </Modal>
        </div>
    )
}

export default ClientJobEditPage;