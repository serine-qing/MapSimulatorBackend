import express from "express";
import axios from "axios";
import md5 from "md5";

const router = express.Router();

const AFDIAN_USER_ID = "981c63621ec711e9ad1552540025c377";
const AFDIAN_TOKEN = "K84VWvd7fC3YAn9eJpNPTMFusyr6gERc";

interface Sponsor {
  name: string;
  amount: string;
  avatar: string;
}

/**
 * 生成爱发电 API 签名
 * sign = md5(token + params{params}ts{ts}user_id{user_id})
 */
function generateSign(paramsJson: string, ts: number): string {
  const signStr = `${AFDIAN_TOKEN}params${paramsJson}ts${ts}user_id${AFDIAN_USER_ID}`;
  return md5(signStr);
}

/**
 * 从爱发电获取赞助者列表
 * API: https://ifdian.net/api/open/query-sponsor
 */
async function fetchSponsorsFromAfdian(page: number = 1): Promise<Sponsor[]> {
  const ts = Math.floor(Date.now() / 1000);
  const paramsJson = JSON.stringify({ page, per_page: 100 });
  const sign = generateSign(paramsJson, ts);

  try {
    const { data } = await axios.post(
      "https://ifdian.net/api/open/query-sponsor",
      {
        user_id: AFDIAN_USER_ID,
        params: paramsJson,
        ts,
        sign,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    if (data.ec === 200 && data.data?.list) {
      return data.data.list.map((item: any) => ({
        name: item.user?.name || "匿名",
        amount: `¥${item.all_sum_amount}`,
        avatar: item.user?.avatar || "",
      }));
    }

    console.error("Afdian API error:", data.em);
    return [];
  } catch (error: any) {
    console.error("Failed to fetch sponsors:", error.message);
    return [];
  }
}

// 获取赞助名单
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const sponsors = await fetchSponsorsFromAfdian(page);
    res.json({ success: true, data: sponsors });
  } catch (error) {
    console.error("Error in /sponsors:", error);
    res.status(500).json({ success: false, error: "获取赞助名单失败" });
  }
});

export default router;
