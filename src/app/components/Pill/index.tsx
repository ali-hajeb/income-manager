import React from "react";
import { Button, Group, Paper, Text } from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons-react";

export interface PillsProps {
    id?: string;
    title: string;
    editHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    deleteHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export function Pill({
    id,
    title,
    editHandler,
    deleteHandler
}: PillsProps) {
    return (
        <Paper bg={'grape'} bdrs={'md'}> 
            <Group>
                <Text c={'white'} mx={'sm'}>{title}</Text>
                <div>
                    <Button 
                        variant="transparent" 
                        p={0} m={0} 
                        data-id={id}
                        onClick={editHandler}>
                        <IconPencil color={'white'} size={16}/>
                    </Button>
                    <Button 
                        variant="transparent" 
                        p={0} m={0} 
                        mx={'xs'}
                        data-id={id}
                        onClick={deleteHandler}>
                        <IconX color={'white'} size={16}/>
                    </Button>
                </div>
            </Group>
        </Paper>
    );
}
