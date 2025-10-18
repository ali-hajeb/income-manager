import React from 'react';
import { Button, Group, Table, Text } from "@mantine/core";
import type IColumn from '@/app/lib/models/column/type';
import { toFarsiNumber } from '@/app/utils/number';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export interface ColumnsTableProps {
    data?: IColumn[];
    editHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    deleteHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function ColumnsTable({data, 
    editHandler, 
    deleteHandler
}: ColumnsTableProps) {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ردیف</Table.Th>
                    <Table.Th>شناسه</Table.Th>
                    <Table.Th>عنوان</Table.Th>
                    <Table.Th>درصد اعمال</Table.Th>
                    <Table.Th>نوع محاسبه</Table.Th>
                    <Table.Th>عملیات</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {
                    data?.map((col, i) => (<Table.Tr key={col._id}>
                        <Table.Td>
                            {toFarsiNumber(i + 1)}
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{toFarsiNumber(col.code)}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{col.title}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{toFarsiNumber(col.percentage)}%</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{col.auto ? 'خودکار' : 'دستی'}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Group wrap='nowrap'>
                                <Button 
                                    onClick={editHandler}
                                    variant='transparent' 
                                    c={'grey'}
                                    data-id={col._id}
                                    p={0} m={0}>
                                    <IconPencil size={16} />
                                </Button>
                                <Button 
                                    onClick={deleteHandler}
                                    variant='transparent' 
                                    c={'grey'}
                                    data-id={col._id} p={0} m={0}>
                                    <IconTrash size={16} />
                                </Button>
                            </Group>
                        </Table.Td>
                    </Table.Tr>))
                }
            </Table.Tbody>
        </Table>
    );
}
