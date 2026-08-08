import express from 'express'
import axios from 'axios'
import { URLSearchParams } from 'url'
const router = express.Router()

router.post('/recognize', async (req: any, res: any) => {
  try {
    const { image } = req.body
    if (!image) {
      return res.status(400).json({ error: '缺少image字段' })
    }

    const params = new URLSearchParams()
    params.append('base64Image', image)
    params.append('language', 'chs')
    params.append('isOverlayRequired', 'false')
    params.append('OCREngine', '2')

    const response = await axios.post(
      'https://api.ocr.space/parse/image',
      params.toString(),
      {
        headers: {
          'apikey': 'K85587504288957',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('===== OCR.space 原始结果 =====')
    console.log(JSON.stringify(response.data, null, 2))
    console.log('===== 结束 =====')

    const lines: { text: string, score: number }[] = []
    if (response.data?.ParsedResults) {
      for (const result of response.data.ParsedResults) {
        if (result.ParsedText) {
          const textLines = result.ParsedText.split('\n').map((l: string) => l.trim()).filter(Boolean)
          textLines.forEach((text: string) => {
            lines.push({ text, score: 0.9 })
          })
        }
      }
    }

    console.log('处理后的lines:', lines)
    res.json({ lines })
  } catch (err: any) {
    res.status(500).json({ error: err.message || '识别失败' })
  }
})

export default router