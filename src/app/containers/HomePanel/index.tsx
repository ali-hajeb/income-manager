'use client'
import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Box, Button, Container, Flex, Group, Modal, NumberFormatter, NumberInput, Select, Table, Text, TextInput, Title } from "@mantine/core";
import { IconCheck, IconExclamationCircle, IconFileExcel, IconPrinter } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import { SHAMSI_MONTHS } from "@/app/constants/months";
import { db } from "@/app/utils/db";
import IRecord from "@/app/lib/models/record/type";
import TableRow from "@/app/components/HomeTable/TableRow";
import { createRecord, editRecord, getRecord } from "@/app/lib/models/record";
import { IButtonState } from "@/app/types";
import { pdf } from "@react-pdf/renderer";
import ListReportPage from "@/app/components/Report";
import { useDisclosure } from "@mantine/hooks";

// export interface HomePanelProps {
// }

export default function HomePanel() {
    const [isLoading, setLoading] = useState(false);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})
    const [records, setRecords] = useState<IRecord[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [year, setYear] = useState<number | null>(null);
    const [month, setMonth] = useState<typeof SHAMSI_MONTHS[number] | null>(null);
    const [reportTitle, setReportTitle] = useState<string | null>(null);
    const [opened, {open, close}] = useDisclosure(false);

    const reportTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReportTitle(e.currentTarget.value);
    }

    const updateRecords = (record: IRecord) => {
        setRecords(records => {
            const updated = [...records];
            const recordIndex = updated.findIndex(r => r._id === record._id);
            if (recordIndex > -1) {
                updated[recordIndex] = {...updated[recordIndex], ...record};
            }
            console.log(updated);
            return updated;
        })
    }

    const onSearchClickHandler = async (e: React.FormEvent) => { 
        setLoading(true);
        try {
            e.preventDefault();
            if (month && year) {
                const _m = SHAMSI_MONTHS.findIndex(item => item === month);
                console.log(month, _m, year);
                const recs = await getRecord(_m, year);
                if (recs) {
                    setRecords(recs);
                }
                setEditMode(true);
                setBtnState({color: 'green', icon: <IconCheck size={16}/>});
            }
        } catch (error) {
            console.error(error);
            setBtnState({color: 'red', icon: <IconExclamationCircle size={16} />});
        }
        setLoading(false);
        setTimeout(() => {
            setBtnState({color: undefined, icon: undefined});
        }, 1000);
    }

    const onRecordSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        try {
            e.preventDefault();
            await Promise.all(records.map(async (r) => {
                if (editMode) {
                    return await editRecord(r);
                } else {
                    return await createRecord(r);
                }
            }));
            setBtnState({color: 'green', icon: <IconCheck size={16}/>});
        } catch (error) {
            console.error(error);
            setBtnState({color: 'red', icon: <IconExclamationCircle size={16} />});
        }
        setLoading(false);
        setTimeout(() => {
            setBtnState({color: undefined, icon: undefined});
        }, 1000);
    }

    const onNewRecordClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (month && year) {
            const _m = SHAMSI_MONTHS.findIndex(item => item === month);
            try {
                const recs = await getRecord(_m, year);
                console.log(recs);
                if (recs && recs.length > 0) {
                    alert('گزارش این ماه قبلا ایجاد شده‌است!');
                    return;
                }
            } catch (error) {
                console.error(error);
            }
            const defaultRecords = programs?.map(program => {
                const values = program.cols.map(col => {
                    const column = columns?.find(c => c._id === col);
                    if (column) {
                        return ({column_id: col, column_title: column.title, value: 0})
                    }
                });
                return ({
                    _id: Math.floor(Math.random() * Date.now()).toString(),
                    program: program._id,
                    currentCode: program.code,
                    date: (new Date()).toISOString(),
                    month: SHAMSI_MONTHS.findIndex(item => item === month),
                    year: year || 0,
                    budget: 0,
                    netIncome: 0,
                    prevIncome: 0,
                    totalDeduction: 0,
                    totalIncome: 0,
                    values: values.length ? values : [],
                })
            }, [month, year]);

            if (defaultRecords) {
                setRecords(defaultRecords as IRecord[]);
                setEditMode(false);
            }
        }
    }

    const reportHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }

    const generateReport = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (columns && programs && records && categories) {
            const sortedRecords = [...records].sort((a, b) => {
                const programA = programs.find(p => p._id === a.program);
                const programB = programs.find(p => p._id === b.program);
                if (programA && programB) {
                    const catA = categories.find(cat => cat._id === programA.type);
                    const catB = categories.find(cat => cat._id === programB.type);
                    if (catA && catB) {
                        return catA.title.localeCompare(catB.title);
                    }
                }
                return 0;
            });
            pdf(<ListReportPage title="تخصیص درآمد اختصاصی" 
                columns={columns}
                programs={programs}
                categories={categories}
                items={sortedRecords}
                subtitle={reportTitle || 'گزارش'} />).toBlob()
                // pdf(<Page1 num={viewMode.value}/>).toBlob()
                .then(blob => {
                    console.log("view", blob);
                    saveAs(blob, 'report.pdf');
                    // window.location.reload();
                })
                .catch(err => {console.error(err)})
        }
    }

    const printRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let colCount = 0;
        let defaultCols = {};

        let headers = {
            // 0: 'ردیف',
            1: 'دسته',
            2: 'شناسه برنامه',
            3: 'شرح',
            4: 'شناسه تعهدی',
            5: 'ورودی',
        };

        if (columns) {
            for (const col in columns) {
                headers = {...headers, [columns[col]._id + 6]: columns[col].title };
                defaultCols = {...defaultCols, [columns[col]._id + 6]: 0 };
                colCount++;
            }
        }

        headers = {...headers,
            99: 'جمع کسورات',
            100: 'خالص درآمدی فعلی',
        }

        console.log("headers", headers);

        const standardData = records.map((r, index) => {
            const program = programs?.find(p => p._id === r.program);
            if (program) {
                const category = categories?.find(c => c._id === program.type)?.title || program.type.toString();

                let d = {
                    // 0: index + 1,
                    1: category,
                    2: program.programCode,
                    3: program.title,
                    4: program.code,
                    5: r.budget,
                    ...defaultCols,
                    99: r.totalDeduction,
                    100: r.netIncome,
                };

                for (const col in r.values) {
                    d = {...d, [r.values[col].column_id + colCount]: r.values[col].value};
                }

                console.log("data", d);
                
                return d;
            }
        });

        standardData.sort((a, b) => a?.[1].localeCompare(b?.[1]));

        const worksheet = XLSX.utils.json_to_sheet(standardData);
        const range = XLSX.utils.decode_range(worksheet['!ref'] as string);

        Object.keys(headers).forEach((key, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].v = headers[key];
                worksheet[cellAddress].s = {
                    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } }, // White, bold, 12pt font
                    fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };   
            }
        });

        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        alignment: { 
                            vertical: "center",
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } }
                        }
                    };
                }
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Write the workbook to a binary string
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, "report.xlsx");
    }
    
    const programs = useLiveQuery(async () => await db.programs.toArray());
    const columns = useLiveQuery(async () => await db.columns.toArray());
    const categories = useLiveQuery(async () => await db.categories.toArray());

    const modalOnCloseHandler = () => {
        setReportTitle('');
        close();
    }
    return (
        <Container fluid>
            <Modal
                opened={opened} 
                onClose={modalOnCloseHandler}
                title={'چاپ گزارش'}>
                <form>
                    <TextInput mb={'md'}
                        label="عنوان گزارش"
                        placeholder="برداشت اول فروردین ماه"
                        onChange={reportTitleChangeHandler} />
                    <Button type="submit" leftSection={<IconPrinter size={16} />} onClick={generateReport}>
                        چاپ pdf
                    </Button>
                    <Button ml={'xs'} variant="transparent" leftSection={<IconFileExcel size={16} />} onClick={printRecord}>
                        چاپ xlsx
                    </Button>
                </form>
            </Modal>
            <form onSubmit={onSearchClickHandler}>
                <Flex align={'end'} gap={'md'}>
                    <Box>
                        <NumberInput maxLength={4} minLength={4}
                            label='سال'
                            placeholder="1404"
                            onChange={setYear}
                            />
                    </Box>
                    <Box>
                        <Select
                            label='ماه'
                            placeholder="فروردین، اردیبهشت و..."
                            data={SHAMSI_MONTHS}
                            onChange={setMonth}
                        />
                    </Box>
                    <Box>
                        <Group>
                            {
                                records && records.length > 0 &&
                                    <Button
                                        w={48}
                                        p={0} m={0}
                                        // onClick={printRecord}>
                                        onClick={open}>
                                    <IconPrinter size={24}/>
                                    </Button>
                            }
                            <Button type="submit" 
                                loading={isLoading} 
                                color={btnState.color} 
                                rightSection={btnState.icon}
                                disabled={!year || !month} >نمایش</Button>
                            <Button 
                                variant="transparent"
                                disabled={!year || !month || (records && records.length > 0)}
                                onClick={onNewRecordClickHandler}>گزارش جدید</Button>
                        </Group>
                    </Box>
                </Flex>
            </form>
            <form onSubmit={onRecordSubmit}>
                {
                    records && records.length > 0 ?
                    categories?.map(cat => {
                        const _programs = programs?.filter(p => p.type === cat._id);
                        const _records = records.filter(r => _programs?.find(p => p._id === r.program));
                            return (<React.Fragment key={cat._id}>
                                <Title order={2} mt={'md'}>{cat.title}</Title>
                                <Table.ScrollContainer minWidth={1500}>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>ردیف</Table.Th>
                                                <Table.Th>شرح</Table.Th>
                                                <Table.Th>شناسه تعهدی</Table.Th>
                                                <Table.Th>ورودی</Table.Th>
                                                {columns?.map(col => <Table.Th key={col._id}>{col.title}</Table.Th>)}
                                                <Table.Th>جمع کسورات</Table.Th>
                                                <Table.Th>خالص درآمد فعلی</Table.Th>
                                                <Table.Th>شناسه برنامه</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {_records.map((record, i) => {
                                                const program = programs?.find(p => p._id === record.program);
                                                if (program) {
                                                    return <TableRow 
                                                        key={record._id}
                                                        index={i + 1}
                                                        columns={columns}
                                                        program={program}
                                                        record={record}
                                                        updateHandler={updateRecords} />
                                                }
                                            })}
                                        </Table.Tbody>
                                        <Table.Tfoot>
                                            <Table.Tr>
                                                <Table.Td></Table.Td>
                                                <Table.Td></Table.Td>
                                                <Table.Td>
                                                    <Text fw={'bold'}>مجموع</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <NumberFormatter
                                                        style={{fontWeight: 'bold'}}
                                                        value={_records.reduce((sum, curRec) => sum + curRec.budget, 0)}
                                                        thousandSeparator />
                                                </Table.Td>
                                                {columns?.map(col => <Table.Td key={col._id}>
                                                    <NumberFormatter
                                                        style={{fontWeight: 'bold'}}
                                                        value={_records.reduce((sum, curRec) => {
                                                            const value = curRec.values.find(c => c.column_id === col._id);
                                                            if (value) {
                                                                return sum + parseFloat(value.value as string);
                                                            }
                                                            return sum;
                                                        }, 0)}
                                                        thousandSeparator />
                                                </Table.Td>)}
                                                <Table.Td>
                                                    <NumberFormatter
                                                        style={{fontWeight: 'bold'}}
                                                        value={_records.reduce((sum, curRec) => sum + curRec.totalDeduction, 0)}
                                                        thousandSeparator />
                                                </Table.Td>
                                                <Table.Td>
                                                    <NumberFormatter
                                                        style={{fontWeight: 'bold'}}
                                                        value={_records.reduce((sum, curRec) => sum + curRec.netIncome, 0)}
                                                        thousandSeparator />
                                                </Table.Td>
                                            </Table.Tr>
                                        </Table.Tfoot>
                                    </Table>
                                </Table.ScrollContainer>
                            </React.Fragment>)
                    })
                    :
                        <Text mt={200}ta={'center'}>داده‌ای برای نمایش وجود ندارد!</Text>
                }
                { records && records.length > 0 &&
                    <Button type="submit"
                        mt={'md'}
                        loading={isLoading} 
                        color={btnState.color} 
                        rightSection={btnState.icon}
                        fullWidth>
                        ثبت
                    </Button>
                }
            </form>
        </Container>
    );
}
