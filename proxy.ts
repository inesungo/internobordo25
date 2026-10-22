import { NextResponse } from 'next/server';

// Web tapada: no se expone la API de datos mientras dure el cover.
// Para reabrir, borrar este archivo.
export function proxy() {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ['/api/:path*'],
};
