import { Checkbox, Select, Stack, TextInput } from "@mantine/core";
import { Form, UseFormReturnType } from "@mantine/form";
import type IColumn from "@/app/lib/models/column/type";
import { useState } from "react";


export interface IProgramForm {
    code: string;
    programCode: string;
    title: string;
    type: string;
    cols: string[];
}

export interface ProgramFormProps extends React.PropsWithChildren {
    form: UseFormReturnType<IProgramForm, (values: IProgramForm) => IProgramForm>;
    columnList?: IColumn[];
    categoryList?: string[];
    submitHandler?: (values: IProgramForm) => Promise<void>;
}

export default function ProgramsForm({
    children,
    form,
    columnList,
    categoryList,
    submitHandler
}: ProgramFormProps) {
    const [colList, setColList] = useState<string[]>(form.getValues().cols.slice());

    const colsHandler = (cols:string[]) => {
        console.log(cols);
        const selected = cols.filter(item => true && item);
        console.log(selected);
        setColList(selected);
        form.setFieldValue('cols', [...selected]);
    }
    return (
        <Form form={form} onSubmit={submitHandler}>
            <Stack gap={'md'}>
                <TextInput
                    label='شناسه تعهدی'
                    placeholder='نمونه: 30746'
                    key={form.key('code')}
                    {...form.getInputProps('code')}
                />
                <TextInput
                    label='شناسه برنامه'
                    placeholder='نمونه: 1803001000n'
                    key={form.key('programCode')}
                    {...form.getInputProps('programCode')}
                />
                <TextInput
                    label='عنوان'
                    placeholder='عنوان ستون را وارد نمایید'
                    key={form.key('title')}
                    {...form.getInputProps('title')}
                />
                <Select
                    label="دسته"
                    placeholder="درمانی، دارویی و..."
                    data={categoryList}
                    key={form.key('type')}
                    {...form.getInputProps('type')}
                />
                <Checkbox.Group
                    label="ستون‌ها"
                    value={colList}
                    onChange={colsHandler}
                >
                    <Stack>
                        {columnList?.map(col => <Checkbox 
                            key={col._id} 
                            value={col._id} 
                            label={col.title} 
                        />)}
                    </Stack>
                </Checkbox.Group>
            </Stack>
            {children}
        </Form>
    );
}
