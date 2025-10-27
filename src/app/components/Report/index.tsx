import React from 'react';
import { Document, Page, Text as PdfText, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { numberWithCommas, toFarsiNumber } from '@/app/utils/number';
import { shamsi, shamsiDateTime } from '@/app/utils/date';
import getVazirRegularBase64 from '@/app/constants/Vazirmatn-Regular.js';
import getVazirBoldBase64 from '@/app/constants/Vazirmatn-Regular.js';
import logoImage from '@/app/logo.png';
import IRecord from '@/app/lib/models/record/type';
import IColumn from '@/app/lib/models/column/type';
import IProgram, { IProgramPopulated } from '@/app/lib/models/program/type';
import ICategory from '@/app/lib/models/category/type';

Font.register({
    family: 'Vazir',
    fonts: [
        {src: 'data:font/truetype;base64,' + getVazirRegularBase64(), fontWeight: 'normal' }, // Adjust path based on your project structure
        {src: 'data:font/truetype;base64,' + getVazirBoldBase64(), fontWeight: 'bold'}, // Adjust path based on your project structure
    ]
});

// Font.register({
//     family: 'Vazir',
//     fonts: [
//         {src: '/fonts/Vazirmatn-Regular.ttf', fontWeight: 'normal' }, // Adjust path based on your project structure
//         {src: '/fonts/Vazirmatn-Bold.ttf', fontWeight: 'bold'}, // Adjust path based on your project structure
//     ]
// });

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Vazir',
        direction: 'rtl', // Right-to-left for Persian
        padding: 16,
        fontSize: 8,
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1px solid #000',
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row-reverse',
        borderBottom: '1px solid #000',
    },
    tableHeader: {
        backgroundColor: '#ccc',
        fontWeight: 'bold',
        padding: 4,
        textAlign: 'center',
    },
    tableCell: {
        padding: 4,
        borderLeft: '1px solid #000',
        direction: 'rtl',
        textAlign: 'right',
        fontSize: 6,
        flex: 4, // Equal column widths; adjust as needed
    },
    tableCellHeader: {
        backgroundColor: '#ccc',
        fontSize: 8,
        fontWeight: "bold",
        flex: 1,
    },
    signBoxRow: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: 20,
        justifyContent: 'space-evenly',
    },
    signBoxCell: {
        // border: '1px solid #000',
        borderRadius: 8,
        padding: 8,
        flex: 1,
        paddingBottom: 40
    },
    listHeader: {
        fontSize: 8,
        flex: 1,
    },
    listCell: {
        textAlign: 'center',
        fontSize: 6,
        flex: 1
    },
    bold: {
        fontWeight: 'bold'
    },
    textCenter: {
        textAlign: 'center',
    },
    bgGrey: {
        backgroundColor: '#ccc',
    },
    summary: {
        marginTop: 20,
        textAlign: 'right',
    },
});

export interface ListReportPageProps {
    title: string;
    subtitle: string;
    columns: IColumn[];
    items: IRecord[];
    programs: IProgram[];
    categories: ICategory[];
}

export default function ListReportPage({title, subtitle, columns, items, programs, categories}: ListReportPageProps) {
    return (
        <Document>
            <Page size={'A4'} orientation='landscape' style={styles.page}>
                <View fixed>
                    <Image src={logoImage.src} style={{width: 48, height: 48, margin: '0 auto'}}/>
                    <PdfText style={styles.header}>دانشکده علوم پزشکی بهبهان</PdfText>
                    <View style={[styles.tableRow, {border: '0', alignItems: 'flex-end'}]}>
                        <PdfText style={[styles.tableCell, {border: '0', fontSize: 10}]}>{toFarsiNumber(subtitle)}</PdfText>
                        <PdfText style={[styles.tableCell, {fontSize: 12, textAlign: 'center', border: '0'}]}>{toFarsiNumber(title)}</PdfText>
                        <PdfText style={[styles.tableCell, {textAlign: 'left', border: '0', fontSize: 10}]}>{`مورخه: ${toFarsiNumber(shamsi(new Date().toISOString()))}`}</PdfText>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>دسته</PdfText>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, {flex: 2}]}>شناسه برنامه</PdfText>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, {flex: 2}]}>شرح</PdfText>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>شناسه تعهدی</PdfText>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>ورودی</PdfText>
                            {
                                columns.map(col => <PdfText key={col._id} style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>
                                    {col.title}
                                </PdfText>)
                            }
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>جمع کسورات</PdfText>
                            <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}>خالص درآمد فعلی</PdfText>
                        </View>
                    </View>
                </View>
                <View style={styles.table}>
                    {items && items.map((item, i) => { 
                        const program = programs.find(p => p._id === item.program);
                        if (program) {
                            const category = categories.find(cat => cat._id === program.type);
                            if (category) {
                                return <View style={styles.tableRow} key={i} break={i >= 15}>
                                    <PdfText style={[styles.tableCell, styles.listCell]}>{category.title}</PdfText>
                                    <PdfText style={[styles.tableCell, styles.listCell, {flex: 2}]}>{program.programCode}</PdfText>
                                    <PdfText style={[styles.tableCell, styles.listCell, {flex: 2}]}>{program.title}</PdfText>
                                    <PdfText style={[styles.tableCell, styles.listCell]}>{toFarsiNumber(item.currentCode)}</PdfText>
                                    <PdfText style={[styles.tableCell, styles.listCell]}>{toFarsiNumber(numberWithCommas(parseInt(item.budget.toFixed(0))))}</PdfText>
                                    {
                                        columns.map(col => {
                                            const value = item.values.find(v => v.column_id === col._id);
                                            if (value) {
                                                return <PdfText key={col._id + value.value} style={[styles.tableCell, styles.listCell]}>{toFarsiNumber(numberWithCommas(parseInt((value.value as number).toFixed(0))))}</PdfText>;
                                            }
                                            return <PdfText key={col._id} style={[styles.tableCell, styles.listCell]}></PdfText>
                                        })
                                    }
                                    <PdfText style={[styles.tableCell, styles.listCell]}>{toFarsiNumber(numberWithCommas(parseInt(item.totalDeduction.toFixed(0))))}</PdfText>
                                    <PdfText style={[styles.tableCell, styles.listCell]}>{toFarsiNumber(numberWithCommas(parseInt(item.netIncome.toFixed(0))))}</PdfText>
                                </View>}}
                        })
                    }
                    <View style={styles.tableRow}>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}></PdfText>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, {flex: 2}]}></PdfText>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, styles.bold, {flex: 2}]}>جمع کل</PdfText>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader]}></PdfText>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, styles.bold, {fontSize: 6}]}>
                            {
                                toFarsiNumber(numberWithCommas(parseInt(items.reduce((sum, cur) => sum + cur.budget, 0).toFixed(0))))
                            }
                        </PdfText>
                        {
                            columns.map(col => {
                                const values = items.map(item => {
                                    return item.values.find(v => v.column_id === col._id);
                                });
                                if (values) {
                                    const total = values.reduce((sum, cur) => sum + (parseFloat(cur?.value as string || '0')), 0);
                                    return <PdfText key={col._id} 
                                        style={[styles.tableCell, styles.tableHeader, styles.textCenter, styles.listHeader, styles.bold, {fontSize: 6}]}>
                                        {toFarsiNumber(numberWithCommas(parseInt(total.toFixed(0))))}
                                    </PdfText>;
                                }
                            })
                        }
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, styles.bold, {fontSize: 6}]}>
                            {
                                toFarsiNumber(numberWithCommas(parseInt(items.reduce((sum, cur) => sum + cur.totalDeduction, 0).toFixed(0))))
                            }
                        </PdfText>
                        <PdfText style={[styles.tableCell, styles.tableHeader, styles.listHeader, styles.bold, {fontSize: 6}]}>
                            {
                                toFarsiNumber(numberWithCommas(parseInt(items.reduce((sum, cur) => sum + cur.netIncome, 0).toFixed(0))))
                            }
                        </PdfText>
                    </View>
                </View>
                <View style={styles.subheader}></View>
                <View style={[styles.signBoxRow]}>
                    <View style={styles.signBoxCell}>
                        <PdfText style={[styles.textCenter, styles.bold]}>کارشناس بودجه</PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                    </View>
                    <View style={styles.signBoxCell}>
                        <PdfText style={[styles.textCenter, styles.bold]}>مدیر بودجه و پایش عملکرد</PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                    </View>
                    <View style={styles.signBoxCell}>
                        <PdfText style={[styles.textCenter, styles.bold]}>معاونت توسعه و مدیریت منابع</PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                        <PdfText style={[styles.textCenter, styles.bold]}></PdfText>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
