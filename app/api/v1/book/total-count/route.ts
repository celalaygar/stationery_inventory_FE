

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { httpMethods } from '@/lib/service/HttpService';

const URL = process.env.BASE_V2_URL
const BOOK = "book"

export async function GET(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    return RouteBaseService.request(URL + BOOK + "/total-count", {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
