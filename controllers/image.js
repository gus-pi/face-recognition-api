const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where({
      id: id,
    })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('Error getting entries'));
};

const CLARIFAI_API_URL =
  'https://api.clarifai.com/v2/models/face-detection/outputs';
const PAT = '5c99ecce9bc84da98b455273e6bf1358';

const handleClarifai = async (req, res) => {
  const { imageUrl } = req.body;
  const raw = JSON.stringify({
    user_app_id: { user_id: 'ci84gqtwtwmy', app_id: 'test' },
    inputs: [{ data: { image: { url: imageUrl } } }],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Key ${PAT}`,
    },
    body: raw,
  };

  try {
    const response = await fetch(CLARIFAI_API_URL, requestOptions);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch from Clarifai API' });
  }
};

export { handleImage, handleClarifai };
