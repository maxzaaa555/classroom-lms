import { NextRequest, NextResponse } from 'next/server';
import { drive } from '@/lib/googleDrive';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fileId } = await params;
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') === 'download' ? 'attachment' : 'inline';

    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
    });

    const fileName = encodeURIComponent(fileMeta.data.name || 'document.pdf');
    const mimeType = fileMeta.data.mimeType || 'application/pdf';

    const driveResponse = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const headers = new Headers({
      'Content-Type': mimeType,
      'Content-Disposition': `${mode}; filename*=UTF-8''${fileName}`,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    });

    return new NextResponse(driveResponse.data as unknown as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Attachment route error:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}