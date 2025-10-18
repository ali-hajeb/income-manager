import { ICategoryNewObj } from "@/app/lib/models/category/type";
import { TextInput } from "@mantine/core";
import { Form, UseFormReturnType } from "@mantine/form";

export interface CategoryFormProps extends React.PropsWithChildren {
    form: UseFormReturnType<ICategoryNewObj, (values: ICategoryNewObj) => ICategoryNewObj>
    submitHandler?: (values: ICategoryNewObj) => Promise<void>;
}

export default function CategoryForm({
    children,
    form,
    submitHandler
}: CategoryFormProps) {
    return (
        <Form form={form} onSubmit={submitHandler}>
            <TextInput
                label='عنوان'
                placeholder='درمان، آموزش و...'
                key={form.key('title')}
                {...form.getInputProps('title')}
            />
            {children}
        </Form>
    );
}
