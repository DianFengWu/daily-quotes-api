const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// 获取今日语录
router.get('/today', async (req, res) => {
  const lang = req.query.lang || 'zh';
  const today = new Date().toISOString().slice(5, 10); // MM-DD

  const { data, error } = await supabase
    .from('quotes')
    .select(`text_${lang}, author, tag`)
    .eq('date', today)
    .single();

  if (!data) {
    const { data: anyData } = await supabase
      .from('quotes')
      .select(`text_${lang}, author, tag`)
      .eq('date', 'any');

    const i = new Date().getDate() % anyData.length;
    return res.json(anyData[i]);
  }

  res.json(data);
});

// 添加语录
router.post('/', async (req, res) => {
  const { date, text_en, text_zh, author, tag } = req.body;

  const { data, error } = await supabase
    .from('quotes')
    .insert([{ date, text_en, text_zh, author, tag }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
