import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { createColumn, deleteColumn, editColumn } from "@/app/lib/models/column";
import { loadDefaultData } from "@/app/utils/";
import ColumnsTable from "./ColumnsTable";
import ColumnsForm, { IColumnForm } from "./ColumnsForm";
import type IColumn from "@/app/lib/models/column/type";
import type { IColumnNewObj } from "@/app/lib/models/column/type";
import type { IButtonState } from "@/app/types";
import axios from "axios";

export interface ColumnSettingProps {
    columns: IColumn[] | null
    setColumnsData: Dispatch<SetStateAction<IColumn[] | null>>;
}

export default function ColumnSetting({ columns: columnsData, setColumnsData }: ColumnSettingProps) {
    const [opened, {open, close}] = useDisclosure(false);

    const modalOnCloseHandler = () => {
        columnForm.reset();
        setEditMode(null);
        close();
    }

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})
    // const [columnsData, setColumnsData] = useState<IColumn[]>([]);

    // useEffect(() => {
    //     axios.get('/api/column', { params: { filter: {} }})
    //         .then(res => {
    //             setColumnsData(res.data.column);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // }, []);


    const columnForm = useForm<IColumnForm>({
        mode: 'controlled',
        initialValues: {
            code: '',
            title: '',
            percentage: 0,
            auto: '',
        },
        transformValues: (values) => ({
            code: values.code,
            title: values.title,
            percentage: values.percentage,
            auto: values.auto === 'auto' ? true : false,
        })
    });

    const columnAddOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        open();
    }

    const columnEditOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const data = columnsData?.find(col => 
            col._id === id);
        if (data && id) {
            columnForm.setValues({...data, auto: data.auto ? 'auto' : 'manual'});
            setEditMode(id);
            open();
        }
    }

    const columnDeleteOnClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && columnsData) {
            const index = columnsData.findIndex(col => 
                col._id === id);
            if (index > -1) {
                const res = await deleteColumn(id)
                if (res && res.data.column) {
                    setColumnsData(s => {
                        if (!s) return s;
                        const updated = [...s];
                        updated.splice(index, 1);
                        return updated;
                    })
                }
            }
        }
    }

    const columnFormOnSubmitHandler = async (values: IColumnForm) => {
        setLoading(true);
        try {
            if (editMode) {
                const res = await editColumn({...(values as IColumn), _id: editMode });
                if (res && res.data.column) {
                    setColumnsData(s => {
                        const updated = s ? [...s] : [];
                        const index = updated.findIndex(col => col._id === editMode);
                        if (index > -1) {
                            updated[index] = {...res.data.column};
                        }
                        return updated;
                    })
                }
            } else {
                const res = await createColumn(values as IColumnNewObj);
                if (res && res.data.column) {
                    setColumnsData(s => {
                        if (!s) return s;
                        return ([...s, res.data.column])
                    })
                }
            }
            setBtnState({color: 'green', icon: <IconCheck size={16} />});
            console.log(values);
        } catch (error) {
            setBtnState({color: 'red', icon: <IconExclamationCircle size={16} />});
        }
        setLoading(false);
        setTimeout(() => {
            setBtnState({color: undefined, icon: undefined});
        }, 1000);
    }

    const columnLoadDefaultOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        loadDefaultData('column')
            .then(res => {
                if (res && res.data.columns) {
                    setColumnsData(res.data.columns);
                }
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <Modal
                opened={opened} 
                onClose={modalOnCloseHandler}
                title={'ویرایش ستون'}>
                <ColumnsForm form={columnForm} submitHandler={columnFormOnSubmitHandler}>
                    <Button type='submit' 
                        loading={isLoading} 
                        color={btnState.color} 
                        rightSection={btnState.icon}
                        mt={'md'} fullWidth>ثبت</Button>
                </ColumnsForm>
            </Modal>
            <Box>
                <Group align='baseline'>
                    <Title order={2}>ستون‌ها</Title>
                    <Button variant='transparent' onClick={columnAddOnClickHandler} p={0}>افزودن</Button>
                </Group>
                <ColumnsTable 
                    data={columnsData} 
                    editHandler={columnEditOnClickHandler}
                    deleteHandler={columnDeleteOnClickHandler}/>
                <Button loading={isLoading} onClick={columnLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
