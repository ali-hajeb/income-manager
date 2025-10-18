import React from 'react';
import { Container } from '@mantine/core';
import ColumnSetting from '@/app/components/ColumnSetting';
import CategorySetting from '@/app/components/CategorySetting';
import ProgramSetting from '@/app/components/ProgramSetting';

export interface SettingsPanelProps {
}

export default function SettingsPanel({}: SettingsPanelProps) {
    return (
        <Container fluid>
            <ColumnSetting />
            <CategorySetting />
            <ProgramSetting />
        </Container>
    );
}
