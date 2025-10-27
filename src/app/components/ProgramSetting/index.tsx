import { useMemo, useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useForm } from "@mantine/form";
import { createProgram, deleteProgram, editProgram } from "@/app/lib/models/program";
import { db, loadDefaultData } from "@/app/utils/db";
import ProgramsTable from "./ProgramTable";
import ProgramsForm, { IProgramForm } from "./ProgramForm";
import type IProgram from "@/app/lib/models/program/type";
import type { IProgramNewObj, IProgramPopulated } from "@/app/lib/models/program/type";
import type { IButtonState } from "@/app/types";

// export interface ProgramSettingProps {
// }

export default function ProgramSetting() {
    const [opened, {open, close}] = useDisclosure(false);

    const modalOnCloseHandler = () => {
        programForm.reset();
        setEditMode(null);
        close();
    }

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})

    const programsData = useLiveQuery(async () => {
        const data = await db.programs.toArray();
        const list = await Promise.all(data.map(async (program) => {
            const withType = program.type ?
                {...program, type: await db.categories.get(program.type)}
                : {...program, type: null};

            // const withCols = program.cols && program.cols.length > 0 ?
            //     {...withType, cols: await Promise.all(program.cols.map( async (col) => await db.columns.get(col)))}
            //     : { ...program, cols: [] };
            // const columns = await db.columns.where('id').anyOf(program.cols).toArray();
            // return withCols;
            return {...withType};
        }));
        return list;
    });
    const columnsData = useLiveQuery(() => db.columns.toArray());
    const categoriesData = useLiveQuery(() => db.categories.toArray());
    const categoriesList = useMemo(() => categoriesData?.map(cat => cat.title), [categoriesData]);

    const programForm = useForm<IProgramForm>({
        mode: 'controlled',
        initialValues: {
            code: '',
            programCode: '',
            cols: [],
            type: '',
            title: '',
        }
    });

    const programAddOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        open();
    }

    const programEditOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const data = programsData?.find(col => col._id === id);
        if (data && id) {
            console.log(data);
            const {type, ...rest} = data;
            programForm.setValues({...rest, type: data.type?.title});
            setEditMode(id);
            open();
        }
    }

    const programDeleteOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && programsData) {
            console.log('delete', id);
            const index = programsData.findIndex(col => 
                col._id === id);
            console.log('delete index', index);
            if (index > -1) {
                deleteProgram(id)
                    .then(() => console.log('deleted!'))
                    .catch(err => console.error(err));
            }
        }
    }

    const programFormOnSubmitHandler = async (values: IProgramForm) => {
        setLoading(true);
        const programType = categoriesData?.find(cat => cat.title === values.type);
        if (!programType) {
            setBtnState({color: 'red', icon: <IconExclamationCircle size={16} />});
            setLoading(false);
            setTimeout(() => {
                setBtnState({color: undefined, icon: undefined});
            }, 1000);
            return;
        }

        const data = {...values, type: programType._id };
        try {
            if (editMode) {
                await editProgram({...(data as IProgram), _id: editMode });
            } else {
                await createProgram(data as IProgram);
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

    const programLoadDefaultOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        loadDefaultData('program');
    }

    return (
        <>
            <Modal
                opened={opened} 
                onClose={modalOnCloseHandler}
                title={'ویرایش برنامه‌ها'}>
                <ProgramsForm 
                    form={programForm} 
                    categoryList={categoriesList}
                    columnList={columnsData}
                    submitHandler={programFormOnSubmitHandler}>
                    <Button type='submit' 
                        loading={isLoading} 
                        color={btnState.color} 
                        rightSection={btnState.icon}
                        mt={'md'} fullWidth>ثبت</Button>
                </ProgramsForm>
            </Modal>
            <Box mt={'lg'}>
                <Group align='baseline'>
                    <Title order={2}>برنامه‌ها</Title>
                    <Button variant='transparent' onClick={programAddOnClickHandler} p={0}>افزودن</Button>
                </Group>
                <ProgramsTable 
                    data={programsData as unknown as IProgramPopulated[]} 
                    editHandler={programEditOnClickHandler}
                    deleteHandler={programDeleteOnClickHandler}/>
                <Button onClick={programLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
