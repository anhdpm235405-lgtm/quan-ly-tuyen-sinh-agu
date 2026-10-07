const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ Cảnh báo: Biến môi trường MONGODB_URI chưa được thiết lập!');
    return;
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
  }
};

connectDB();

// Route trang chủ
app.get('/', (req, res) => {
  res.json({
    project: 'QLTS AGU — Hệ thống Quản Lý Tuyển Sinh / Tài Sản AGU',
    role: 'DevOps 2 Service',
    status: 'Running',
    documentation: '/api/health'
  });
});

// Route kiểm tra sức khỏe hệ thống (Health Check cho DevOps 2 nghiệm thu)
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      port: PORT,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasGeminiKey: hasGeminiKey
    },
    database: {
      status: isMongoConnected ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
      message: isMongoConnected ? 'MongoDB kết nối thành công' : 'Chưa kết nối được MongoDB'
    },
    gemini: {
      status: hasGeminiKey ? 'ready' : 'missing_key',
      message: hasGeminiKey ? 'Gemini API Key đã sẵn sàng' : 'Chưa cấu hình GEMINI_API_KEY'
    }
  });
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại cổng http://localhost:${PORT}`);
});
