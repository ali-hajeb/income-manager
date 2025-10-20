import Program from "@/app/lib/models/program";
import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/app/config/database.js";


export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { items } = body;

    try {
        await dbconnect();
        const programs = await Program.insertMany(items);
        return NextResponse.json({ programs }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    try {
        await dbconnect();
        const filter = Object.fromEntries(searchParams.entries());
        const program = await Program.find({...filter}).populate(['cols', 'type']);
        return NextResponse.json({ program }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { code, programCode, title, type, cols } = body;

    try {
        await dbconnect();
        const newColumn = await Program.create({ code, programCode, title, type, cols });
        const populated = await newColumn.populate(['cols', 'type']);
        return NextResponse.json({ program: populated }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}

export async function PATCH(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { code, programCode, title, type, cols, _id } = body;

    try {
        await dbconnect();
        const newColumn = await Program.findByIdAndUpdate(_id, { code, programCode, title, type, cols }, {new: true}).populate(['cols', 'type']);
        return NextResponse.json({ program: newColumn }, {status: 201});
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
        const deleted = await Program.findByIdAndDelete(_id);
        return NextResponse.json({ program: deleted }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}
