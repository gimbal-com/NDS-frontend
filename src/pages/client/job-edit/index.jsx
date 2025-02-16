import { ArrowLeftOutlined, FolderFilled, FolderOpenFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Modal, Row, Upload } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createFolderByJobId, getFilesByJobIdAndFolderId, getJobDetailByClient, uploadJobFiles } from "../../../store/job/jobSlice";

const ClientJobEditPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isImageDetailDialogOpen, setIsImageDetailDialogOpen] = useState(false);
    const [isImageUploadDialogOpen, setIsImageUploaddialogOpen] = useState(false);
    const [isFolderCreateDialogOpen, setIsFolderCreateDialogOpen] = useState(false);

    const [folderName, setFolderName] = useState("");
    const [fileList, setFileList] = useState([]);
    const [currentFileUrl, setCurrentUrl] = useState("");

    const jobDetail = useSelector(store => store.job.jobDetail);
    const jobFiles = useSelector(store => store.job.fileList);
    const { id } = useParams();
    const [query] = useSearchParams();
    let folderId = query.get('folderId');

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            console.log(file);

            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file, files) => {
            setFileList([...fileList, ...files]);
            return false;
        },
        fileList,
    }

    useEffect(() => {
        dispatch(getJobDetailByClient(id));
    }, [dispatch]);

    useEffect(() => {
        if (folderId) {
            dispatch(getFilesByJobIdAndFolderId({ folderId, jobId: id }))
        }
    }, [folderId])

    const onFolderCreation = async () => {
        if (folderName) {
            const response = await dispatch(createFolderByJobId({ jobId: id, name: folderName }));
            if (createFolderByJobId.fulfilled.match(response)) {
                dispatch(getJobDetailByClient(id));
            }
            setFolderName("");
        } else {
            message.info("Please input folder name.");
        }
    }

    const handleClickFolderItem = (folder) => {
        navigate(`/client/jobs/${id}?folderId=${folder}`);
    }

    const onImageUpload = async () => {
        const response = await dispatch(uploadJobFiles({ jobId: id, folderId, files: fileList }));

        if (uploadJobFiles.fulfilled.match(response)) {
            dispatch(getFilesByJobIdAndFolderId({ folderId, jobId: id }));
        }
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
                        <div className="job-folder-list">
                            {
                                jobDetail.j_folders?.map((item) => {
                                    return (
                                        <div className={`job-folder-item ${item._id === folderId && 'active'}`} onClick={() => handleClickFolderItem(item._id)} key={item._id}>
                                            {
                                                item._id === folderId ?
                                                    <FolderOpenFilled />
                                                    :
                                                    <FolderFilled />
                                            }
                                            <span className="job-folder-item-name">{item.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="job-files-container">
                        <div className="job-files-header">
                            <span>File List:</span>
                            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsImageUploaddialogOpen(true)}>Add Files</Button>
                        </div>
                        <div className="job-files-container">
                            <Row gutter={[12, 12]}>
                                {
                                    jobFiles.map((item, idx) => {
                                        return (
                                            <Col
                                                key={item._id}
                                                span={12} sm={12} md={8} lg={6} xl={4}
                                                className="job-files-item"
                                                onDoubleClick={() => {
                                                    setIsImageDetailDialogOpen(true);
                                                    setCurrentUrl(item.jf_path);
                                                }}
                                            >
                                                <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/jobs/${item.jf_path}`} />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={isFolderCreateDialogOpen} title="Create a New Folder" onOk={onFolderCreation} onCancel={() => setIsFolderCreateDialogOpen(false)}>
                <Input
                    onChange={e => setFolderName(e.target.value)}
                    placeholder="Folder Name"
                    value={folderName}
                />
            </Modal>
            <Modal
                open={isImageDetailDialogOpen}
                onOk={() => setIsImageDetailDialogOpen(false)}
                onCancel={() => setIsImageDetailDialogOpen(false)}
                title="Image Detail"
                width={1000}
            >
                <div className="job-detail-image-zoom">
                    <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/jobs/${currentFileUrl}`} />
                </div>
            </Modal>
            <Modal
                open={isImageUploadDialogOpen}
                title="Image Upload"
                onOk={onImageUpload}
                onCancel={() => { setIsImageUploaddialogOpen(false); setFileList([]) }}
            >
                <Upload {...uploadProps} multiple>
                    <Input style={{ cursor: 'pointer' }} readOnly value={`${fileList?.length} files Selected`} addonAfter="Select Files" />
                </Upload>
            </Modal>
        </div>
    )
}

export default ClientJobEditPage;