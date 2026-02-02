

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { httpMethods } from '@/lib/service/HttpService';

const URL = process.env.BASE_V2_URL
const CATEGORY = "category"


export async function PUT(req: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const body = await req.json();
    const type = await (await params).type;
    return RouteBaseService.request(URL + CATEGORY + "/count/" + type, {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
