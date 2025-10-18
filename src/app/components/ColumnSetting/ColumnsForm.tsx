import { Group, NumberInput, Radio, RadioGroup, TextInput } from "@mantine/core";
import { Form, UseFormReturnType } from "@mantine/form";
import { IconPercentage } from "@tabler/icons-react";


export interface IColumnForm {
    code: string;
    title: string;
    percentage: number;
    auto: string | boolean;
}

export interface ColumnsFormProps extends React.PropsWithChildren {
    form: UseFormReturnType<IColumnForm, (values: IColumnForm) => IColumnForm>
    submitHandler?: (values: IColumnForm) => Promise<void>;
}

export default function ColumnsForm({
    children,
    form,
    submitHandler
}: ColumnsFormProps) {
    return (
        <Form form={form} onSubmit={submitHandler}>
            <TextInput
                label='شناسه'
                placeholder='نمونه: 30746'
                key={form.key('code')}
                {...form.getInputProps('code')}
            />
            <TextInput
                label='عنوان'
                placeholder='عنوان ستون را وارد نمایید'
                key={form.key('title')}
                {...form.getInputProps('title')}
            />
            <NumberInput
                mt={'sm'}
                label='درصد تخصیص'
                placeholder='اعداد 1 تا 100'
                min={0}
                max={100}
                leftSection={<IconPercentage size={16} />}
                key={form.key('percentage')}
                {...form.getInputProps('percentage')}
            />
            <RadioGroup
                mt={'sm'}
                label="نوع محاسبه"
                key={form.key('auto')}
                {...form.getInputProps('auto')}
            >
                <Group mt={'xs'}>
                    <Radio label="دستی" value={'manual'} />
                    <Radio label="خودکار" value={'auto'} />
                </Group>
            </RadioGroup>
            {children}
        </Form>
    );
}
