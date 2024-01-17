'use strict';

const express = require('express');
const got = require('got');
const { performance } = require('perf_hooks');

const app = express();
const { BOAT_SERVICE_PORT, BRAND_SERVICE_PORT } = process.env;

app.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const { brand: brandId, color } = await gotWrapper(BOAT_SERVICE_PORT, id, 1250, 500);
    const { name: brand } = await gotWrapper(BRAND_SERVICE_PORT, brandId, 1250, 500);

    res.status(200).json({
      id: Number(id),
      color,
      brand
    });
  } catch (err) {
    if (err.response) {
      if (err.response.statusCode === 404) {
        return res.status(404).send('Not Found');
      }
      if (err.response.statusCode === 400) {
        return res.status(400).send('Bad Request');
      }
    }
    next(err); // Pass to default error handler
  }
});

const gotWrapper = async (port, path, mustThrowWithinThisPeriodIfAnyError, retryInterval = 1000) => {
  const start = performance.now();

  return await got(`http://localhost:${port}/${path}`, {
    retry: {
      calculateDelay: () => {
        const current = performance.now();
        const delay = (current - start + retryInterval > mustThrowWithinThisPeriodIfAnyError) ? 0 : retryInterval;
        console.log(current - start, mustThrowWithinThisPeriodIfAnyError, retryInterval);
        return delay;
      }
    }
  }).json();
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
