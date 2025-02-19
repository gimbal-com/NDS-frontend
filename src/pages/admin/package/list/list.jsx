import { Button, Col, Input, message, Modal, Row, Select } from 'antd';
import { CloseCircleFilled, CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { postApi, fetchApi } from '../../../../lib/api';

import './style.scss';
import { Fragment, useEffect } from 'react';
import { useState } from 'react';


const AdminPackageList = () => {
    const [isPackageNewOpen, setIsPackageNewOpen] = useState(false);
    const [isItemNewOpen, setIsItemNewOpen] = useState(false);
    const [newPackageName, setNewPackageName] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState("picture");
    const [newItemAltitude, setNewItemAltitude] = useState("");
    const [newItemCount, setNewItemCount] = useState(null);
    const [newItemDescription, setNewItemDescription] = useState("");
    const [newItemPrice, setNewItemPrice] = useState(null);
    const [packageList, setPackageList] = useState([]);

    const [currentPackageId, setCurrentPackageId] = useState('')

    const handleCancelPackageCreate = () => {
        setIsPackageNewOpen(false);
        setNewPackageName("");
    }

    const handleCreateNewPackage = async () => {
        if (!newPackageName) {
            message.info("Package name is empty.");
            return;
        }

        const data = await postApi(`/api/packages`, {}, { name: newPackageName });

        if (data.success) {
            message.success(data.message);
            setPackageList([...packageList, data.package]);

            handleCancelPackageCreate();
        } else {
            message.error(data.message);
        }
    }

    const handleCancelItemCreate = async () => {
        setIsItemNewOpen(false);
        setNewItemAltitude("");
        setNewItemCount(null);
        setNewItemName("");
        setNewItemPrice(null);
        setNewItemDescription("");
        setNewItemType("picture");
    }

    const handleCreateNewItem = async () => {
        if(newItemName || newItemCount || newItemDescription || newItemType || newItemPrice) {
            const newItemData = {
                name: newItemName,
                type: newItemType,
                count: newItemCount,
                altitude: newItemAltitude,
                description: newItemDescription,
                price: newItemPrice
            }

            const data = await postApi(`/api/packages/${currentPackageId}/item`, {}, newItemData);

            if(data.success) {
                message.success(data.message);
                setPackageList(packageList.map(item => item._id === currentPackageId ? data.package : item));
            }
        }
    }

    useEffect(() => {

        async function fetchPackageList() {
            const data = await fetchApi(`/api/packages`, {});
            setPackageList(data.packages);
        }

        fetchPackageList();
    }, [])

    return (
        <Fragment>
            <div className='package-container'>
                <Row gutter={8}>
                    {
                        packageList.map(item => {
                            return (
                                <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4} key={item._id}>
                                    <div className='package-item'>
                                        <span className='package-item-title'>{item.p_category_name}</span>
                                        <div className='package-item-content'>
                                            {
                                                item.p_items.map(pitem => {
                                                    return (
                                                        <div className='package-item-unit' key={pitem._id}>
                                                            <span>{pitem.name}</span>
                                                            <CloseCircleFilled style={{cursor: 'pointer'}} />
                                                        </div>
                                                    )
                                                })
                                            }
                                            <Button block type='dashed' onClick={() => {setIsItemNewOpen(true); setCurrentPackageId(item._id)}}>Add a New Item</Button>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                        <div className='package-item new-placeholder'>
                            {
                                !isPackageNewOpen ?
                                    <Button block type='dashed' className='new-button' icon={<PlusOutlined />} onClick={() => setIsPackageNewOpen(true)}>
                                        New Package
                                    </Button>
                                    :
                                    <div className='new-package'>
                                        <Input placeholder='*Package Name' value={newPackageName} onChange={e => setNewPackageName(e.target.value)} />
                                        <div className='new-package-action'>
                                            <Button type="primary" style={{ flex: 1 }} onClick={handleCreateNewPackage}>Save</Button>
                                            <Button type="primary" style={{ flex: 1 }} onClick={handleCancelPackageCreate}>Cancel</Button>
                                        </div>
                                    </div>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
            <Modal
                open={isItemNewOpen}
                onCancel={handleCancelItemCreate}
                onOk={handleCreateNewItem}
                title="New Item"
            >
                <div className='package-item-edit-container'>
                    <Input 
                        placeholder='Item Name' 
                        className='edit-item'
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                    />
                    <Select
                        className='edit-item'
                        options={[
                            {label: 'Video', value: 'video'},
                            {label: 'Picture', value: 'picture'}
                        ]}
                        value={newItemType}
                        onChange={value => setNewItemType(value)}
                    />
                    <Input
                        placeholder='Altitute'
                        className='edit-item' 
                        value={newItemAltitude}
                        onChange={e => setNewItemAltitude(e.target.value)}
                    />
                    <Input 
                        type='number' 
                        placeholder='Count' 
                        className='edit-item'
                        value={newItemCount}
                        onChange={e => setNewItemCount(e.target.value)}
                    />
                    <Input.TextArea 
                        placeholder='Description' 
                        className='edit-item'
                        value={newItemDescription}
                        onChange={e => setNewItemDescription(e.target.value)}
                    />
                     <Input 
                        type='number' 
                        placeholder='Price' 
                        className='edit-item'
                        value={newItemPrice}
                        onChange={e => setNewItemPrice(e.target.value)}
                    />
                </div>
            </Modal>
        </Fragment>
    )
}

export default AdminPackageList;