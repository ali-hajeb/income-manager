'use client'
import React, { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import axios from 'axios';
import ColumnSetting from '@/app/components/ColumnSetting';
import CategorySetting from '@/app/components/CategorySetting';
import ProgramSetting from '@/app/components/ProgramSetting';
import type IColumn from '@/app/lib/models/column/type';
import type ICategory from '@/app/lib/models/category/type';
import type {IProgramPopulated} from '@/app/lib/models/program/type';

export interface SettingsPanelProps {
}

export default function SettingsPanel({}: SettingsPanelProps) {
    const [columns, setColumns] = useState<IColumn[] | null>(null);
    const [categories, setCategories] = useState<ICategory[] | null>(null);
    const [programs, setPrograms] = useState<IProgramPopulated[] | null>(null);

    useEffect(() => {
        axios.get('/api/column')
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

        axios.get('/api/category')
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

        axios.get('/api/program')
            .then((res) => {
                if (res.data && res.data.program) {
                    setPrograms(res.data.program);
                }
            })
            .catch((err) => {
                console.log("setting>program", err);
            })
            .finally(() => {
            });
    }, []);

    useEffect(() => {
    }, [columns, categories]);
    return (
        <Container fluid>
            <ColumnSetting columns={columns} setColumnsData={setColumns}/>
            <CategorySetting categories={categories} setCategoryData={setCategories}/>
            <ProgramSetting programs={programs} categories={categories} columns={columns} setPrograms={setPrograms}/>
        </Container>
    );
}
