import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Box, Button, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useForm } from "@mantine/form";
import { createProgram, deleteProgram, editProgram } from "@/app/lib/models/program";
import { loadDefaultData } from "@/app/utils/";
import ProgramsTable from "./ProgramTable";
import ProgramsForm, { IProgramForm } from "./ProgramForm";
import type IProgram from "@/app/lib/models/program/type";
import type { IProgramNewObj, IProgramPopulated } from "@/app/lib/models/program/type";
import type { IButtonState } from "@/app/types";
import ICategory from "@/app/lib/models/category/type";
import IColumn from "@/app/lib/models/column/type";

export interface ProgramSettingProps {
    programs: IProgramPopulated[] | null;
    categories: ICategory[] | null;
    columns: IColumn[] | null;
    setPrograms: Dispatch<SetStateAction<IProgramPopulated[] | null>>
}

export default function ProgramSetting({ 
    programs: programsData,
    categories: categoriesData,
    columns: columnsData,
    setPrograms
}: ProgramSettingProps) {
    const [opened, {open, close}] = useDisclosure(false);

    const modalOnCloseHandler = () => {
        programForm.reset();
        setEditMode(null);
        close();
    }

    const [isLoading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})
    // const [programsData, setProgramsData] = useState<IProgram[]>([]);

    // const programsData = useLiveQuery(async () => {
    //     const data = await db.programs.toArray();
    //     const list = await Promise.all(data.map(async (program) => {
    //         const withType = program.type ?
    //             {...program, type: await db.categories.get(program.type)}
    //             : {...program, type: null};
    //
    //         // const withCols = program.cols && program.cols.length > 0 ?
    //         //     {...withType, cols: await Promise.all(program.cols.map( async (col) => await db.columns.get(col)))}
    //         //     : { ...program, cols: [] };
    //         // const columns = await db.columns.where('id').anyOf(program.cols).toArray();
    //         // return withCols;
    //         return {...withType};
    //     }));
    //     return list;
    // });
    // const columnsData = useLiveQuery(() => db.columns.toArray());
    // const categoriesData = useLiveQuery(() => db.categories.toArray());
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
        const data = programsData?.find(p => p._id === id);
        console.log("[edit]", id, data);
        if (data && id) {
            console.log(data);
            const {type, cols, ...rest} = data;
            programForm.setValues({...rest, type: data.type?.title, cols: cols.map(c => c._id)});
            setEditMode(id);
            open();
        }
    }

    const programDeleteOnClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        if (id && programsData) {
            console.log('delete', id);
            const index = programsData.findIndex(col => 
                col._id === id);
            console.log('delete index', index);
            if (index > -1) {
                const res = await deleteProgram(id)
                if (res && res.data.program) {
                    setPrograms(s => {
                        if (!s) return s;
                        const updated = [...s];
                        updated.splice(index, 1);
                        return updated;
                    })
                }
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
                const res = await editProgram({...(data as IProgram), _id: editMode });
                if (res && res.data.program) {
                    setPrograms(s => {
                        const updated = s ? [...s] : [];
                        const index = updated.findIndex(p => p._id === editMode);
                        if (index > -1) {
                            updated[index] = {...res.data.program};
                        }
                        return updated;
                    })
                }
            } else {
                const res = await createProgram(data as IProgram);
                if (res && res.data.program) {
                    setPrograms(s => {
                        if (!s) return s;
                        return ([...s, res.data.program])
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

    const programLoadDefaultOnClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        loadDefaultData('program')
            .then(res => {
                if (res && res.data.programs) {
                    setPrograms(res.data.programs);
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
                title={'ویرایش برنامه‌ها'}>
                <ProgramsForm 
                    form={programForm} 
                    categoryList={categoriesList || null}
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
                <Button loading={isLoading} onClick={programLoadDefaultOnClickHandler} mt={'md'} leftSection={<IconUpload size={20} />}>
                    بارگیری اطلاعات پیش فرض
                </Button>
            </Box>
        </>
    );
}
