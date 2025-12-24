'use client'
import React, { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Group, Modal, NumberFormatter, NumberInput, Select, Table, Text, TextInput, Title } from "@mantine/core";
import * as XLSX from 'xlsx';
import { IconCheck, IconExclamationCircle, IconFileExcel, IconPrinter } from "@tabler/icons-react";
import { saveAs } from 'file-saver';
import { pdf } from "@react-pdf/renderer";
import { SHAMSI_MONTHS } from "@/app/constants/months";
import IRecord from "@/app/lib/models/record/type";
import TableRow from "@/app/components/HomeTable/TableRow";
import { editRecord, getRecord } from "@/app/lib/models/record";
import { IButtonState } from "@/app/types";
import { insertManyRecords } from "@/app/lib/models/record/controllers";
import IColumn from "@/app/lib/models/column/type";
import { IProgramPopulated } from "@/app/lib/models/program/type";
import ICategory from "@/app/lib/models/category/type";
import { useDisclosure } from "@mantine/hooks";
import ListReportPage from "@/app/components/Report";
import { numberWithCommas, toFarsiNumber } from "@/app/utils/number";
import axiosInstance from "@/app/config/axiosInstance";

// export interface HomePanelProps {
// }

export default function HomePanel() {
    const [isLoading, setLoading] = useState(false);
    const [btnState, setBtnState] = useState<IButtonState>({color: undefined, icon: undefined})
    const [records, setRecords] = useState<IRecord[]>([]);
    const [withdrawalOptions, setWithdrawalOptions] = useState<string[]>([]);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
    const [withdrawalDesc, setWithdrawalDesc] = useState<string>('');
    const [editMode, setEditMode] = useState(false);
    const [year, setYear] = useState<number | string>('');
    const [month, setMonth] = useState<typeof SHAMSI_MONTHS[number] | null>(null);

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
                if (selectedWithdrawal) {
                    if (recs && recs.data.record) {
                        setRecords((recs.data.record as IRecord[]).filter(item => item.withdrawalDesc === selectedWithdrawal));
                        setWithdrawalDesc(selectedWithdrawal);
                    }
                    setEditMode(true);
                    setBtnState({color: 'green', icon: <IconCheck size={16}/>});
                } else {
                    if (recs && recs.data.record) {
                        console.log('data', recs.data.record);
                        const wOpts = [...new Set((recs.data.record as IRecord[]).map(item => item.withdrawalDesc))];
                        console.log('wopt', wOpts);
                        if (wOpts.length > 0) {
                            setWithdrawalOptions(wOpts);
                        }
                    }
                }
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

    const onSaveAndRest = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (editMode) {
                const _recs = records.map(r => {
                    return {...r, withdrawalDesc: withdrawalDesc};
                });
                const res = await editRecord(_recs);
                if (res && res.data.records) {
                    setRecords(res.data.records)
                }
            } else {
                const _recs = records.map(r => {
                    const {_id, ...data} = r;
                    return {...data, withdrawalDesc: withdrawalDesc};
                });
                const res = await insertManyRecords(_recs);
                if (res && res.data.records) {
                    setRecords(res.data.records)
                    setEditMode(true);
                }
            }
            // await Promise.all(records.map(async (r) => {
            //     if (editMode) {
            //         return await editRecord(r);
            //     } else {
            //         return await createRecord(r);
            //     }
            // }));
            setBtnState({color: 'green', icon: <IconCheck size={16}/>});
            setRecords([]);
            setYear('');
            setMonth(null);
            setWithdrawalDesc('');
            setSelectedWithdrawal(null);
            setWithdrawalOptions([]);
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
            if (editMode) {
                const _recs = records.map(r => {
                    return {...r, withdrawalDesc: withdrawalDesc};
                });
                const res = await editRecord(_recs);
                if (res && res.data.records) {
                    setRecords(res.data.records)
                }
            } else {
                const _recs = records.map(r => {
                    const {_id, ...data} = r;
                    return {...data, withdrawalDesc: withdrawalDesc};
                });
                const res = await insertManyRecords(_recs);
                if (res && res.data.records) {
                    setRecords(res.data.records)
                    setEditMode(true);
                }
            }
            // await Promise.all(records.map(async (r) => {
            //     if (editMode) {
            //         return await editRecord(r);
            //     } else {
            //         return await createRecord(r);
            //     }
            // }));
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
                if (recs && recs.data.record && recs.data.record.length > 0) {
                    const filteredRecords = (recs?.data.record as IRecord[]).filter(item => item.withdrawalDesc === selectedWithdrawal);
                    if (filteredRecords.length > 0) {
                        alert('گزارش این ماه قبلا ایجاد شده‌است!');
                        setSelectedWithdrawal(null);
                        return;
                    }
                }
            } catch (error) {
                console.error(error);
            }
            const defaultRecords = programs?.map((program, idx) => {
                const values = program.cols.map(col => {
                    const column = columns?.find(c => c._id === col._id);
                    if (column) {
                        return ({column_id: column._id, column_title: column.title, value: 0})
                    }
                });
                return ({
                    _id: idx.toString(),
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
    
    const [columns, setColumns] = useState<IColumn[] | null>(null);
    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const [programs, setPrograms] = useState<IProgramPopulated[] | null>(null);

    useEffect(() => {
        axiosInstance.get('/column')
            .then((res) => {
                if (res.data && res.data.column) {
                    setColumns(res.data.column);
                }
            })
            .catch((err) => {
                console.log("setting>column", err);
            })
            .finally(() => {
            });

        axiosInstance.get('/category')
            .then((res) => {
                if (res.data && res.data.category) {
                    setCategories(res.data.category);
                }
            })
            .catch((err) => {
                console.log("setting>category", err);
            })
            .finally(() => {
            });

        axiosInstance.get('/program')
            .then((res) => {
                if (res.data && res.data.program) {
                    console.log('prog', res.data.program);
                    setPrograms(res.data.program);
                }
            })
            .catch((err) => {
                console.log("setting>program", err);
            })
            .finally(() => {
            });
    }, []);
    // const programs = useLiveQuery(async () => await db.programs.toArray());
    // const columns = useLiveQuery(async () => await db.columns.toArray());
    // const categories = useLiveQuery(async () => await db.categories.toArray());
    const generateReport = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (columns && programs && records && categories) {
            const sortedRecords = [...records].sort((a, b) => {
                const programA = programs.find(p => p._id === a.program);
                const programB = programs.find(p => p._id === b.program);
                if (programA && programB) {
                    console.log('gen',programA, programB);
                    return programA.type.title.localeCompare(programB.type.title);
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

    const printRecord = () => {
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
            let i = 6;
            for (const col in columns) {
                headers = {...headers, [i]: columns[col].title };
                defaultCols = {...defaultCols, [i]: 0 };
                colCount++;
                i++;
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
                const category = categories?.find(c => c._id === program.type._id)?.title || program.type.toString();

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

                let i = 6;
                for (const col in r.values) {
                    d = {...d, [i++]: parseFloat(r.values[col].value as string)};
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
                console.log('header[ley]', headers[key]);
            }
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Write the workbook to a binary string
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, "report.xlsx");
    }

    const [reportTitle, setReportTitle] = useState<string>(withdrawalDesc || '');
    const [opened, {open, close}] = useDisclosure(false);

    const reportTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReportTitle(e.currentTarget.value);
    }

    const reportWithdrawalDescChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWithdrawalDesc(e.currentTarget.value);
    }

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
                        value={reportTitle}
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
                            value={year}
                            onChange={setYear}
                            />
                    </Box>
                    <Box>
                        <Select
                            label='ماه'
                            placeholder="فروردین، اردیبهشت و..."
                            data={SHAMSI_MONTHS}
                            value={month}
                            onChange={setMonth}
                        />
                    </Box>
                    {
                        withdrawalOptions.length > 0 && <Box>
                            <Select
                                label="برداشت"
                                placeholder="سند برداشت را انتخاب کنید"
                                data={withdrawalOptions}
                                onChange={setSelectedWithdrawal}
                                value={selectedWithdrawal} />
                        </Box>
                    }
                    <Box>
                        <Group>
                            {
                                records && records.length > 0 &&
                                    <Button
                                        w={48}
                                        p={0} m={0}
                                        // onClick={printRecord}>
                                        onClick={() => {
                                            console.log(withdrawalDesc);
                                            setReportTitle(withdrawalDesc);
                                            open();
                                        }}>
                                    <IconPrinter size={24}/>
                                    </Button>
                            }
                            <Button type="submit" 
                                loading={isLoading} 
                                color={btnState.color} 
                                rightSection={btnState.icon}
                                disabled={!year || !month} >نمایش</Button>
                            {
                                records && records.length > 0 &&
                                    <Button 
                                        variant="outline"
                                        loading={isLoading} 
                                        color={btnState.color} 
                                        rightSection={btnState.icon}
                                        onClick={onSaveAndRest}
                                        disabled={!year || !month} >ذخیره و بازگشت</Button>
                            }
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
                        <>
                            <Title order={2} mt={'md'}>نام سند برداشت</Title>
                            <TextInput
                                mt={'md'}
                                // label="نام سند برداشت"
                                placeholder="نمونه: برداشت مرحله اول مهرماه 1404"
                                value={withdrawalDesc}
                                onChange={reportWithdrawalDescChangeHandler}
                                />
                    { categories?.map(cat => {
                        const _programs = programs?.filter(p => p.type._id === cat._id);
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
                                                        key={i}
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
                    })}
                    </>:
                        <Text mt={200}ta={'center'}>داده‌ای برای نمایش وجود ندارد!</Text>
                }
                {
                    records && records.length > 0 && <>
                        <Title order={2} mt={'md'}>جمع کل</Title>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>کل ورودی</Table.Th>
                                    {
                                        columns?.map(col => <Table.Th key={col._id}>مجموع {col.title}</Table.Th>)

                                    }
                                    <Table.Th>کل کسورات</Table.Th>
                                    <Table.Th>کل درآمد خالص</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>{toFarsiNumber(numberWithCommas(parseInt(records.reduce((sum, cur) => sum + cur.budget, 0).toFixed(0))))}</Table.Td>
                                    {
                                        columns?.map(col => {
                                            const values = records.map(rec => rec.values.find(v => v.column_id === col._id))
                                            if (values) {
                                                const total = values.reduce((sum, cur) => sum + (parseFloat(cur?.value as string || '0')), 0);
                                                return <Table.Td key={col._id}>{toFarsiNumber(numberWithCommas(parseInt(total.toFixed(0))))}</Table.Td>
                                            }
                                        })

                                    }
                                    <Table.Td>{toFarsiNumber(numberWithCommas(parseInt(records.reduce((sum, cur) => sum + cur.totalDeduction, 0).toFixed(0))))}</Table.Td>
                                    <Table.Td>{toFarsiNumber(numberWithCommas(parseInt(records.reduce((sum, cur) => sum + cur.netIncome, 0).toFixed(0))))}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </>
                }
                { records && records.length > 0 &&
                    <Button type="submit"
                        mt={'md'}
                        loading={isLoading} 
                        color={btnState.color} 
                        rightSection={btnState.icon}
                        disabled={!editMode && withdrawalOptions.includes(withdrawalDesc)}
                        fullWidth>
                        ثبت
                    </Button>
                }
            </form>
        </Container>
    );
}
