const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// 获取今日语录
// 获取今日语录
router.get('/today', async (req, res) => {
  const lang = req.query.lang || 'zh';
  const today = new Date().toISOString().slice(0, 10); // MM-DD

  // 查询今日的全部语录
  const { data, error } = await supabase
    .from('quotes')
    .select(`text_${lang}, author, tag`)
    .eq('date', today)
    .limit(10); // 限定最多10条，防止太多

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data && data.length > 0) {
    // 随机选一条返回
    const i = Math.floor(Math.random() * data.length);
    return res.json(data[i]);
  }

  // 查询通用语录
  const { data: anyData, error: anyError } = await supabase
    .from('quotes')
    .select(`text_${lang}, author, tag`)
    .eq('date', 'any');

  if (anyError) {
    return res.status(500).json({ error: anyError.message });
  }

  if (anyData && anyData.length > 0) {
    const i = Math.floor(Math.random() * anyData.length);
    return res.json(anyData[i]);
  } else {
    return res.status(404).json({ error: 'No quotes found for today or any day.' });
  }
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
