// api/youtube-latest.js
export default async function handler(req, res) {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const channelId = process.env.YOUTUBE_CHANNEL_ID;
  
      if (!apiKey || !channelId) {
        return res.status(500).json({ error: 'Env vars ausentes' });
      }
  
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('channelId', channelId);
      url.searchParams.set('part', 'snippet,id');
      url.searchParams.set('type', 'video');       // 👈 garante só vídeos
      url.searchParams.set('order', 'date');
      url.searchParams.set('maxResults', '1');
  
      const r = await fetch(url);
      const data = await r.json();
  
      if (!r.ok) {
        console.log('YT error:', data);
        return res.status(r.status).json(data);
      }
  
      const videoId = data?.items?.[0]?.id?.videoId || null;
      return res.status(200).json({ videoId });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
  