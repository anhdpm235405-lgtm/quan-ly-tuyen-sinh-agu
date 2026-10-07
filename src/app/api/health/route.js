import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  const result = {
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    },
    database: {
      status: 'pending',
    },
  };

  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      result.database.status = 'connected';
      result.database.message = 'Kết nối MongoDB thành công!';
    } else {
      result.database.status = 'missing_env';
      result.database.message = 'Chưa cấu hình MONGODB_URI';
    }
  } catch (error) {
    result.database.status = 'error';
    result.database.message = error.message || 'Lỗi kết nối MongoDB';
  }

  return NextResponse.json(result);
}
