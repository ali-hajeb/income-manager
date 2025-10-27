import { useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useForm } from "@mantine/form";
import { createColumn, deleteColumn, editColumn } from "@/app/lib/models/column";
import { db, loadDefaultData } from "@/app/utils/db";
import ColumnsTable from "./ColumnsTable";
import ColumnsForm, { IColumnForm } from "./ColumnsForm";
import type IColumn from "@/app/lib/models/column/type";
import type { IColumnNewObj } from "@/app/lib/models/column/type";
import type { IButtonState } from "@/app/types";

// export interface ColumnSettingProps {
// }

export default function ColumnSetting() {
    const [opened, {open, close}] = useDisclosure(false);

    const modalOnCloseHandler = () => {
        columnForm.reset();
        setEditMode(null);
        close();
    }

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})

    const columnsData = useLiveQuery(() => db.columns.toArray());

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

    const columnDeleteOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && columnsData) {
            console.log('delete', id);
            const index = columnsData.findIndex(col => 
                col._id === id);
            console.log('delete index', index);
            if (index > -1) {
                deleteColumn(id)
                    .then(() => console.log('deleted!'))
                    .catch(err => console.error(err));
            }
        }
    }

    const columnFormOnSubmitHandler = async (values: IColumnForm) => {
        setLoading(true);
        try {
            if (editMode) {
                await editColumn({...(values as IColumn), _id: editMode });
            } else {
                await createColumn(values as IColumnNewObj);
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
        loadDefaultData('column');
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
                <Button onClick={columnLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
