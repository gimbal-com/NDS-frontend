import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveClaimByClient, getClaimListByClient } from "../../../store/claim/claimSlice";
import { Button, Modal, Row, Col, Table, Tooltip } from "antd";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";

const ClientClaimListPage = () => {
    const dispatch = useDispatch();
    const claimList = useSelector(store => store.claim.claimList);
    const userId = useSelector(store => store.user.user._id);

    const [isPilotInfoModalOpen, setIsPilotInfoModalOpen] = useState(false);
    const [currentPilot, setCurrentPilot] = useState();

    const handleViewInfoClick = (claimerInfo) => {
        setCurrentPilot(claimerInfo);
        setIsPilotInfoModalOpen(true);
    }

    const handleApproveClaim = (claimId, jobId, claimerId) => {
        dispatch(approveClaimByClient({claimId, jobId, claimerId}));
    }

    useEffect(() => {
        if(userId) {
            dispatch(getClaimListByClient(userId));
        }
    }, [userId]);

    console.log(claimList);

    const columns = [
        {
            key: 'no',
            dataIndex: '_id',
            title: 'No',
            render: (_id, row, index) => index + 1,
            width: 80
        },
        {
            key: 'title',
            dataIndex: 'c_job',
            title: 'Job Title',
            render: (job) => job.j_title
        },
        {
            key: 'content',
            dataIndex: 'c_content',
            title: 'Claim Message'
        },
        {
            key: 'claimer',
            dataIndex: 'c_claimer',
            title: 'Claimer',
            render: (claimer) => claimer.u_email,
            width: 240
        },
        {
            key: 'action_show',
            dataIndex: '_id',
            title: 'Action',
            render: (_id, row) => {
                return (
                    <Fragment>
                        <Tooltip title="See Claimer Profile">
                            <Button onClick={() => handleViewInfoClick(row.c_claimer)} type="primary" color="pink" size="small" icon={<EyeOutlined />} />
                        </Tooltip>
                        <Tooltip title="Approve Claim">
                            <Button style={{marginLeft: 8}} type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApproveClaim(_id, row.c_job._id, row.c_claimer._id)} />
                        </Tooltip>
                    </Fragment>
                )
            },
            width: 120
        }
    ]

    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">Claim Request Page</span>
            </div>
            <div className="job-claim-content">
                <Table 
                    dataSource={claimList} 
                    columns={columns}
                    rowKey={row => row._id}
                />
            </div>
            <Modal 
                title="Claimer Detail" 
                open={isPilotInfoModalOpen} 
                onCancel={() => setIsPilotInfoModalOpen(false)} 
                onOk={() => setIsPilotInfoModalOpen(false)} 
                width={1000}
            >
                <div className="claimer-info-container">
                    <div className="claimer-info-item">
                        <label>Username: </label>
                        <span>{currentPilot?.u_username}</span>
                    </div>
                    <div className="claimer-info-item">
                        <label>Email: </label>
                        <span>{currentPilot?.u_email}</span>
                    </div>
                    <div className="claimer-info-item">
                        <Row>
                        {
                            currentPilot?.u_certs.map(item => {
                                return (
                                    <Col span={6} key={item._id}>
                                        <div className="claimer-info-item-image">
                                            <img src={`${import.meta.env.VITE_PUBLIC_API_URL}/images/certs/${item.path}`} />
                                        </div>
                                    </Col>
                                )
                            })
                        }
                        </Row>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ClientClaimListPage;