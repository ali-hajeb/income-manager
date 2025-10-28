import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useForm } from "@mantine/form";
import { createCategory, editCategory, deleteCategory } from "@/app/lib/models/category";
import { loadDefaultData } from "@/app/utils/";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import type ICategory from "@/app/lib/models/category/type";
import type { ICategoryNewObj } from "@/app/lib/models/category/type";
import type { IButtonState } from "@/app/types";

export interface CategorySettingProps {
    categories: ICategory[] | null;
    setCategoryData: Dispatch<SetStateAction<ICategory[] | null>>
}

export default function CategorySetting({ categories: categoryData, setCategoryData}: CategorySettingProps) {
    const [opened, {open, close}] = useDisclosure(false);

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})
    // const [categoryData, setCategoryData] = useState<ICategory[]>([]);

    // const categoryData = useLiveQuery(() => db.categories.toArray());

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

    const categoryDeleteOnClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && categoryData) {
            const index = categoryData.findIndex(col => 
                col._id === id);
            if (index > -1) {
                const res = await deleteCategory(id)
                if (res && res.data.category) {
                    setCategoryData(s => {
                        if (!s) return s;
                        const updated = [...s];
                        updated.splice(index, 1);
                        return updated;
                    })
                }
            }
        }
    }

    const categoryFormOnSubmitHandler = async (values: ICategoryNewObj) => {
        setLoading(true);
        try {
            if (editMode) {
                const res = await editCategory({...(values as ICategory), _id: editMode });
                if (res && res.data.category) {
                    setCategoryData(s => {
                        if (!s) return s;
                        const updated = [...s];
                        const index = updated.findIndex(col => col._id === editMode);
                        if (index > -1) {
                            updated[index] = {...res.data.category};
                        }
                        return updated;
                    })
                }
            } else {
                const res = await createCategory(values as ICategoryNewObj);
                console.log(res);
                if (res && res.data.category) {
                    setCategoryData(s => {
                        console.log(s);
                        if (!s) return [{...res.data.category}];
                        return ([...s, res.data.category])
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

    const categoryLoadDefaultOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        loadDefaultData('category')
            .then(res => {
                if (res && res.data.categories) {
                    setCategoryData(res.data.categories);
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
                <Button loading={isLoading} onClick={categoryLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
