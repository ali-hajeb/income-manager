import { useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useForm } from "@mantine/form";
import { createCategory, editCategory, deleteCategory } from "@/app/lib/models/category";
import { db, loadDefaultData } from "@/app/utils/db";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import type ICategory from "@/app/lib/models/category/type";
import type { ICategoryNewObj } from "@/app/lib/models/category/type";
import type { IButtonState } from "@/app/types";

export interface CategorySettingProps {
}

export default function CategorySetting({}: CategorySettingProps) {
    const [opened, {open, close}] = useDisclosure(false);

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})

    const categoryData = useLiveQuery(() => db.categories.toArray());

    const categoryForm = useForm<ICategoryNewObj>({
        mode: 'controlled',
        initialValues: {
            title: '',
        },
    });

    const modalOnCloseHandler = () => {
        categoryForm.reset();
        setEditMode(null);
        close();
    }

    const categoryAddOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        open();
    }

    const categoryEditOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const data = categoryData?.find(cat => 
            cat._id === id);
        if (data && id) {
            categoryForm.setValues({...data});
            setEditMode(id);
            open();
        }
    }

    const categoryDeleteOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && categoryData) {
            console.log('delete', id);
            const index = categoryData.findIndex(cat => 
                cat._id === id);
            console.log('delete index', index);
            if (index > -1) {
                deleteCategory(id)
                    .then(() => console.log('deleted!'))
                    .catch(err => console.error(err));
            }
        }
    }

    const categoryFormOnSubmitHandler = async (values: ICategoryNewObj) => {
        setLoading(true);
        try {
            if (editMode) {
                await editCategory({...(values as ICategory), _id: editMode });
            } else {
                await createCategory(values as ICategoryNewObj);
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

    const categoryLoadDefaultOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        loadDefaultData('category');
    }

    return (
        <>
            <Modal
                opened={opened} 
                onClose={modalOnCloseHandler}
                title={'ویرایش دسته‌ها'}>
                <CategoryForm form={categoryForm} submitHandler={categoryFormOnSubmitHandler}>
                    <Button type='submit' 
                        loading={isLoading} 
                        color={btnState.color} 
                        rightSection={btnState.icon}
                        mt={'md'} fullWidth>ثبت</Button>
                </CategoryForm>
            </Modal>
            <Box mt={'lg'}>
                <Group align='baseline'>
                    <Title order={2}>دسته‌بندی‌های</Title>
                    <Button variant='transparent' onClick={categoryAddOnClickHandler} p={0}>افزودن</Button>
                </Group>
                <CategoryTable 
                    data={categoryData} 
                    editHandler={categoryEditOnClickHandler}
                    deleteHandler={categoryDeleteOnClickHandler}/>
                <Button onClick={categoryLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
