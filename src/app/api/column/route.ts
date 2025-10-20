import Column from "@/app/lib/models/column";
import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/app/config/database.js";

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { items } = body;

    try {
        await dbconnect();
        const columns = await Column.insertMany(items);
        return NextResponse.json({ columns }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    try {
        await dbconnect();
        const filter = Object.fromEntries(searchParams.entries());
        const column = await Column.find({...filter});
        return NextResponse.json({ column }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { title, auto, percentage, code } = body;

    try {
        await dbconnect();
        const newColumn = await Column.create({ title, auto, percentage, code });
        return NextResponse.json({ column: newColumn }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}

export async function PATCH(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { _id, title, auto, percentage, code } = body;

    try {
        await dbconnect();
        const newColumn = await Column.findByIdAndUpdate(_id, { title, auto, percentage, code }, {new: true});
        return NextResponse.json({ column: newColumn }, {status: 201});
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
        const deleted = await Column.findByIdAndDelete(_id);
        return NextResponse.json({ column: deleted }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}
