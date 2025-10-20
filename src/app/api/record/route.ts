import Record from "@/app/lib/models/record";
import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/app/config/database.js";
import IRecord from "@/app/lib/models/record/type";

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { items } = body;

    try {
        await dbconnect();
        const records = await Record.insertMany(items);
        return NextResponse.json({ records }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    try {
        await dbconnect();
        const filter = Object.fromEntries(searchParams.entries());
        const record = await Record.find({...filter});
        return NextResponse.json({ record }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { program, currentCode, budget, date, month, year, netIncome, prevIncome, totalIncome, totalDeduction, values } = body;

    try {
        await dbconnect();
        const newColumn = await Record.create({ program, currentCode, budget, date, month, year, netIncome, prevIncome, totalIncome, totalDeduction, values });
        return NextResponse.json({ record: newColumn }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}

export async function PATCH(request: Request) {
    // Parse the request body
    const body = await request.json();
    // const { program, currentCode, budget, date, month, year, netIncome, prevIncome, totalIncome, totalDeduction, values, _id } = body;
    console.log(body);
    const { items } = body;

    try {
        await dbconnect();
        const records = await Promise.all(items.map(async (item: IRecord) => {
            const {_id, ...data} = item;
            const record = await Record.findByIdAndUpdate(_id, data, {new: true});
            console.log(_id, ">", record);
            return record;
        }))
        // const newColumn = await Record.findByIdAndUpdate(_id, {program, currentCode, budget, date, month, year, netIncome, prevIncome, totalIncome, totalDeduction, values}, {new: true});
        return NextResponse.json({ records }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}

export async function DELETE(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { _id } = body;

    try {
        await dbconnect();
        console.log(_id);
        const deleted = await Record.findByIdAndDelete(_id);
        return NextResponse.json({ record: deleted }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}
