import Category from "@/app/lib/models/category";
import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/app/config/database.js";

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { items } = body;

    try {
        await dbconnect();
        const categories = await Category.insertMany(items);
        return NextResponse.json({ categories }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    try {
        await dbconnect();
        const filter = Object.fromEntries(searchParams.entries());
        const category = await Category.find({...filter});
        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }
}

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { title } = body;

    try {
        await dbconnect();
        const newCategory = await Category.create({title});
        return NextResponse.json({ category: newCategory }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}

export async function PATCH(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { _id, title } = body;

    try {
        await dbconnect();
        const newCategory = await Category.findByIdAndUpdate(_id, {title}, {new: true});
        return NextResponse.json({ category: newCategory }, {status: 201});
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
        const deleted = await Category.findByIdAndDelete(_id);
        return NextResponse.json({ category: deleted }, {status: 201});
    } catch (error) {
        return NextResponse.json({ error }, {status: 401});
    }

}
