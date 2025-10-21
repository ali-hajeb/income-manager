'use client'
import React, { useEffect, useState } from "react";
import { Button, Group, NumberFormatter, NumberInput, Table, TextInput } from "@mantine/core";
import { IconCalculator } from "@tabler/icons-react";
import { toFarsiNumber } from '@/app/utils/number';
import type IProgram from '@/app/lib/models/program/type';
import type IRecord from '@/app/lib/models/record/type';
import type IColumn from "@/app/lib/models/column/type";
import { ICellValue } from "@/app/lib/models/record/type";

export interface TableRowProps {
    index: number;
    program?: IProgram;
    record?: IRecord;
    columns?: IColumn[];
    updateHandler: (record: IRecord) => void;
}

export default function TableRow({ 
    index,
    program,
    record,
    columns,
    updateHandler
}: TableRowProps) {
    const [currentCode, setCurrentCode] = useState(record?.currentCode || '');
    const [budget, setBudget] = useState(record?.budget || 0);
    const [cols, setCols] = useState(record?.values || []);
    const [totalDeduction, setTotalDeduction] = useState(record?.totalDeduction || 0);
    const [netIncome, setNetIncome] = useState(record?.netIncome || 0);
    const [changed, setChanged] = useState(0);

    useEffect(() => {
        updateRecords();
    }, [changed]);

    const updateRecords = () => {
        if (record) {
            updateHandler({...record, 
                values: cols,
                currentCode,
                budget,
                totalDeduction,
                netIncome,
            });
        }
    }

    const updateRow = (_budget: number) => {
        console.log("[budget]", budget);
        setCols(cols => {
            if (cols) {
                const updated = cols.map((c) => {
                    const column = columns?.find(col => col._id === c.column_id);
                    if (column) {
                        return {
                            ...c,
                            value: column.auto ? _budget * column.percentage / 100 : c.value,
                        }
                    }
                    return c;
                });
                const deduction = calculateTotalDeduction(updated); 
                setTotalDeduction(deduction);
                setNetIncome(_budget - deduction);
                console.log(updated);
                return updated;
            }
            return cols;
        })
    }

    const calculateTotalDeduction= (cols: ICellValue[]) => {
        const sum = cols.reduce((sum, cur) => {
            console.log(cur.column_title, sum, cur.value);
            return sum + parseFloat(cur.value as string)
        }, 0);
        return sum || 0;
    }

    const onCurrentCodeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCode(e.currentTarget.value);
    }

    const onBudgetChangeHandler = (value: number | string) => {
        if (value) {
            setBudget(parseFloat(`${value}`));
            // updateRow(parseFloat(e.currentTarget.value));
        }
    }

    const onCellChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget) {
            const value = e.currentTarget.value;
            const columnId = e.currentTarget.dataset.col;
            if (value && columnId) {
                setCols(cols => {
                    if (cols) {
                        const updated = [...cols];
                        const columnIndex = updated.findIndex(col => col.column_id === columnId);
                        if (columnIndex && columnIndex > -1) {
                            updated[columnIndex].value = parseFloat(value);
                            return updated;
                        }
                    }
                    return cols;
                });
            }
            // updateRow(budget || 0);
        }
    }

    const onBudgetCalcHandler = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLInputElement>) => {
        e.preventDefault();
        updateRow(budget || 0);
        setChanged(changed + 1);
    }

    return <Table.Tr>
        <Table.Td>{toFarsiNumber(index)}</Table.Td>
        <Table.Td>{program?.title}</Table.Td>
        <Table.Td>
            <TextInput 
                name="currentCode" 
                data-id={record?._id}
                value={currentCode}
                onChange={onCurrentCodeChangeHandler}
                onBlur={onBudgetCalcHandler}
            />
        </Table.Td>
        <Table.Td>
            <Group wrap="nowrap">
                <NumberInput
                    name="budget"
                    data-id={record?._id}
                    value={budget}
                    onChange={onBudgetChangeHandler}
                    onBlur={onBudgetCalcHandler}
                    thousandSeparator
                />
                <Button 
                    name="budget"
                    data-id={record?._id}
                    onClick={onBudgetCalcHandler}
                    p={0}
                    m={0}
                    w={64}
                >
                    <IconCalculator size={24} />
                </Button>
            </Group>
        </Table.Td>
        {
            columns?.map(col => {
                const value = cols?.find(r => r.column_id === col._id);
                return (<Table.Td key={col._id}>
                    {value ? col.auto ?
                        <NumberInput
                            name="values" 
                            data-id={record?._id}
                            data-col={col._id}
                            value={value.value}
                            readOnly={col.auto}
                            thousandSeparator
                        /> : <TextInput
                            type="number"
                            name="values" 
                            data-id={record?._id}
                            data-col={col._id}
                            // value={col.auto ? record.budget * col.percentage / 100 : value.value}
                            value={value.value}
                            readOnly={col.auto}
                            onChange={onCellChangeHandler}
                            onBlur={onBudgetCalcHandler}
                        />
                        :
                        <TextInput 
                            value={'0'}
                            disabled
                        />
                    }
                </Table.Td>)
            })
        }
        <Table.Td><NumberFormatter thousandSeparator value={totalDeduction} /></Table.Td>
        <Table.Td><NumberFormatter thousandSeparator value={netIncome} /></Table.Td>
        <Table.Td>{program?.programCode}</Table.Td>
    </Table.Tr>
}
