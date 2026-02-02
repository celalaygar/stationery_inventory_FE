
// app/api/v2/project/route.ts
import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const BOOK_URL = "book"


export async function GET(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const pId = await (await params).id;
    return RouteBaseService.request(URL + BOOK_URL + "/" + pId, {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const body = await req.json();
    return RouteBaseService.request(URL + BOOK_URL + "/" + pId, {
        method: httpMethods.PUT,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        body: body,
        // withAuth default: true
    });
}

export async function DELETE(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const pId = await (await params).id;
    return RouteBaseService.request(URL + BOOK_URL + "/" + pId, {
        method: httpMethods.DELETE,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}