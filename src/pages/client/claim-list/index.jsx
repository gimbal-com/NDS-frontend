import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClaimListByClient } from "../../../store/claim/claimSlice";
import { Button, Table, Tooltip } from "antd";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";

const ClientClaimListPage = () => {
    const dispatch = useDispatch();
    const claimList = useSelector(store => store.claim.claimList);
    const userId = useSelector(store => store.user.user._id);

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
                        <Tooltip title="Approve Claim">
                            <Button style={{marginRight: 8}} type="primary" size="small" icon={<CheckOutlined />} />
                        </Tooltip>
                        <Tooltip title="See Claimer Profile">
                            <Button type="primary" color="pink" size="small" icon={<EyeOutlined />} />
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
        </div>
    )
}

export default ClientClaimListPage;