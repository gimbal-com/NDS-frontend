import { Button, Modal, Rate, Table, Tag } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { getJobListInProgressByClient } from "../../../store/job/jobSlice";

const ClientJobListInProgressPage = () => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState();

    const jobList = useSelector(store => store.job.jobList);
    const userId = useSelector(store => store.user.user._id);
    const dispatch = useDispatch();

    const columns = [
        {
            key: 'index',
            dataIndex: '_id',
            title: 'No',
            render: (_, row, index) => index + 1,
            width: 80
        },
        {
            key: 'title',
            dataIndex: 'j_title',
            title: 'Title'
        },
        {
            key: 'description',
            dataIndex: 'j_description',
            title: "Description",
            render: (desc) => desc.length > 50 ? desc.substr(0, 50) + '...' : desc
        },
        {
            key: 'developers',
            dataIndex: 'j_developers',
            title: 'Developers',
            render: (developers) => {
                return (
                    <Fragment>
                    {
                        developers.map((dev, idx) => {
                            return (
                                <Tag key={idx}>{dev.u_email}</Tag>
                            )
                        })
                    }
                    </Fragment>
                )
            },
            width: 240
        },
        {
            key: 'created_at',
            dataIndex: 'created_at',
            title: 'Created At',
            render: (date) => {
                return format(date, 'yyyy/MM/dd')
            },
            width: 120
        },
        {
            key: 'action',
            dataIndex: '_id',
            title: 'Action',
            render: (id, row) => {
                return (
                    <Button onClick={() => handleClickCompleteAction(row)}>Complete</Button>
                )
            },
            width: 120
        },  
    ]

    const handleClickCompleteAction = (job) => {
        setCurrentJob(job);
        setIsFeedbackModalOpen(true);
    }

    const handleComplete = () => {

    }

    useEffect(() => {
        if(userId) {
            dispatch(getJobListInProgressByClient(userId));
        }
    }, [dispatch, userId]);

    return (
        <div className="container">
            <div className="page-header">
                <span className="sub-title">My Job List In Prpgress</span>
            </div>
            <div>
                <Table
                    bordered
                    size="small"
                    dataSource={jobList || []}
                    columns={columns}
                    rowKey={row => row._id}
                    onRow={(record, index) => {
                        return {
                            onClick: () => {
                                // navigate(`/client/jobs/${record._id}`)
                            }
                        }
                    }}
                />
            </div>
            <Modal open={isFeedbackModalOpen} onCancel={() => setIsFeedbackModalOpen(false)} onOk={handleComplete}>
                <div className="client-feedback-container">
                {
                    currentJob?.j_developers.map(dev => {
                        return (
                            <div className="feedback-item" key={dev._id}>
                                <span>{dev.u_email}</span>
                                <Rate />
                            </div>
                        )
                    })
                }
                </div>
            </Modal>
        </div>
    )
}

export default ClientJobListInProgressPage;