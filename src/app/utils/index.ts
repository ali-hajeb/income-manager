import type IRecord from '../lib/models/record/type';
import type IColumn from '../lib/models/column/type';
import type { IProgramPopulated } from '../lib/models/program/type';
import type { ICellValue } from '../lib/models/record/type';

/**
 * Updates the record when the budget input changes.
 * Recalculates all auto column values based on the new budget.
 * Preserves existing non-auto values and ensures all program columns have a cell entry.
 * @param record The current record
 * @param newBudget The new budget value (parsed from input)
 * @param program The populated program with columns
 * @returns Updated record
 */
export function updateRecordOnBudgetChange(
    record: IRecord,
    newBudget: number,
    program: IProgramPopulated
): IRecord {
    const updatedRecord = { ...record, budget: newBudget };

    // Regenerate values for all enabled columns in the program
    updatedRecord.values = program.cols.map((col, index) => {
        if (col) {
            const existingCell = record.values.find((cv) => cv.column_id === col._id);
            let value: string | number;

            if (col.auto) {
                // Calculate auto value as percentage of new budget
                value = (col.percentage / 100) * newBudget;
            } else {
                // Preserve existing non-auto value or default to 0 if none exists
                value = existingCell ? existingCell.value : 0;
            }

            return {
                column_id: col._id,
                column_title: col.title,
                value,
            };
        } else {
            return record.values[index];
        }
    });

    // Optionally calculate other totals here if needed (e.g., totalDeduction as sum of specific cells)
    // Example: updatedRecord.totalDeduction = calculateTotalDeduction(updatedRecord.values);

    return updatedRecord;
}

/**
 * Updates a specific non-auto cell value in the record when its input changes.
 * Does nothing if the column is auto (since autos are calculated).
 * Creates a new cell if it doesn't exist.
 * @param record The current record
 * @param columnId The _id of the column being updated
 * @param newValue The new value (from input; can be string or number)
 * @param program The populated program with columns
 * @returns Updated record
 */
export function updateRecordOnCellChange(
    record: IRecord,
    columnId: string,
    newValue: string | number,
    program: IProgramPopulated
): IRecord {
    const col = program.cols.find((c) => c._id === columnId);
    if (!col || col.auto) {
        // Don't update if column not found or if it's auto (autos are read-only/calculated)
        return record;
    }

    const updatedValues: ICellValue[] = [...record.values];
    const cellIndex = updatedValues.findIndex((cv) => cv.column_id === columnId);

    if (cellIndex !== -1) {
        // Update existing cell
        updatedValues[cellIndex] = {
            ...updatedValues[cellIndex],
            value: newValue,
        };
    } else {
        // Create new cell if it doesn't exist
        updatedValues.push({
            column_id: columnId,
            column_title: col.title,
            value: newValue,
        });
    }

    return { ...record, values: updatedValues };
}

/**
 * Updates the currentCode field in the record when its input changes.
 * No calculations needed for this field.
 * @param record The current record
 * @param newCode The new currentCode value (from input)
 * @returns Updated record
 */
export function updateRecordOnCodeChange(record: IRecord, newCode: string): IRecord {
    return { ...record, currentCode: newCode };
}
