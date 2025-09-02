import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('Advertencia: GROQ_API_KEY no está definida en el entorno.');
}

app.use(cors());
app.use(express.json());

app.post('/recomendacion', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Falta el prompt' });
    }

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!groqResp.ok) {
      const errText = await groqResp.text();
      console.error('Groq respondió con error:', groqResp.status, errText);
      return res.status(502).json({ success: false, error: 'Error llamando a Groq' });
    }

    const data = await groqResp.json();
    if (data.choices && data.choices.length > 0) {
      return res.json({ success: true, recommendation: data.choices[0].message.content });
    } else {
      return res.json({ success: false, error: 'Sin respuesta de Groq' });
    }
  } catch (err) {
    console.error('Error llamando a Groq:', err.message);
    return res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
