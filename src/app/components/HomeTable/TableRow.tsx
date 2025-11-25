'use client'
import React, { useEffect, useState } from "react";
import { Button, Group, NumberFormatter, NumberInput, Table, TextInput } from "@mantine/core";
import { IconCalculator, IconEqual } from "@tabler/icons-react";
import { toFarsiNumber } from '@/app/utils/number';
import type IRecord from '@/app/lib/models/record/type';
import type IColumn from "@/app/lib/models/column/type";
import { ICellValue } from "@/app/lib/models/record/type";
import { IProgramPopulated } from "@/app/lib/models/program/type";

export interface TableRowProps {
    index: number;
    program?: IProgramPopulated;
    record?: IRecord;
    columns: IColumn[] | null;
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
    const [cols, setCols] = useState<ICellValue[]>(program?.cols.map(c => {
        const value = record?.values.find(col => col.column_id === c._id);
        return ({column_id: c._id, column_title: c.title, value: value?.value || 0})
    }) || []);
    const [totalDeduction, setTotalDeduction] = useState(record?.totalDeduction || 0);
    const [netIncome, setNetIncome] = useState(record?.netIncome || 0);
    const [changed, setChanged] = useState(0);

    // useEffect(() => {
    //     setCols()
    // }, []);

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
                            value: column.auto ? Math.floor(_budget * column.percentage / 100) : c.value,
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
            return sum + parseInt(cur.value as string)
        }, 0);
        return sum || 0;
    }

    const onCurrentCodeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCode(e.currentTarget.value);
    }

    const onBudgetChangeHandler = (value: number | string) => {
        const inputValue = value || 0;
        setBudget(parseInt(`${inputValue}`));
        // updateRow(parseInt(e.currentTarget.value));
    }

    const onCellChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value || '0';
        console.log("[UPDATE]", inputValue);
        const value = parseInt(inputValue);
        const columnId = e.currentTarget.dataset.col;
        // const max = parseInt(e.currentTarget.dataset.max as string);
        // if (max && value > max) {
        //     value = max;
        // }
        if (value > -1 && columnId) {
            setCols(cols => {
                if (cols) {
                    const updated = [...cols];
                    const columnIndex = updated.findIndex(col => col.column_id === columnId);
                    if (columnIndex > -1) {
                        updated[columnIndex].value = value;
                        return updated;
                    }
                }
                return cols;
            });
        }
        // updateRow(budget || 0);
    }

    const onBudgetCalcHandler = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLInputElement>) => {
        e.preventDefault();
        updateRow(budget || 0);
        setChanged(changed + 1);
    }

    return <Table.Tr>
        <Table.Td>{toFarsiNumber(index)}</Table.Td>
        <Table.Td miw={200}>{program?.title}</Table.Td>
        <Table.Td>
            <TextInput 
                name="currentCode" 
                data-id={record?._id}
                value={currentCode}
                onChange={onCurrentCodeChangeHandler}
                onBlur={onBudgetCalcHandler}
                miw={80}
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
                    miw={150}
                    thousandSeparator
                />
                <Button 
                    name="budget"
                    data-id={record?._id}
                    onClick={onBudgetCalcHandler}
                    p={0}
                    m={0}
                    w={48}
                >
                    <IconEqual size={24} />
                </Button>
            </Group>
        </Table.Td>
        {
            columns?.map(col => {
                const value = cols?.find(r => r.column_id === col._id);
                {/* if (!value) { */}
                {/*     const programCol = program?.cols.find(c => c._id === col._id); */}
                {/*     if (programCol) { */}
                {/*         value = { column_id: programCol._id, column_title: programCol.title, value: 0}; */}
                {/*     } */}
                {/* } */}
                return (<Table.Td key={col._id}>
                    {value ? col.auto ?
                        <NumberInput
                            name="values" 
                            data-id={record?._id}
                            data-col={col._id}
                            value={value.value}
                            readOnly={col.auto}
                            miw={150}
                            thousandSeparator
                        /> : <TextInput
                            type="number"
                            name="values" 
                            data-id={record?._id}
                            data-col={col._id}
                            data-max={netIncome}
                            // value={col.auto ? record.budget * col.percentage / 100 : value.value}
                            value={value.value}
                            readOnly={col.auto}
                            onChange={onCellChangeHandler}
                            onBlur={onBudgetCalcHandler}
                            miw={150}
                        />
                        :
                        <TextInput 
                            value={'0'}
                            miw={150}
                            disabled
                        />
                    }
                </Table.Td>)
            })
        }
        <Table.Td miw={150}><NumberFormatter thousandSeparator value={totalDeduction} /></Table.Td>
        <Table.Td miw={150}><NumberFormatter thousandSeparator value={netIncome} /></Table.Td>
        <Table.Td>{program?.programCode}</Table.Td>
    </Table.Tr>
}
