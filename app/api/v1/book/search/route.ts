

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { httpMethods } from '@/lib/service/HttpService';

const URL = process.env.BASE_V2_URL
const BOOK = "book"

export async function POST(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const body = await req.json();
    return RouteBaseService.request(URL + BOOK + "/search", {
        method: httpMethods.POST,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        body: body,
        // withAuth default: true
    });
}
