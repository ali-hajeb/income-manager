import React from 'react';
import { Group } from "@mantine/core";
import { IconPencil, IconTrash } from '@tabler/icons-react';
import type ICategory from '@/app/lib/models/category/type';
import { Pill } from '../Pill';

export interface CategoryTableProps {
    data?: ICategory[];
    editHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    deleteHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function CategoryTable({
    data, 
    editHandler, 
    deleteHandler
}: CategoryTableProps) {
    return (
        <Group mt={'md'}>
            {data?.map(item => 
                <Pill 
                    title={item.title} 
                    key={item._id} 
                    id={item._id}
                    editHandler={editHandler} 
                    deleteHandler={deleteHandler} />)
            }
        </Group>
    );
}
