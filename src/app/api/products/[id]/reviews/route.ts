import { NextRequest, NextResponse } from 'next/server';
import { addProductReview, deleteProductReview, verifyAdminToken } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.reviewerName || !body.comment || !body.rating) {
      return NextResponse.json(
        { success: false, error: 'Reviewer name, rating, and comment are required' },
        { status: 400 }
      );
    }

    const updatedProduct = await addProductReview(id, {
      reviewerName: body.reviewerName,
      rating: Number(body.rating),
      comment: body.comment,
      verifiedBuyer: body.verifiedBuyer ?? true
    });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

// DELETE: Owner deletes review from product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Owner token required.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid or expired owner token.' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    const updatedProduct = await deleteProductReview(id, reviewId);
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct, message: 'Review successfully deleted.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
  }
}
