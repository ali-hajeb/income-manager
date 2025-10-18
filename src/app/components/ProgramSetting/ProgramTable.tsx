import React from 'react';
import { Button, Group, Table, Text } from "@mantine/core";
import { toFarsiNumber } from '@/app/utils/number';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import type { IProgramPopulated } from '@/app/lib/models/program/type';

export interface ProgramTableProps {
    data?: IProgramPopulated[];
    editHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    deleteHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function ProgramTable({
    data, 
    editHandler, 
    deleteHandler
}: ProgramTableProps) {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ردیف</Table.Th>
                    <Table.Th>برنامه</Table.Th>
                    <Table.Th>شناسه تعهدی</Table.Th>
                    <Table.Th>عنوان</Table.Th>
                    <Table.Th>دسته</Table.Th>
                    <Table.Th>عملیات</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {
                    data?.map((program, i) => (<Table.Tr key={program._id}>
                        <Table.Td>
                            {toFarsiNumber(i + 1)}
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{toFarsiNumber(program.programCode)}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{program.code}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{program.title}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Text fz={'sm'}>{program.type.title}</Text>
                        </Table.Td>
                        <Table.Td>
                            <Group wrap='nowrap'>
                                <Button 
                                    onClick={editHandler}
                                    variant='transparent' 
                                    c={'grey'}
                                    data-id={program._id}
                                    p={0} m={0}>
                                    <IconPencil size={16} />
                                </Button>
                                <Button 
                                    onClick={deleteHandler}
                                    variant='transparent' 
                                    c={'grey'}
                                    data-id={program._id} p={0} m={0}>
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
