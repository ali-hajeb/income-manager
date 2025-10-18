'use client'
import React, { useState } from 'react';
import { Container, Paper, Tabs } from "@mantine/core";
import { IconSettings, IconTable } from '@tabler/icons-react';
import SettingsPanel from '../SettingsPanel';
import HomePanel from '../HomePanel';

export interface MainPanelProps {
}

export default function MainPanel({}: MainPanelProps) {
    const [activeTab, setActiveTab] = useState<string | null>('monthly-report');
    return (
        <Container fluid>
            <Tabs variant='pills' value={activeTab} onChange={setActiveTab}>
                <Paper bg={'white'} shadow='lg' radius={'md'} mb={'sm'} p={'xs'}>
                    <Tabs.List >
                        <Tabs.Tab value="monthly-report" leftSection={<IconTable size={16}/>}>گزارش ماهانه</Tabs.Tab>
                        <Tabs.Tab value="setting" leftSection={<IconSettings size={16}/>}>تنظیمات</Tabs.Tab>
                    </Tabs.List>
                </Paper>
                <Paper bg={'white'} shadow='lg' radius={'md'} mih={500} p={'sm'} >
                    <Tabs.Panel value="monthly-report">
                        <HomePanel />
                    </Tabs.Panel>
                    <Tabs.Panel value="setting">
                        <SettingsPanel />
                    </Tabs.Panel>
                </Paper>
            </Tabs>
        </Container>
    )
}
