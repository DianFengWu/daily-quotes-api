{\rtf1\ansi\ansicpg936\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const router = express.Router();\
const supabase = require('../supabase');\
\
router.get('/today', async (req, res) => \{\
  const lang = req.query.lang || 'zh';\
  const today = new Date().toISOString().slice(5, 10); // MM-DD\
\
  const \{ data, error \} = await supabase\
    .from('quotes')\
    .select(`text_$\{lang\}, author, tag`)\
    .eq('date', today)\
    .single();\
\
  if (!data) \{\
    const \{ data: anyData \} = await supabase\
      .from('quotes')\
      .select(`text_$\{lang\}, author, tag`)\
      .eq('date', 'any');\
\
    const i = new Date().getDate() % anyData.length;\
    return res.json(anyData[i]);\
  \}\
\
  res.json(data);\
\});\
\
router.post('/', async (req, res) => \{\
  const \{ date, text_en, text_zh, author, tag \} = req.body;\
\
  const \{ data, error \} = await supabase\
    .from('quotes')\
    .insert([\{ date, text_en, text_zh, author, tag \}]);\
\
  if (error) return res.status(500).json(\{ error: error.message \});\
  res.status(201).json(data);\
\});\
\
module.exports = router;}