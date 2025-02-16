import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, Input, message, Row, Col, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertficateListByPilot, uploadCertificateFileByPilot } from "../../../store/user/userSlice";

const PilotCertificateEdit = () => {
    const [certFile, setCertFile] = useState(null);
    const [certName, setCertName] = useState("");
    const [isCertsModalOpen, setIsCertsModalOpen] = useState(false);
    const [isCertDetailOpen, setIsDetailOpen] = useState(false);
    const [currentCertFileUrl, setCurrentCertFileUrl] = useState("");

    const certList = useSelector(store => store.user.certList);
    const userId = useSelector(store => store.user.user._id);

    const dispatch = useDispatch();

    const uploadProps = {
        onRemove: (file) => {
            setCertFile();
        },
        beforeUpload: (file, files) => {
            setCertFile(file);
            return false;
        },
        fileList: certFile ? [certFile] : [],
    }

    const handleSaveCert = () => {
        if (!certFile) {
            message.info("Select a Certificate File.");
            return;
        }
        if (!certName) {
            message.info("Input a Certificate Name");
            return;
        }
        dispatch(uploadCertificateFileByPilot({userId, file: certFile, name: certName}));
    }

    const handleDBClickCert = (path) => {
        setCurrentCertFileUrl(path);
        setIsDetailOpen(true);
    }

    useEffect(() => {
        if(userId) {
            dispatch(getCertficateListByPilot(userId));
        }
    }, [dispatch, userId])

    return (
        <div className="container">
            <div className="page-header">
                <span className="page-subtitle">My Certificates</span>
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setIsCertsModalOpen(true)}>
                    Add a Certificate
                </Button>
            </div>
            <div className="pilot-certificate-container">
                <Row>
                    {
                        certList.map(item => {
                            return (
                                <Col span={24} xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={item.path}>
                                    <Tooltip title={item.name}>
                                        <div className="pilot-cert-item" onDoubleClick={() => handleDBClickCert(item.path)}>
                                            <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/certs/${item.path}`} alt={item.name} />
                                        </div>
                                    </Tooltip>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
            <Modal open={isCertsModalOpen} onCancel={() => setIsCertsModalOpen(false)} onOk={handleSaveCert}>
                <Upload {...uploadProps} multiple>
                    <Input placeholder="Certificate File" style={{ cursor: 'pointer' }} readOnly value={certFile?.name} addonAfter="Select Files" />
                </Upload>
                <Input onChange={e => setCertName(e.target.value)} style={{marginTop: 12}} value={certName} placeholder="Certificate Name" />
            </Modal>
            <Modal
                open={isCertDetailOpen}
                onOk={() => setIsDetailOpen(false)}
                onCancel={() => setIsDetailOpen(false)}
                title="Certficate Detail"
                width={1000}
            >
                <div className="cert-image-zoom">
                    <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/certs/${currentCertFileUrl}`} />
                </div>
            </Modal>
        </div>
    )
}

export default PilotCertificateEdit;